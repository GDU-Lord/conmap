import Vector from "../core/vector.js";
import Circle from "../objects/circle.js";
import Line from "../objects/line.js";
import Obj from "../objects/object.js";
import { getLine, INTER, intersect, LINE, pointIntersect } from "./intersect.js";
import { getLable, getNumber, LABELS } from "./label.js";

export const DEFAULT_POINT_RADIUS = 2;
export const MAX_ANGLE_SHARP = 0;

export type label = string | null;
export type labelPair = [label, label] | null;

export class GraphLine extends Line {

  public disabled: boolean = false;

  constructor(a: Vector, b: Vector, public labels: labelPair = null) {
    super(a, b);
  }

}

export class Point extends Circle {

  lines: GraphLine[] = [];

  constructor(x: number, y: number, public label: label = null) {
    super(new Vector(x, y), DEFAULT_POINT_RADIUS, "black", true);
  }

}

export class BorderPoint extends Circle {

  borders: Border[] = [];
  excluded: boolean = false;
  labels: labelPair = null;

  constructor(x: number, y: number, public line: GraphLine) {
    super(new Vector(x, y), DEFAULT_POINT_RADIUS, "black", true);
    this.labels = this.line.labels;
  }

}

export class Border extends GraphLine {

  gradient: gradient = [];

  constructor(public p1: BorderPoint, public p2: BorderPoint) {
    super(p1.pos, p2.pos, p1.labels);
  }

}

export class Inter extends Point {

  lines: GraphLine[] = [];

  constructor(x: number, y: number, ...lines: GraphLine[]) {
    super(x, y);
    this.lines = lines;
  }
  
}

export type gradient = (label | labelPair)[];

export class Triangle {

  constructor(public borders: Border[]) {
    let labels: label[] = [];
    let appear: boolean[] = [];
    let flattenedAll: label[][] = [];
    this.borders.forEach(b => {
      const flattened: label[] = [];
      flattenedAll.push(flattened);
      b.gradient.forEach(g => {
        if(g instanceof Array)
          flattened.push(...g);
        else
          flattened.push(g);
      });
      for(const g of flattened) {
        if(!labels.includes(g)) {
          labels.push(g);
          appear.push(true);
        }
      }
    });
    flattenedAll.forEach(f => {
      for(let i = 0; i < labels.length; i ++) {
        if(!f.includes(labels[i]))
          appear[i] = false;
      }
    });
    labels = labels.filter((l, i) => appear[i]);
    const strongerLable = getLable(Math.max(...labels.map(l => getNumber(l as LABELS))));
    console.log(this, strongerLable, this.borders[0].gradient, this.borders[1].gradient, this.borders[2].gradient);
    this.borders.forEach(b => {
      if(
        ((typeof b.gradient[0] === "string" && b.gradient[0] !== strongerLable) || 
        (typeof b.gradient[1] === "string" && b.gradient[1] !== strongerLable))
      ) return;
      b.disabled = true;
    });
  }

}

export default class Graph {

  public points: Point[] = [];
  public lines: GraphLine[] = [];
  public linesEnabled: GraphLine[] = [];
  public linesLabeled: GraphLine[] = [];
  public inters: Inter[] = [];
  public borderPoints: BorderPoint[] = [];
  public borders: Border[] = [];
  public debugObjects: Obj[] = [];

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

  addBorders(...lines: Border[]) {
    this.borders.push(...lines);
  }

  build() {
    this.createLines();
    this.getIntersections();
    this.filterShortestLines();
    this.filterSharpAngles();
    this.createBorderPoints();
    this.createBorders();
    this.removeExcessiveBorders();
  }

  reset() {
    this.points.forEach(p => p.lines = []);
    this.points = [];
    this.lines = [];
    this.linesEnabled = [];
    this.linesLabeled = [];
    this.inters = [];
    this.borderPoints = [];
    this.borders = [];
    this.debugObjects = [];
  }

  createLines() {
    for(let i = 0; i < this.points.length; i ++) {
      const p1 = this.points[i];
      for(let j = i+1; j < this.points.length; j ++) {
        const p2 = this.points[j];
        let labels: labelPair = null;
        if(p1.label !== p2.label && p1.label != null && p2.label != null)
          labels = [p1.label, p2.label];
        const line = new GraphLine(p1.pos, p2.pos, labels);
        p1.lines.push(line);
        p2.lines.push(line);
        this.addLines(line);
      }
    }
  }

  getIntersections() {
    this.lines = this.lines.sort((a, b) => a.length - b.length);
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
      if(inter.lines[0].disabled || inter.lines[1].disabled) return;
      if(inter.lines[0].length >= inter.lines[1].length) {
        inter.lines[0].disabled = true;
        console.log(inter.lines[0].length, inter.lines[1].length);
      }
      else {
        inter.lines[1].disabled = true;
        console.log(inter.lines[1].length, inter.lines[0].length);
      }
    });
  }

  filterSharpAngles() {
    this.points.forEach(p => {
      const lines = p.lines.filter(line => !line.disabled);
      for(let i = 0; i < lines.length; i ++) {
        const l1 = lines[i];
        for(let j = i+1; j < lines.length; j ++) {
          const l2 = lines[j];
          const p1 = l1.a.equal(p.pos) ? l1.b : l1.a;
          const p2 = l2.a.equal(p.pos) ? l2.b : l2.a;
          const d1 = p.pos.sub(p1);
          const d2 = p.pos.sub(p2);
          let a = d1.angle - d2.angle;
          if(Math.abs(a) <= MAX_ANGLE_SHARP || Math.abs(a) >= Math.PI*2 - MAX_ANGLE_SHARP) {
            if(d1.length > d2.length)
              l1.disabled = true;
            else
              l2.disabled = true;
          }
        }
      }
    });
    this.linesEnabled = this.lines.filter(line => !line.disabled);
    this.linesLabeled = this.linesEnabled.filter(line => line.labels != null);
  }

  createBorderPoints() {
    this.linesLabeled.forEach(line => {
      const p = line.a.add(line.b.sub(line.a).div(2));
      this.addBorderPoints(new BorderPoint(p.x, p.y, line));
    });
  }

  createBorders() {
    for(let i = 0; i < this.borderPoints.length; i ++) {
      const p1 = this.borderPoints[i];
      second: for(let j = i+1; j < this.borderPoints.length; j ++) {
        const p2 = this.borderPoints[j];
        // // if(
        // //   (p1.labels![0] !== p2.labels![0] && p1.labels![1] !== p2.labels![1]) &&
        // //   (p1.labels![1] !== p2.labels![0] && p1.labels![0] !== p2.labels![1])
        // // ) 
        // //   continue second;
        // if(
        //   !(
        //     (p1.labels![0] === p2.labels![0] && p1.labels![1] === p2.labels![1]) ||
        //     (p1.labels![1] === p2.labels![0] && p1.labels![0] === p2.labels![1])
        //   )
        // ) continue second;
        // console.log(p1.labels, p2.labels);
        const border = new Border(p1, p2);
        p1.borders.push(border);
        p2.borders.push(border);
        this.addBorders(border);
      }
    }
    console.log(this.borders.length);
  }

  removeExcessiveBorders() {
    this.borders.filter(b => !b.disabled).forEach((border, i) => {
      const l1 = getLine(border);
      this.linesEnabled.forEach((line, j) => {
        const l2 = getLine(line);
        const inter = intersect(l1, l2);
        if(inter[INTER.RES]) {
          border.disabled = true;
        }
      });
      
    });
    this.borders.filter(border => !border.disabled).forEach(border => {
      const l = getLine(border);
      this.points.forEach(p => {
        if(pointIntersect(p.pos, l))
          border.disabled = true;
      });
    });
    this.removeIntersectingBorders();
    const triangles = this.getBorderTriangles();
    this.tackleBorderTriangles(triangles);
  }

  removeIntersectingBorders() {
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

  getBorderTriangles() {
    let triangles: [BorderPoint, BorderPoint, BorderPoint][] = [];
    const points = this.borderPoints.filter(p => p.borders.filter(b => !b.disabled).length > 2);
    points.forEach(p => {
      if(p.excluded) return;
      const borders = p.borders.filter(b => !b.disabled);
      const neighbors = borders.map(border => border.p1.pos.equal(p.pos) ? border.p2 : border.p1);
      neighbors.forEach(n => {
        const nextBorders = n.borders.filter(border => !border.disabled);
        const nextNeighbors = nextBorders.map(border => border.p1.pos.equal(n.pos) ? border.p2 : border.p1);
        nextNeighbors.forEach(nn => {
          if(nn.pos.equal(p.pos)) return;
          if(nn.borders.filter(b => !b.disabled).length <= 2) return;
          if(neighbors.includes(nn)) {
            triangles.push([p, n, nn]);
            p.excluded = true;
            n.excluded = true;
            nn.excluded = true;
          }
        });
      });
    });
    triangles = triangles.filter((t, i) => {
      for(const t2 of triangles.slice(i+1)) {
        if(t.includes(t2[0]) && t.includes(t2[1]) && t.includes(t2[2]))
          return false;
      }
      return true;
    });
    return triangles;
  }

  tackleBorderTriangles(triangles: [BorderPoint, BorderPoint, BorderPoint][]) {
    const objectTriangles: Triangle[] = [];
    const borderTriangles = triangles.map(t => {
      let tBorders: Border[] = [];
      t.forEach(n => {
        const borders = n.borders.filter(b => !b.disabled);
        borders.forEach(b => {
          if(t.includes(b.p1) && t.includes(b.p2))
            tBorders.push(b);
        });
      })
      tBorders = tBorders.filter((b, i) => {
        for(const b2 of tBorders.slice(i+1)) {
          if(b.p1.pos.equal(b2.p1.pos) && b.p2.pos.equal(b2.p2.pos))
            return false;
        }
        return true;
      });
      return tBorders as [Border, Border, Border];
    });
    borderTriangles.forEach((t, i) => {
      t.forEach((border, j) => {
        // if(i === 2 && j === 0) {
        //   // console.log("debug", t[j]);
        //   this.debugObjects.push(new Point(border.a.x, border.a.y));
        //   this.debugObjects.push(new Point(border.b.x, border.b.y));
        // }
        const v1 = border.p1.line.b.sub(border.p1.line.a).rot(Math.PI/2);
        const v2 = border.p2.line.b.sub(border.p2.line.a).rot(Math.PI/2);
        const v3 = border.b.sub(border.a);
        const d1 = v3.dot(v1);
        const d2 = v3.dot(v2);
        const labels1 = d1 > 0 ? border.p1.labels! : [border.p1.labels![1], border.p1.labels![0]];
        const labels2 = d2 > 0 ? border.p2.labels! : [border.p2.labels![1], border.p2.labels![0]];
        if(labels1[0] === labels2[0] && labels1[1] === labels2[1]) {
          border.gradient = [labels1[0], labels1[1]];
        }
        else if(labels1[0] === labels2[0]) {
          border.gradient = [labels1[0], [labels1[1], labels2[1]]];
        }
        else if(labels1[1] === labels2[1]) {
          border.gradient = [[labels1[0], labels2[0]], labels1[1]];
        }
        else {
          border.gradient = [[labels1[0], labels2[0]], [labels1[1], labels2[1]]];
        }
      });
      objectTriangles.push(new Triangle(t));
    });
    // triangles.forEach(t => t.forEach(p => p.borders.forEach(b => b.disabled = true)));
  }

}