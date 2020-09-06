const createMemory = require('./create-memory');
const {
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
    XOR_REG_REG
} = require('./instruction');

class CPU {
    constructor(memory) {
        this.memory = memory;

        /**
         * @remarks
         * ip: Instruction Pointer
         * r1-4: General Purpose Registers
         * sp: Stack Pointer
         * fp: Frame Pointer
         */
        this.registers = [
            'ip', 'acc',
            'r1', 'r2', 'r3', 'r4',
            'sp', 'fp'
        ];

        this.registerMem = createMemory(this.registers.length * 2);

        // Number of General Purpose Registers
        this.nGPReg = this.registers.reduce((acc, el) => {
            return el.slice(0, 1) === 'r' && !isNaN(el.slice(1)) ? acc + 1 : acc;
        }, 0);

        /**
         * @remarks Allocate memory to every register.
         * Final representation will be something like
         * `{'ip': 0, 'acc': 2, 'r1': 4}
         */
        this.registerMap = this.registers.reduce((map, name, index) => {
            map[name] = index * 2;
            return map;
        }, {});

        this.setRegister('sp', 0xffff - 1 - 1); // -1 for zero-indexing, -1 for 2 bytes
        this.setRegister('fp', 0xffff - 1 - 1);

        this.stackFrameSize = 0;
    }

    debug() {
        const currentRegistersState = this.registers.reduce((map, name) => {
            map[name] = `0x${this.getRegister(name).toString(16).padStart(4, '0')}`;
            return map;
        }, {});

        console.table(currentRegistersState);
    }

    viewMemoryAt(address, n = 8) {
        const nextNBytes = Array.from({length: n}, (_, index) =>
            this.memory.getUint8(address + index)
        ).map(val =>
            `0x${val.toString(16).padStart(2, '0')}`
        );

        console.log('\x1b[32m%s\x1b[0m', `0x${address.toString(16).padStart(4, '0')}`, ':', `${nextNBytes.join(' ')}`);
    }

    getRegister(name) {
        if(!(name in this.registerMap))
            throw new Error(`No such register '${name}'`);

        return this.registerMem.getUint16(this.registerMap[name]);
    }

    setRegister(name, value) {
        if(!(name in this.registerMap))
            throw new Error(`No such register '${name}'`);

        this.registerMem.setUint16(this.registerMap[name], value);
    }

    fetch() {
        const nextInstructionAddress = this.getRegister('ip');
        const instruction = this.memory.getUint8(nextInstructionAddress);
        this.setRegister('ip', nextInstructionAddress + 1);
        return instruction;
    }

    fetch16() {
        const nextInstructionAddress = this.getRegister('ip');
        const instruction = this.memory.getUint16(nextInstructionAddress);
        this.setRegister('ip', nextInstructionAddress + 2);
        return instruction;
    }

    push(value) {
        const spAddress = this.getRegister('sp');
        this.memory.setUint16(spAddress, value);
        this.setRegister('sp', spAddress - 2);
        this.stackFrameSize += 2;
    }

    pushState() {
        for(let i = 1; i <= this.nGPReg; i++) {
            this.push(this.getRegister(`r${i}`));
        }

        this.push(this.getRegister('ip'));
        this.push(this.stackFrameSize + 2);

        this.setRegister('fp', this.getRegister('sp'));
        this.stackFrameSize = 0;
    }

    pop() {
        const nextSpAddress = this.getRegister('sp') + 2;
        this.setRegister('sp', nextSpAddress);
        this.stackFrameSize -= 2;
        return this.memory.getUint16(nextSpAddress);
    }

    popState() {
        const framePointerAddress = this.getRegister('fp');
        this.setRegister('sp', framePointerAddress);

        // Get Stack frame size
        this.stackFrameSize = this.pop();

        // Get Instruction Pointer address before calling subroutine.
        this.setRegister('ip', this.pop());

        // Populate the registers with the values they had before calling subroutine.
        for(let i = this.nGPReg; i > 0; i--) {
            this.setRegister(`r${i}`, this.pop());
        }

        // Get number of arguments that were passed to the subroutine.
        const numArgs = this.pop();
        for(let i = 0; i < numArgs; i++) {
            this.pop();
        }

        this.setRegister('fp', framePointerAddress + this.stackFrameSize);
    }

    execute(instruction) {
        switch(instruction) {
            case MOV_LIT_REG: {
                const literal = this.fetch16();
                const register = (this.fetch() % this.registers.length) * 2;
                this.registerMem.setUint16(register, literal);
                return;
            }

            case MOV_REG_REG: {
                const fromRegister = (this.fetch() % this.registers.length) * 2;
                const toRegister = (this.fetch() % this.registers.length) * 2;
                const value = this.registerMem.getUint16(fromRegister);
                this.registerMem.setUint16(toRegister, value);
                return;
            }

            case MOV_REG_MEM: {
                const fromRegister = (this.fetch() % this.registers.length) * 2;
                const address = this.fetch16();
                const value = this.registerMem.getUint16(fromRegister);
                this.memory.setUint16(address, value);
                return;
            }

            case MOV_MEM_REG: {
                const address = this.fetch16();
                const toRegister = (this.fetch() % this.registers.length) * 2;
                const value = this.memory.getUint16(address);
                this.registerMem.setUint16(toRegister, value);
                return;
            }

            case MOV_LIT_MEM: {
                const value = this.fetch16();
                const address = this.fetch16();
                this.memory.setUint16(address, value);
                return;
            }

            case MOV_REG_PTR_REG: {
                const r1 = (this.fetch() % this.registers.length) * 2;
                const r2 = (this.fetch() % this.registers.length) * 2;
                const ptr = this.registers.getUint16(r1);
                const value = this.memory.getUint16(ptr);
                this.registerMem.setUint16(r2, value);
                return;
            }

            case MOV_LIT_OFF_REG: {
                const baseAddress = this.fetch16();
                const r1 = (this.fetch() % this.registers.length) * 2; // register that holds the offset
                const r2 = (this.fetch() % this.registers.length) * 2;
                const offset = this.registerMem.getUint16(r1);
                const value = this.memory.getUint16(baseAddress + offset);
                this.registerMem.setUint16(r2, value);
                return;
            }

            case ADD_REG_REG: {
                const r1 = (this.fetch() % this.registers.length) * 2;
                const r2 = (this.fetch() % this.registers.length) * 2;
                const r1Value = this.registerMem.getUint16(r1);
                const r2Value = this.registerMem.getUint16(r2);
                this.setRegister('acc', r1Value + r2Value);
                return;
            }

            case ADD_LIT_REG: {
                const literal = this.fetch16();
                const register = (this.fetch() % this.registers.length) * 2;
                const value = this.registerMem.getUint16(register);
                this.setRegister('acc', literal + value);
                return;
            }

            case SUB_LIT_REG: {
                const literal = this.fetch16();
                const register = (this.fetch() % this.registers.length) * 2;
                const value = this.registerMem.getUint16(register);
                this.setRegister('acc', value - literal);
                return;
            }

            case SUB_REG_LIT: {
                const register = (this.fetch() % this.registers.length) * 2;
                const value = this.registerMem.getUint16(register);
                const literal = this.fetch16();
                this.setRegister('acc', literal - value);
                return;
            }

            case SUB_REG_REG: {
                const r1 = (this.fetch() % this.registers.length) * 2;
                const r2 = (this.fetch() % this.registers.length) * 2;
                const r1Value = this.registerMem.getUint16(r1);
                const r2Value = this.registerMem.getUint16(r2);
                this.setRegister('acc', r1Value - r2Value);
                return;
            }

            case MUL_LIT_REG: {
                const literal = this.fetch16();
                const register = (this.fetch() % this.registers.length) * 2;
                const value = this.registerMem.getUint16(register);
                this.setRegister('acc', literal * value);
                return;
            }
            
            case MUL_REG_REG: {
                const r1 = (this.fetch() % this.registers.length) * 2;
                const r2 = (this.fetch() % this.registers.length) * 2;
                const r1Value = this.registerMem.getUint16(r1);
                const r2Value = this.registerMem.getUint16(r2);
                this.setRegister('acc', r1Value * r2Value);
                return;
            }

            // Increment value in register (in place)
            case INC_REG: {
                const register = (this.fetch() % this.registers.length) * 2;
                const value = this.registerMem.getUint16(register);
                this.registerMem.setUint16(register, ++value);
                return;
            }

            // Decement value in register (in place)
            case DEC_REG: {
                const register = (this.fetch() % this.registers.length) * 2;
                const value = this.registerMem.getUint16(register);
                this.registerMem.setUint16(register, --value);
                return;
            }

            // Left shift register by literal (in place)
            case LSF_REG_LIT: {
                const register = (this.fetch() % this.registers.length) * 2;
                const value = this.registerMem.getUint16(register);
                const literal = this.fetch16();
                this.registerMem.setUint16(register, value << literal);
                return;
            }

            // Left shift register by register (in place)
            case LSF_REG_REG: {
                const r1 = (this.fetch() % this.registers.length) * 2;
                const r2 = (this.fetch() % this.registers.length) * 2;
                const r1Value = this.registerMem.getUint16(r1);
                const r2Value = this.registerMem.getUint16(r2);
                this.registerMem.setUint16(register, r1Value << r2Value);
                return;
            }

            // Right shift register by literal (in place)
            case RSF_REG_LIT: {
                const register = (this.fetch() % this.registers.length) * 2;
                const value = this.registerMem.getUint16(register);
                const literal = this.fetch16();
                this.registerMem.setUint16(register, value >> literal);
                return;
            }

            // Right shift register by register (in place)
            case LSF_REG_REG: {
                const r1 = (this.fetch() % this.registers.length) * 2;
                const r2 = (this.fetch() % this.registers.length) * 2;
                const r1Value = this.registerMem.getUint16(r1);
                const r2Value = this.registerMem.getUint16(r2);
                this.registerMem.setUint16(register, r1Value >> r2Value);
                return;
            }

            // And register with literal
            case AND_REG_LIT: {
                const register = (this.fetch() % this.registers.length) * 2;
                const value = this.registerMem.getUint16(register);
                const literal = this.fetch16();
                this.setRegister('acc', value & literal);
                return;
            }

            // And register with register
            case AND_REG_REG: {
                const r1 = (this.fetch() % this.registers.length) * 2;
                const r2 = (this.fetch() % this.registers.length) * 2;
                const r1Value = this.registerMem.getUint16(r1);
                const r2Value = this.registerMem.getUint16(r2);
                this.setRegister('acc', r1Value & r2Value);
                return;
            }

            // Or register with literal
            case OR_REG_LIT: {
                const register = (this.fetch() % this.registers.length) * 2;
                const value = this.registerMem.getUint16(register);
                const literal = this.fetch16();
                this.setRegister('acc', value | literal);
                return;
            }

            // Or register with register
            case OR_REG_REG: {
                const r1 = (this.fetch() % this.registers.length) * 2;
                const r2 = (this.fetch() % this.registers.length) * 2;
                const r1Value = this.registerMem.getUint16(r1);
                const r2Value = this.registerMem.getUint16(r2);
                this.setRegister('acc', r1Value | r2Value);
                return;
            }

            // Xor register with literal
            case XOR_REG_LIT: {
                const register = (this.fetch() % this.registers.length) * 2;
                const value = this.registerMem.getUint16(register);
                const literal = this.fetch16();
                this.setRegister('acc', value ^ literal);
                return;
            }

            // Xor register with register
            case XOR_REG_REG: {
                const r1 = (this.fetch() % this.registers.length) * 2;
                const r2 = (this.fetch() % this.registers.length) * 2;
                const r1Value = this.registerMem.getUint16(r1);
                const r2Value = this.registerMem.getUint16(r2);
                this.setRegister('acc', r1Value ^ r2Value);
                return;
            }

            case JMP_NOT_EQ: {
                const literal = this.fetch16();
                const address = this.fetch16();
                const accValue = this.getRegister('acc');

                if(literal !== accValue) {
                    this.setRegister('ip', address);
                }

                return;
            }

            case PSH_LIT: {
                const value = this.fetch16();
                this.push(value);
                return;
            }

            case PSH_REG: {
                const register = (this.fetch() % this.registers.length) * 2;
                this.push(this.registerMem.getUint16(register));
                return;
            }

            case POP: {
                const register = (this.fetch() % this.registers.length) * 2;
                const value = this.pop();
                this.registerMem.setUint16(register, value);
                return;
            }

            case CAL_LIT: {
                const address = this.fetch16();
                this.pushState();
                this.setRegister('ip', address);
                return;
            }

            case CAL_REG: {
                const register = (this.fetch() % this.registers.length) * 2;
                const address = this.registerMem.getUint16(register);
                this.pushState();
                this.setRegister('ip', address);
                return;
            }

            case RET: {
                this.popState();
                return;
            }

            case HLT: {
                return true;
            }
        }
    }

    step() {
        const instruction = this.fetch();
        return this.execute(instruction);
    }

    run() {
        const halt = this.step();
        if(!halt) {
            setImmediate(() => this.run());
        }
    }
}

module.exports = CPU;
