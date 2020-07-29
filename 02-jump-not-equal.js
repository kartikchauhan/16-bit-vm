writableBytes[i++] = MOV_MEM_REG;
writableBytes[i++] = 0x01;
writableBytes[i++] = 0x00; // 0x0100
writableBytes[i++] = R1;

writableBytes[i++] = MOV_LIT_REG;
writableBytes[i++] = 0x00;
writableBytes[i++] = 0x01; // 0x0001
writableBytes[i++] = R2;

writableBytes[i++] = ADD_REG_REG;
writableBytes[i++] = R1;
writableBytes[i++] = R2;

writableBytes[i++] = MOV_REG_MEM;
writableBytes[i++] = ACC;
writableBytes[i++] = 0x01;
writableBytes[i++] = 0x00; // 0x0100

writableBytes[i++] = JMP_NOT_EQ;
writableBytes[i++] = 0x00;
writableBytes[i++] = 0x03; // 0x0003
writableBytes[i++] = 0x00;
writableBytes[i++] = 0x00; // 0x0000
