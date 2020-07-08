const createMemory = (memory) => {
    const arrayBuffer = new ArrayBuffer(memory);
    const dataView = new DataView(arrayBuffer);
    return dataView;
}

module.exports = createMemory;
