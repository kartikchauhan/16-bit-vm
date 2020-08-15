const readline     = require('readline');
const CPU          = require('./cpu');
const createMemory = require('./create-memory');
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
    RET
} = require('./instruction');

const IP  = 0;
const ACC = 1;
const R1  = 2;
const R2  = 3;
const R3  = 4;
const R4  = 5;

const memory = createMemory(256 * 256);
const writableBytes = new Uint8Array(memory.buffer);

const cpu = new CPU(memory);

const subRoutineAddress = 0x3000;
let i = 0;

writableBytes[i++] = PSH_LIT;
writableBytes[i++] = 0x33;
writableBytes[i++] = 0x33;

writableBytes[i++] = PSH_LIT;
writableBytes[i++] = 0x22;
writableBytes[i++] = 0x22;

writableBytes[i++] = PSH_LIT;
writableBytes[i++] = 0x11;
writableBytes[i++] = 0x11;

writableBytes[i++] = MOV_LIT_REG;
writableBytes[i++] = 0x12;
writableBytes[i++] = 0x34;
writableBytes[i++] = R1;

writableBytes[i++] = MOV_LIT_REG;
writableBytes[i++] = 0x56;
writableBytes[i++] = 0x78;
writableBytes[i++] = R4;

writableBytes[i++] = PSH_LIT;
writableBytes[i++] = 0x00;
writableBytes[i++] = 0x00;

writableBytes[i++] = CAL_LIT;
writableBytes[i++] = (subRoutineAddress & 0xff00) >> 8;
writableBytes[i++] = (subRoutineAddress & 0x00ff) >> 8;

writableBytes[i++] = PSH_LIT;
writableBytes[i++] = 0x44;
writableBytes[i++] = 0x44;

// Subroutine
i = subRoutineAddress;

writableBytes[i++] = PSH_LIT;
writableBytes[i++] = 0x01;
writableBytes[i++] = 0x02;

writableBytes[i++] = PSH_LIT;
writableBytes[i++] = 0x03;
writableBytes[i++] = 0x04;

writableBytes[i++] = PSH_LIT;
writableBytes[i++] = 0x05;
writableBytes[i++] = 0x06;

writableBytes[i++] = MOV_LIT_REG;
writableBytes[i++] = 0x07;
writableBytes[i++] = 0x08;
writableBytes[i++] = R1;

writableBytes[i++] = MOV_LIT_REG;
writableBytes[i++] = 0x09;
writableBytes[i++] = 0x0A;
writableBytes[i++] = R4;

writableBytes[i++] = RET;

cpu.debug();
cpu.viewMemoryAt(cpu.getRegister('ip'));
cpu.viewMemoryAt(0xffff - 1 - 42, 44); // View memory at next 44 bytes
console.log("\n\n");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', () => {
    cpu.step();
    cpu.debug();
    cpu.viewMemoryAt(cpu.getRegister('ip'));
    cpu.viewMemoryAt(0xffff - 1 - 42, 44);
    console.log("\n\n");
});
