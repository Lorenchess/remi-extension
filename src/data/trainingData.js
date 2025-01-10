/**
 * Training data
 * We need to make sure is no longer than 3 tokens/words long.
 * @type {[{text: string, label: string}]}
 */
export const trainingData = [
    { text: "go to tensorflowjs", label: "tensorflowjs" },
    { text: "visit github", label: "github" },
    { text: "stack overflow", label: "stackoverflow" },
    { text: "open excalidraw", label: "excalidraw" },
    { text: "go to yahoo", label: "yahoo" },
    { text: "go to gmail", label: "gmail" },
    { text: "open brave", label: "brave" },
    { text: "go to chatgtp", label: "chatgtp" },
    { text: "go to claude", label: "claude" }
];


/**
 * Define indexes for all the corresponding labels
 * Necessary step for the tensors
 * @type {{label: number}}
 */
export const labelToIndex = {
    tensorflowjs: 0,
    github: 1,
    stackoverflow: 2,
    excalidraw: 3,
    yahoo: 4,
    gmail: 5,
    brave: 6,
    chatgtp: 7,
    claude: 8
};

/**
 * To be able to get the length of the labels and their values
 * @type {string[]}
 */
export const indexToLabel = Object.keys(labelToIndex);
