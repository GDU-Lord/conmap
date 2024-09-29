import Obj from "./object.js";
export default class Circle extends Obj {
    pos;
    r;
    fill;
    constructor(pos, r, color = "black", fill = false) {
        super(color);
        this.pos = pos;
        this.r = r;
        this.fill = fill;
    }
    render(renderer, color = this.color) {
        renderer.ctx.beginPath();
        renderer.ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2);
        if (this.fill) {
            renderer.ctx.fillStyle = color;
            renderer.ctx.fill();
        }
        else {
            renderer.ctx.strokeStyle = color;
            renderer.ctx.stroke();
        }
        renderer.ctx.closePath();
    }
}
