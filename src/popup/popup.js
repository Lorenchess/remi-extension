import * as tf from '@tensorflow/tfjs'
import {createBowVector} from "../utils/vectorize";
import {vocabulary} from "../data/vocabulary";
import {indexToLabel} from "../data/labels";


let model;

const urlMap = {
    tensorflowjs: "https://www.tensorflow.org/js",
    github: "https://github.com",
    stackoverflow: "https://stackoverflow.com",
    excalidraw: "https://excalidraw.com",
    yahoo: "https://www.yahoo.com",
    gmail: "https://mail.google.com",
    brave: "https://brave.com",
    chatgtp: "https://chat.openai.com",
    claude: "https://claude.ai",
    g4g: "https://www.geeksforgeeks.org",
    "react docs": "https://reactjs.org/docs",
    udemy: "https://www.udemy.com",
    confluence: "https://www.atlassian.com/software/confluence"
};

document.addEventListener("DOMContentLoaded", async () => {
    try {
        model = await tf.loadLayersModel("scr/model/model.json");
        console.log("Model loaded successfully", model)
    } catch (error) {
        console.error("Error loading the model", error);
        alert("Failed to load model!");
    }
})

document.getElementById("predict-btn").addEventListener("click", () => {
    const inputText = document.getElementById("input-text").value;
    if (!model) {
        alert("Model is not loaded!")
        return;
    }
    tf.tidy(() => {
        const vector = createBowVector(inputText, vocabulary);
        const inputTensor = tf.tensor2d([vector]);
        const prediction = model.predict(inputTensor);
        const predictIndex = prediction.argMax(1).dataSync()[0];
        const predictLabel = indexToLabel[predictIndex];
        handlePrediction(predictLabel);

    });
});

function handlePrediction(label) {
    if (urlMap[label]) {
        window.open(urlMap[label], "_blank");
    } else {
        document.getElementById("output").innerText =
            "Place not found. This is a list of keywords you can use: 'github', 'gmail', or 'stackoverflow', 'tensorflowjs', 'excalidraw', " +
            "'chatgpt', 'claude', 'udemy, 'g4g', 'react docs', 'yahoo', 'confluence'."
    }
}