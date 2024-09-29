export default class Vector {

  constructor(
    public x: number = 0,
    public y: number = x
  ) {}

  add(vec: Vector) {
    return new Vector(this.x + vec.x, this.y + vec.y);
  }

  sub(vec: Vector) {
    return new Vector(this.x - vec.x, this.y - vec.y);
  }

  mult(n: Vector | number) {
    if(typeof n === "number")
      n = new Vector(n);
    return new Vector(this.x * n.x, this.y * n.y);
  }

  div(n: Vector | number) {
    if(typeof n === "number")
      n = new Vector(n);
    return new Vector(this.x / n.x, this.y / n.y);
  }

  dot(vec: Vector) {
    return this.x * vec.x + this.y * vec.y;
  }

  rot(angle: number) {
    angle += this.angle;
    return new Vector(Math.cos(angle), Math.sin(angle)).mult(this.length);
  }

  get norm() {
    return this.div(this.length);
  }

  get length() {
    return Math.sqrt(this.x**2 + this.y**2);
  }

  get angle() {
    return Math.atan2(this.y, this.x);
  }

}