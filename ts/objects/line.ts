import Canvas from "../core/canvas.js";
import Vector from "../core/vector.js";
import Obj from "./object.js";

export default class Line extends Obj {

  constructor(public a: Vector, public b: Vector, color: string = "black") {
    super(color);
  }

  render(renderer: Canvas, color: string = this.color): void {
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