export default class Canvas {

  cvs: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(
    public parent: HTMLElement,
    public readonly width: number = 300,
    public readonly height: number = 300
  ) {
    this.cvs = document.createElement("canvas");
    this.cvs.width = this.width;
    this.cvs.height = this.height;
    this.ctx = this.cvs.getContext("2d")!;
    this.parent.append(this.cvs);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
  }

}