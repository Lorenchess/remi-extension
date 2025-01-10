import { trainingData, labelToIndex } from "../data/trainingData.js";
import { vocabulary } from "../data/vocabulary.js";
import { createBowVector } from "../utils/vectorize.js";
import * as tf from '@tensorflow/tfjs'
let model;

/**
 * Prepare data for tensors to train the model
 */
const inputs = trainingData.map(d => createBowVector(d.text, vocabulary));
const labels = trainingData.map(d => labelToIndex[d.label]);

const {xsInputs, ysOutputs} = tf.tidy(() => {
    /**
     * Creates inputs and outputs for the model in tensors
     */
    const xsInputs = tf.tensor2d(inputs, [inputs.length, 3]);
    const ysOutputs = tf.oneHot(tf.tensor1d(labels, 'int32'), Object.keys(labelToIndex).length)

    return {xsInputs, ysOutputs}
})

//Build model
function createModel() {
    const model = tf.sequential();
    model.add(tf.layers.dense({
        inputShape: [Object.keys(vocabulary).length], units: 8, activation: "relu"
    }));
    model.add(tf.layers.dense({
        units: Object.keys(labelToIndex).length, activation: "softmax"
    }));
    model.compile({
        optimizer: "adam",
        loss: "categoricalCrossentropy",
        metric:["acuracy"]
    });
    return model;
}

//Train the model
document.getElementById("train-btn").addEventListener("click", async () => {
    model = createModel();
    await model.fit(xsInputs, ysOutputs, {
        epochs: 20,
        callbacks: {
            onEpochEnd: (epoch, logs) => console.log(`Epoc ${epoch + 1}: Loss = ${logs.loss}, Accuracy = ${logs.acc}`)
        }
    });
    alert("Model trained successfully!")
    document.getElementById("save-btn").disable = false;
});

//Save Model
document.getElementById("save-btn").addEventListener("click", async ()=> {
    await model.save("downloads://model");
    alert("Model saved successfully!")
})


