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
const ADD_LIT_REG     = 0x20;
const SUB_LIT_REG     = 0x21;
const SUB_REG_LIT     = 0x22;
const SUB_REG_REG     = 0x23;
const INC_REG         = 0x24;
const DEC_REG         = 0x25;
const MUL_LIT_REG     = 0x26;
const MUL_REG_REG     = 0x27;

// Logical instructions
const LSF_REG_LIT = 0x28;
const LSF_REG_REG = 0x29;
const RSF_REG_LIT = 0x2A;
const RSF_REG_REG = 0x2B;
const AND_REG_LIT = 0x2C;
const AND_REG_REG = 0x2D;
const OR_REG_LIT  = 0x2E;
const OR_REG_REG  = 0x2F;
const XOR_REG_LIT = 0x30;
const XOR_REG_REG = 0x31;
const NOT         = 0x32;


module.exports = {
    MOV_LIT_REG,
    MOV_REG_REG,
    MOV_REG_MEM,
    MOV_MEM_REG,
    MOV_LIT_MEM,
    MOV_REG_PTR_REG,
    MOV_LIT_OFF_REG,
    ADD_REG_REG,
    ADD_LIT_REG,
    SUB_LIT_REG,
    SUB_REG_LIT,
    SUB_REG_REG,
    INC_REG,
    DEC_REG,
    MUL_LIT_REG,
    MUL_REG_REG,
    JMP_NOT_EQ,
    PSH_LIT,
    PSH_REG,
    POP,
    CAL_LIT,
    CAL_REG,
    RET,
    HLT,
    LSF_REG_LIT,
    LSF_REG_REG,
    RSF_REG_LIT,
    RSF_REG_REG,
    AND_REG_LIT,
    AND_REG_REG,
    OR_REG_LIT,
    OR_REG_REG,
    XOR_REG_LIT,
    XOR_REG_REG,
    NOT
};
