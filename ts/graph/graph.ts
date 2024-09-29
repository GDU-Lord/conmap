import Vector from "../core/vector.js";
import Circle from "../objects/circle.js";
import Line from "../objects/line.js";
import { getLine, INTER, intersect } from "./intersect.js";

export const DEFAULT_POINT_RADIUS = 7;

export type label = string | null;
export type labelPair = [label, label] | null;

export class GraphLine extends Line {

  public disabled: boolean = false;

  constructor(a: Vector, b: Vector, public labels: labelPair = null) {
    super(a, b);
  }

}

export class Point extends Circle {

  constructor(x: number, y: number, public label: label = null) {
    super(new Vector(x, y), DEFAULT_POINT_RADIUS, "black", true);
  }

}

export class BorderPoint extends Circle {

  borders: GraphLine[] = [];

  constructor(x: number, y: number, public labels: labelPair= null) {
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
  public linesEnabled: GraphLine[] = [];
  public linesLabeled: GraphLine[] = [];
  public inters: Inter[] = [];
  public borderPoints: BorderPoint[] = [];
  public borders: GraphLine[] = [];

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

  addBorderPoints(...points: BorderPoint[]) {
    this.borderPoints.push(...points);
  }

  addBorders(...lines: GraphLine[]) {
    this.borders.push(...lines);
  }

  build() {
    this.createLines();
    this.getIntersections();
    this.filterShortestLines();
    this.createBorderPoints();
    this.createBorders();
    this.removeExcessiveBorders();
  }

  reset() {
    this.points = [];
    this.lines = [];
    this.linesEnabled = [];
    this.linesLabeled = [];
    this.inters = [];
    this.borderPoints = [];
    this.borders = [];
  }

  createLines() {
    for(let i = 0; i < this.points.length; i ++) {
      const p1 = this.points[i];
      for(let j = i+1; j < this.points.length; j ++) {
        const p2 = this.points[j];
        let label: labelPair = null;
        if(p1.label !== p2.label && p1.label != null && p2.label != null)
          label = [p1.label, p2.label];
        const line = new GraphLine(this.points[i].pos, this.points[j].pos, label);
        this.addLines(line);
      }
    }
  }

  getIntersections() {
    for(let i = 0; i < this.lines.length; i ++) {
      const line1 = getLine(this.lines[i]);
      for(let j = i+1; j < this.lines.length; j ++) {
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
    this.linesEnabled = this.lines.filter(line => !line.disabled);
    this.linesLabeled = this.linesEnabled.filter(line => line.labels != null);
  }

  createBorderPoints() {
    this.linesLabeled.forEach(line => {
      const p = line.a.add(line.b.sub(line.a).div(2));
      this.addBorderPoints(new BorderPoint(p.x, p.y, line.labels));
    });
  }

  createBorders() {
    for(let i = 0; i < this.borderPoints.length; i ++) {
      const p1 = this.borderPoints[i];
      second: for(let j = i+1; j < this.borderPoints.length; j ++) {
        const p2 = this.borderPoints[j];
        if(
          (p1.labels![0] !== p2.labels![0] && p1.labels![1] !== p2.labels![1]) &&
          (p1.labels![1] !== p2.labels![0] && p1.labels![0] !== p2.labels![1])
        ) 
          continue second;
        const border = new GraphLine(p1.pos, p2.pos, p1.labels);
        p1.borders.push(border);
        p2.borders.push(border);
        this.addBorders(border);
      }
    }
  }

  removeExcessiveBorders() {
    this.borders.forEach(border => {
      const l1 = getLine(border);
      this.linesEnabled.forEach(line => {
        const l2 = getLine(line);
        const inter = intersect(l1, l2);
        if(inter[INTER.RES])
          border.disabled = true;
      });
    });
    // this.borderPoints.forEach(point => {
    //   const borders = point.borders.filter(border => !border.disabled);
    //   if(borders.length <= 2) return;
    //   borders.sort((a, b) => a.length - b.length);
    //   for(let i = borders.length-1; i > 2; i--) {
    //     borders[i].disabled = true;
    //   }
    // });
    const borders = this.borders.filter(border => !border.disabled);
    const inters: Inter[] = [];
    for(let i = 0; i < borders.length; i ++) {
      const line1 = getLine(borders[i]);
      for(let j = i+1; j < borders.length; j ++) {
        const line2 = getLine(borders[j]);
        const inter = intersect(line1, line2);
        if(inter[INTER.RES])
          inters.push(new Inter(inter[INTER.X], inter[INTER.Y], borders[i], borders[j]));
      }
    }
    inters.forEach(inter => {
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