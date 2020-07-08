const CPU = require('./cpu');
const createMemory = require('./create-memory');
const {
    MOV_LIT_R1,
    MOV_LIT_R2,
    ADD_REG_REG
} = require('./instruction');

const memory = createMemory(256);
const writableBytes = new Uint8Array(memory.buffer);

const cpu = new CPU(memory);

/**
 * @remarks
 * | MOV | 0x1234 | r1 | MOV | 0xABCD | r2 | ADD | r1 | r2 |
 * equivalent to
 * | 0x10 | 0x12 | 0x34 | 0x11 | 0xAB | 0xCD | ADD | r1 | r2 |
 */

// Move literal values in register r1
writableBytes[0] = MOV_LIT_R1;
writableBytes[1] = 0x12;
writableBytes[2] = 0x34;

writableBytes[3] = MOV_LIT_R2;
writableBytes[4] = 0xAB;
writableBytes[5] = 0xCD;

writableBytes[6] = ADD_REG_REG;
writableBytes[7] = 2; // r1 index in registerMemory
writableBytes[8] = 3; // r2 index in registerMemory

cpu.debug();

cpu.step();
cpu.debug();

cpu.step();
cpu.debug();

cpu.step();
cpu.debug();
