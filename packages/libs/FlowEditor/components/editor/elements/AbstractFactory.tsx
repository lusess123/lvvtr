export class AbstractFactory {
    type :any ;
    constructor(type) {
        this.type = type;
    }

    getType() {
        return this.type;
    }
}