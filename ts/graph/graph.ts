import Vector from "../core/vector.js";
import Circle from "../objects/circle.js";
import Line from "../objects/line.js";
import { getLine, INTER, intersect } from "./intersect.js";

const DEFAULT_POINT_RADIUS = 3;

export class GraphLine extends Line {

  public disabled: boolean = false;

  constructor(a: Vector, b: Vector) {
    super(a, b);
  }

}

export class Point extends Circle {

  constructor(x: number, y: number) {
    super(new Vector(x, y), DEFAULT_POINT_RADIUS, "black", true);
  }

}

export class Inter extends Point {

  lines: GraphLine[] = [];

  constructor(x: number, y: number, ...lines: GraphLine[]) {
    super(x, y);
    this.lines = lines;
  }
  
}

export default class Graph {

  public points: Point[] = [];
  public lines: GraphLine[] = [];
  public inters: Inter[] = [];

  constructor() {

  }

  addPoints(...points: Point[]) {
    this.points.push(...points);
  }

  addLines(...lines: GraphLine[]) {
    this.lines.push(...lines);
  }

  addInters(...points: Inter[]) {
    this.inters.push(...points);
  }

  build() {
    this.createLines();
    this.getIntersections();
    this.filterShortestLines();
  }

  reset() {
    this.points = [];
    this.lines = [];
    this.inters = [];
  }

  createLines() {
    for(let i = 0; i < this.points.length; i ++) {
      for(let j = i+1; j < this.points.length; j ++) {
        const line = new GraphLine(this.points[i].pos, this.points[j].pos);
        this.addLines(line);
      }
    }
  }

  getIntersections() {
    for(let i = 0; i < this.lines.length; i ++) {
      for(let j = i+1; j < this.lines.length; j ++) {
        const line1 = getLine(this.lines[i]);
        const line2 = getLine(this.lines[j]);
        const inter = intersect(line1, line2);
        if(inter[INTER.RES])
          this.addInters(new Inter(inter[INTER.X], inter[INTER.Y], this.lines[i], this.lines[j]));
      }
    }
  }

  filterShortestLines() {
    this.inters.forEach(inter => {
      const lines = inter.lines.filter(line => !line.disabled);
      if(lines.length <= 1) return;
      const length = Math.min(...lines.map(line => line.length));
      let shortest: GraphLine | null = null;
      lines.forEach(line => {
        if(line.length !== length)
          line.disabled = true;
        else {
          if(shortest == null)
            shortest = line;
          else
            line.disabled = true;
        }
      });
    });
  }

}