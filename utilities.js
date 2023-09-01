export const average = array => array.reduce((a, b) => a + b) / array.length;

export const median = (numbers) => {
    const sorted = Array.from(numbers).sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
}

export const sd = (array) => {
    return Math.sqrt(array.map(x => Math.pow(x - average(array), 2)).reduce((a, b) => a + b) / array.length)
}     