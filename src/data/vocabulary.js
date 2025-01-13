import {trainingData, validationData} from "./trainingData";


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