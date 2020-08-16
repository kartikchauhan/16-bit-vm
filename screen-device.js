const moveTo = (x, y) => {
    process.stdout.write(`\x1b[${y};${x}H`);
}

const createScreenDevice = () => {
    return {
        getUint8: () => 0,
        getUint16: () => 0,
        setUint16: (address, data) => {
            const characterValue = data & 0x00ff;
            const character = String.fromCharCode(characterValue);

            const x = (address % 16) + 1;
            const y = Math.floor(address / 16) + 1;
            moveTo(x, y);
            process.stdout.write(character);
        }
    }
};

module.exports = createScreenDevice;
