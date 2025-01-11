import {trainingData, validationData} from "./trainingData";

// /*export const vocabulary = {
//     go: 0,
//     to: 1,
//     tensorflowjs: 2,
//     visit: 3,
//     github: 4,
//     stack: 5,
//     overflow: 6,
//     open: 7,
//     excalidraw: 8,
//     yahoo: 9,
//     gmail: 10,
//     brave: 11,
//     chatgtp: 12,
//     claude: 13,
//     g4g: 14,
//     react: 15,
//     docs: 16,
//     udemy: 17,
//     confluence: 18,
//     documentation: 19,
//     courses: 20
//
// }; */

const generateVocabulary = ( data )=> {
    const words = new Set();
    data.forEach(({ text }) => {
        text.toLowerCase().split(" ").forEach(word => words.add(word));
    })
    return Array.from(words).reduce((acc, word, index) => {
        acc[word] = index;
        return acc;
    }, {})
}

export const verifyVocabulary = (vocabulary) => {
    const allWords = new Set();
    [...trainingData, ...validationData].forEach(({ text}) => {
        text.toLowerCase().split(" ").forEach(word => allWords.add(word));
    })
    console.log("All Words:", [...allWords]);
    console.log("Vocabulary Keys:", Object.keys(vocabulary));
}

export const vocabulary = generateVocabulary([...trainingData, ...validationData]);