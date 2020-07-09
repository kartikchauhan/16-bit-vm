/**
 * @remarks
 * | MOV | 0x1234 | r1 | MOV | 0xABCD | r2 | ADD | r1 | r2 |
 * equivalent to
 * | 0x10 | 0x12 | 0x34 | 0x11 | 0xAB | 0xCD | ADD | r1 | r2 |
 * 
 * @todo break the operations into multiple files.
 */


// Move literal values in register r1
writableBytes[i++] = MOV_LIT_REG;
writableBytes[i++] = 0x12;
writableBytes[i++] = 0x34;
writableBytes[i++] = R1;

// Move literal values in register r2
writableBytes[i++] = MOV_LIT_REG;
writableBytes[i++] = 0xAB;
writableBytes[i++] = 0xCD;
writableBytes[i++] = R2;

// Add values in registers r1 & r2
writableBytes[i++] = ADD_REG_REG;
writableBytes[i++] = R1;
writableBytes[i++] = R2;

// Move value from register to memory
writableBytes[i++] = MOV_REG_MEM;
writableBytes[i++] = ACC;
writableBytes[i++] = 0x01;
writableBytes[i++] = 0x00; // 0x0100

cpu.debug();
cpu.viewMemoryAt(cpu.getRegister('ip'));
cpu.viewMemoryAt(0x0100);
console.log("\n\n");

cpu.step();
cpu.debug();
cpu.viewMemoryAt(cpu.getRegister('ip'));
cpu.viewMemoryAt(0x0100);
console.log("\n\n");

cpu.step();
cpu.debug();
cpu.viewMemoryAt(cpu.getRegister('ip'));
cpu.viewMemoryAt(0x0100);
console.log("\n\n");

cpu.step();
cpu.debug();
cpu.viewMemoryAt(cpu.getRegister('ip'));
cpu.viewMemoryAt(0x0100);
console.log("\n\n");

cpu.step();
cpu.debug();
cpu.viewMemoryAt(cpu.getRegister('ip'));
cpu.viewMemoryAt(0x0100);
console.log("\n\n");
