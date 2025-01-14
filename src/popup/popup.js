import * as tf from '@tensorflow/tfjs'
import {createBowVector} from "../utils/vectorize";
import {vocabulary} from "../data/vocabulary";
import {indexToLabel} from "../data/labels";
import {logMessages, showToast} from "../utils/utils";


let model;

const urlMap = {
    tensorflowjs: "https://www.tensorflow.org/js",
    github: "https://github.com",
    stackoverflow: "https://stackoverflow.com",
    excalidraw: "https://excalidraw.com",
    yahoo: "https://www.yahoo.com",
    gmail: "https://mail.google.com",
    brave: "https://search.brave.com/",
    chatgpt: "https://chat.openai.com",
    claude: "https://claude.ai",
    geeksforgeeks: "https://www.geeksforgeeks.org",
    "react docs": "https://reactjs.org/docs",
    udemy: "https://www.udemy.com",
    confluence: "https://www.atlassian.com/software/confluence",
    nativity: "https://www.nativitycatholicschool.org/"
};

const modelPath = "../model/model.json";

document.addEventListener("DOMContentLoaded", async () => {
    const output = document.getElementById("output");
    const inputField = document.getElementById("input-text");
    const predictBtn = document.getElementById("predict-btn");
    output.innerText = "Loading model..."

    try {
        model = await tf.loadLayersModel(modelPath);
        console.log("Model loaded successfully", model);
        output.innerText = "";

    } catch (error) {
        console.error("Error loading the model", error);
        output.innerText = "Failed to load model!";
        showToast("Error loading model", error.message);
        return;
    }

    handleEvents(output, inputField, predictBtn);

    //Cleanup on unload
    window.addEventListener("unload", () => {
        if (model) model.dispose();
        tf.disposeVariables();
    })

})

function handleEvents(output, inputField, predictBtn) {

    if (!model) {
        showToast("Model is not loaded!")
        return;
    }
    inputField.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            predictBtn.click();
        }
    })

    predictBtn.addEventListener("click", () => {
        const inputText = document.getElementById("input-text").value;

        if (!inputText) {
            showToast("Please enter a keyword.")
            return;
        }

        tf.tidy(() => {
            const vector = createBowVector(inputText, vocabulary);
            const inputTensor = tf.tensor2d([vector]);
            const prediction = model.predict(inputTensor);

            const predictionsArray = prediction.dataSync();
            const confidence = Math.max(...predictionsArray)
            const predictedIndex = prediction.argMax(1).dataSync()[0];
            const predictedLabel = indexToLabel[predictedIndex];

            logMessages(`Prediction label: ${predictedLabel}`);

            handlePrediction(predictedLabel, confidence);

        });
    })
}

function handlePrediction(label, confidence) {
    const helpMessage = displayHelpMessage();

    logMessages(`Confidence: ${confidence}`);

    if (confidence < 0.5 || label === "unknown") {
        showToast(helpMessage);
    }
    else if (urlMap[label]) {
        window.open(urlMap[label], "_blank");
    } else {
        showToast(helpMessage);
    }
}

function displayHelpMessage() {
    return "Keyword not found. This is a list of keywords you can use: 'github', 'gmail', or 'stackoverflow', 'tensorflowjs', 'excalidraw', " +
        "'chatgpt', 'claude', 'udemy', 'brave', 'g4g', 'react docs', 'yahoo', 'confluence', 'nativity'.";
}


