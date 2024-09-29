export default class Vector {
    x;
    y;
    constructor(x = 0, y = x) {
        this.x = x;
        this.y = y;
    }
    add(vec) {
        return new Vector(this.x + vec.x, this.y + vec.y);
    }
    sub(vec) {
        return new Vector(this.x - vec.x, this.y - vec.y);
    }
    mult(n) {
        if (typeof n === "number")
            n = new Vector(n);
        return new Vector(this.x * n.x, this.y * n.y);
    }
    div(n) {
        if (typeof n === "number")
            n = new Vector(n);
        return new Vector(this.x / n.x, this.y / n.y);
    }
    dot(vec) {
        return this.x * vec.x + this.y * vec.y;
    }
    rot(angle) {
        angle += this.angle;
        return new Vector(Math.cos(angle), Math.sin(angle)).mult(this.length);
    }
    get norm() {
        return this.div(this.length);
    }
    get length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    get angle() {
        return Math.atan2(this.y, this.x);
    }
}
