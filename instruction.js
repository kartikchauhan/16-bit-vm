const MOV_LIT_REG     = 0x10;
const MOV_REG_REG     = 0x11;
const MOV_REG_MEM     = 0x12;
const MOV_MEM_REG     = 0x13;
const ADD_REG_REG     = 0x14;
const JMP_NOT_EQ      = 0x15;
const PSH_LIT         = 0x16;
const PSH_REG         = 0x17;
const POP             = 0x18;
const CAL_LIT         = 0x19;
const CAL_REG         = 0x1A;
const RET             = 0x1B;
const HLT             = 0x1C;
const MOV_LIT_MEM     = 0x1D;
const MOV_REG_PTR_REG = 0x1E; // Move register pointer to register
const MOV_LIT_OFF_REG = 0x1F; // Move literal + register to register

module.exports = {
    MOV_LIT_REG,
    MOV_REG_REG,
    MOV_REG_MEM,
    MOV_MEM_REG,
    MOV_LIT_MEM,
    MOV_REG_PTR_REG,
    MOV_LIT_OFF_REG,
    ADD_REG_REG,
    JMP_NOT_EQ,
    PSH_LIT,
    PSH_REG,
    POP,
    CAL_LIT,
    CAL_REG,
    RET,
    HLT
};
