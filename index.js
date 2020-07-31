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
    CAL_LIT
} = require('./instruction');

const IP  = 0;
const ACC = 1;
const R1  = 2;
const R2  = 3;

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

cpu.debug();
cpu.viewMemoryAt(cpu.getRegister('ip'));
// cpu.viewMemoryAt(0x0100);
cpu.viewMemoryAt(0xffff - 1 - 6); // Since the stack grows upwards, and viewMemoryAt shows following 7 bytes, we subtract 6 from the address.
console.log("\n\n");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', () => {
    cpu.step();
    cpu.debug();
    cpu.viewMemoryAt(cpu.getRegister('ip'));
    // cpu.viewMemoryAt(0x0100);
    cpu.viewMemoryAt(0xffff - 1 - 6);
    console.log("\n\n");
});
