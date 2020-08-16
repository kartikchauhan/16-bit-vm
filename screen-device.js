const eraseScreen = () => {
    process.stdout.write('\x1b[2J');
}

const moveTo = (x, y) => {
    process.stdout.write(`\x1b[${y};${x}H`);
}

const setBold = () => {
    process.stdout.write('\x1b[1m');
}

const setRegular = () => {
    process.stdout.write('\x1b[0m');
}


const createScreenDevice = () => {
    return {
        getUint8: () => 0,
        getUint16: () => 0,
        setUint16: (address, data) => {
            const characterValue = data & 0x00ff;
            const character = String.fromCharCode(characterValue);
            const command = (data & 0xff00) >> 8;

            if(command === 0xff) {
                eraseScreen();
            } else if(command === 0x01) {
                setBold();
            } else if(command === 0x02) {
                setRegular();
            }

            const x = (address % 16) + 1;
            const y = Math.floor(address / 16) + 1;
            moveTo(x, y);
            process.stdout.write(character);
        }
    }
};

module.exports = createScreenDevice;
