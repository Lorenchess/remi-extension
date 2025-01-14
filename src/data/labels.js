import {trainingData, validationData} from "./trainingData";


const generateLabelMappings = (data) => {
    const labels = new Set();
    data.forEach(({ label }) => labels.add(label));
    const labelToIndex = Array.from(labels).reduce((acc, label, index) => {
        acc[label] = index;
        return acc;
    }, {});

    const indexToLabel = Array.from(labels);
    console.log("labelToIndex: ", labelToIndex)
    console.log("indexToLabel: ", indexToLabel)

    return { labelToIndex, indexToLabel }
}

export const { labelToIndex, indexToLabel } = generateLabelMappings([...trainingData, ...validationData])