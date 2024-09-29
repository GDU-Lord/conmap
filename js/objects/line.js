import Obj from "./object.js";
export default class Line extends Obj {
    a;
    b;
    constructor(a, b, color = "black") {
        super(color);
        this.a = a;
        this.b = b;
    }
    render(renderer, color = this.color) {
        renderer.ctx.beginPath();
        renderer.ctx.moveTo(this.a.x, this.a.y);
        renderer.ctx.lineTo(this.b.x, this.b.y);
        renderer.ctx.strokeStyle = color;
        renderer.ctx.stroke();
        renderer.ctx.closePath();
    }
    get length() {
        return this.b.sub(this.a).length;
    }
}
