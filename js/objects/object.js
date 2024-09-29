export default class Obj {
    color;
    constructor(color) {
        this.color = color;
    }
    render(renderer, color = this.color) {
    }
}
