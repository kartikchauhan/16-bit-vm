const readline           = require('readline');
const CPU                = require('./cpu');
const createMemory       = require('./create-memory');
const MemoryMapper       = require('./memory-mapper');
const createScreenDevice = require('./screen-device');
const {
    MOV_LIT_REG,
    MOV_REG_MEM,
    MOV_MEM_REG,
    ADD_REG_REG,
    JMP_NOT_EQ,
    PSH_LIT,
    PSH_REG,
    POP,
    CAL_LIT,
    RET,
    HLT
} = require('./instruction');

const IP  = 0;
const ACC = 1;
const R1  = 2;
const R2  = 3;
const R3  = 4;
const R4  = 5;

const MM = new MemoryMapper();

const memory = createMemory(256 * 256);
MM.map(memory, 0, 0xffff);

// Map 0xFF bytes of the address space to an 'output device' - just stdout
MM.map(createScreenDevice(), 0x3000, 0x30ff, true);

const writableBytes = new Uint8Array(memory.buffer);

const cpu = new CPU(MM);

let i = 0;

const writeCharToScreen = (char, command, position) => {
    writableBytes[i++] = MOV_LIT_REG;
    writableBytes[i++] = command;
    writableBytes[i++] = char.charCodeAt(0);
    writableBytes[i++] = R1;
    
    writableBytes[i++] = MOV_REG_MEM;
    writableBytes[i++] = R1
    writableBytes[i++] = 0x30;
    writableBytes[i++] = position;
};

// Clear the screen before printing anything
writeCharToScreen(' ', 0xff, 0);

for(let index = 0; index <= 0xff; index++) {
    const command = index % 2 === 0
        ? 0x01 // Bold character
        : 0x02 // Regular character
    writeCharToScreen('*', command, index);
}
writableBytes[i++] = HLT;

cpu.run();
