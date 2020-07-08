const createMemory = require('./create-memory');
const { MOV_LIT_R1, MOV_LIT_R2, ADD_REG_REG } = require('./instruction');

class CPU {
    constructor(memory) {
        this.memory = memory;

        this.registers = [
            'ip', 'acc',
            'r1', 'r2', 'r3', 'r4'
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
    }

    debug() {
        const currentRegistersState = this.registers.reduce((map, name) => {
            map[name] = `0x${this.getRegister(name).toString(16).padStart(4, '0')}`;
            return map;
        }, {});

        console.table(currentRegistersState);
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

    execute(instruction) {
        switch(instruction) {
            case MOV_LIT_R1: {
                const literal = this.fetch16();
                this.setRegister('r1', literal);
                return;
            }

            case MOV_LIT_R2: {
                const literal = this.fetch16();
                this.setRegister('r2', literal);
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
        }
    }

    step() {
        const instruction = this.fetch();
        return this.execute(instruction);
    }
}

module.exports = CPU;

