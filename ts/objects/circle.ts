import Canvas from "../core/canvas.js";
import Vector from "../core/vector.js";
import Obj from "./object.js";

export default class Circle extends Obj {

  constructor(
    public pos: Vector,
    public r: number,
    color: string = "black",
    public fill: boolean = false
  ) {
    super(color);
  }

  render(renderer: Canvas, color: string = this.color, r: number = this.r): void {
    renderer.ctx.beginPath();
    renderer.ctx.arc(this.pos.x, this.pos.y, r, 0, Math.PI*2);
    if(this.fill) {
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