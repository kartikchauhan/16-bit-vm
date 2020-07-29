const createMemory = require('./create-memory');
const {
    MOV_LIT_REG,
    MOV_REG_REG,
    MOV_REG_MEM,
    MOV_MEM_REG,
    ADD_REG_REG,
    JMP_NOT_EQ,
    PSH_LIT,
    PSH_REG,
    POP
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

        /**
         * @remarks Allocate memory to every register.
         * Final representation will be something like
         * `{'ip': 0, 'acc': 2, 'r1': 4}
         */
        this.registerMap = this.registers.reduce((map, name, index) => {
            map[name] = index * 2;
            return map;
        }, {});

        this.setRegister('sp', this.memory.byteLength - 1 - 1); // -1 for zero-indexing, -1 for 2 bytes
        this.setRegister('fp', this.memory.byteLength - 1 - 1);
    }

    debug() {
        const currentRegistersState = this.registers.reduce((map, name) => {
            map[name] = `0x${this.getRegister(name).toString(16).padStart(4, '0')}`;
            return map;
        }, {});

        console.table(currentRegistersState);
    }

    viewMemoryAt(address) {
        const next8Bytes = Array.from({length: 8}, (_, index) =>
            this.memory.getUint8(address + index)
        ).map(val =>
            `0x${val.toString(16).padStart(2, '0')}`
        );

        console.log(`0x${address.toString(16).padStart(4, '0')}: ${next8Bytes.join(' ')}`);
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
    }

    pop() {
        const nextSpAddress = this.getRegister('sp') + 2;
        this.setRegister('sp', nextSpAddress);
        return this.memory.getUint16(nextSpAddress);
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

            case ADD_REG_REG: {
                const r1 = this.fetch();
                const r2 = this.fetch();
                const r1Value = this.registerMem.getUint16(r1 * 2);
                const r2Value = this.registerMem.getUint16(r2 * 2);
                this.setRegister('acc', r1Value + r2Value);
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
        }
    }

    step() {
        const instruction = this.fetch();
        return this.execute(instruction);
    }
}

module.exports = CPU;
