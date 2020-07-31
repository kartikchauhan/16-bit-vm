writableBytes[i++] = MOV_LIT_REG;
writableBytes[i++] = 0x51;
writableBytes[i++] = 0x51;
writableBytes[i++] = R1;

writableBytes[i++] = MOV_LIT_REG;
writableBytes[i++] = 0x42;
writableBytes[i++] = 0x42;
writableBytes[i++] = R2;

writableBytes[i++] = PSH_REG;
writableBytes[i++] = R1;

writableBytes[i++] = PSH_REG;
writableBytes[i++] = R2;

writableBytes[i++] = POP;
writableBytes[i++] = R1;

writableBytes[i++] = POP;
writableBytes[i++] = R2;