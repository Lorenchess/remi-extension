/**
 * Converts a text input into a Bag-of-Words vector.
 * @param {string} text - The input text to be vectorized.
 * @param {object} vocabulary - The vocabulary mapping words to indices.
 * @returns {number[]} A binary vector representing the presence of words in the input.
 */
export function createBowVector(text, vocabulary) {
    const vector = new Array(Object.keys(vocabulary).length).fill(0);
    text.toLowerCase().split(" ").forEach(token => {
        if (vocabulary[token] !== undefined) {
            vector[vocabulary[token]] = 1; // Mark the token as present
        }
    });
    return vector;
}