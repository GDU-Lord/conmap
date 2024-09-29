export default class Canvas {
    parent;
    width;
    height;
    cvs;
    ctx;
    constructor(parent, width = 300, height = 300) {
        this.parent = parent;
        this.width = width;
        this.height = height;
        this.cvs = document.createElement("canvas");
        this.cvs.width = this.width;
        this.cvs.height = this.height;
        this.ctx = this.cvs.getContext("2d");
        this.parent.append(this.cvs);
    }
}
