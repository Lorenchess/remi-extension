import {trainingData, validationData} from "../data/trainingData.js";
import {verifyVocabulary, vocabulary} from "../data/vocabulary.js";
import { createBowVector } from "../utils/vectorize.js";
import * as tf from '@tensorflow/tfjs'
import {labelToIndex} from "../data/labels";
let model;

//Logs to the console the vocabulary verification...
verifyVocabulary(vocabulary);

/**
 * Prepare data for tensors to train the model
 */
const inputs = trainingData.map(d => createBowVector(d.text, vocabulary));
const labels = trainingData.map(d => labelToIndex[d.label]);

/**
 * Prepare data for tensors to validate the model
 */
const validationTexts = validationData.map(d => createBowVector(d.text, vocabulary));
const validationLabels = validationData.map(d => labelToIndex[d.label])

const {xsInputs, ysOutputs, xsValidation, ysValidation} = tf.tidy(() => {
    /**
     * Creates inputs and outputs for the model in tensors
     * preparing the labels with oneHot is typical for classification problems,
     * and it matches with softmax activation function
     */
    const xsInputs = tf.tensor2d(inputs);
    const ysOutputs = tf.oneHot(tf.tensor1d(labels, 'int32'), Object.keys(labelToIndex).length);

    const xsValidation = tf.tensor2d(validationTexts);
    const ysValidation = tf.oneHot(tf.tensor1d(validationLabels, "int32"), Object.keys(labelToIndex).length)

    return {xsInputs, ysOutputs, xsValidation, ysValidation}
})

//Clean up tensors after training:
function disposeTensors() {
    if (xsInputs) xsInputs.dispose();
    if (ysOutputs) ysOutputs.dispose();
    if (xsValidation) xsValidation.dispose();
    if (ysValidation) ysValidation.dispose();
    console.log("Tensors disposed.");
}

//Build model
/**
 * Creates a sequential model with two layers.
 * According to docs: "A sequential model is any model where the outputs of one layer are the inputs to the next layer"
 * The first layer have a inputShape of 8 nodes and uses "relu" as activation function. Each layer needs an activation fn.
 * The second and final layer gives the output of 8 neurons,one per label class that are our keywords,
 * and it has softmax as activation function. Softmax output is a probability distribution over all classes which total sum is 1, ex [0.7, 0.2, 0.1, 0.0]
 * This match exactly with the ysOutput tensor that uses oneHot. This is a must.
 * @returns {Sequential}
 */
function createModel() {
    console.log("creating the model...")
    const model = tf.sequential();

    model.add(tf.layers.dense({
        inputShape: [Object.keys(vocabulary).length],
        units: 32,
        activation: "relu"
    }));

    model.add(tf.layers.dropout({ rate: 0.3 }));

    model.add(tf.layers.dense({
        units: 16,
        activation: "relu"
    }));

    model.add(tf.layers.batchNormalization());

    model.add(tf.layers.dense({
        units: Object.keys(labelToIndex).length,
        activation: "softmax"
    }))

    model.compile({
        optimizer: tf.train.adam(0.01),
        loss: "categoricalCrossentropy",
        metrics:["accuracy"]
    });
    model.summary();
    return model;
}

//Train the model
document.getElementById("train-btn").addEventListener("click", async () => {
    if (model) {
        console.log("Disposing of the previous model...");
        model.dispose(); // Dispose of the previous model
        model = null;    // Reset the model reference
    }

    console.log("Clearing TensorFlow.js memory...")
    tf.disposeVariables();


 try {
     model = createModel();

     const progress = document.createElement("p");
     document.body.appendChild(progress);

     console.log("Memory before training:", tf.memory());

     await model.fit(xsInputs, ysOutputs, {
         epochs: 50,
         batchSize: Math.min(4, trainingData.length),
         validationData: [xsValidation, ysValidation],
         callbacks: {
             onEpochEnd: (epoch, logs) => {
                 const progressText = `Epoch ${epoch + 1}: Loss = ${logs.loss}, Accuracy = ${logs.acc}, ` +
                     `Validation Loss = ${logs.val_loss}, Validation Accuracy = ${logs.val_acc}`;
                 console.log(progressText);
                 progress.innerText = progressText;
             }
         }
     });
     alert("Model trained successfully!");
     document.getElementById("save-btn").disabled = false;
 } catch (error) {
     console.error("Error during model training:", error);
 } finally {
     disposeTensors();
 }
});

//Save Model
document.getElementById("save-btn").addEventListener("click", async ()=> {
    await model.save("downloads://model");
    alert("Model saved successfully!")
})


