import Vector from "../core/vector.js";
import { GraphLine } from "./graph.js";

const SEGMENT_BOUNDRY_TOLLERANCE = 0.1;

export type line = [number, number, number, boolean, GraphLine];

export enum LINE {
  RATIO = 0,
  B = 1,
  X = 2,
  INF = 3,
  SEG = 4
}

export type inter = [number, number, boolean];

export enum INTER {
  X = 0,
  Y = 1,
  RES = 2
}

export function getLine(line: GraphLine): line {
  const vector = line.b.sub(line.a);
  const ratio = vector.y / vector.x;
  const b = line.a.y - line.a.x * ratio;
  return [ratio, b, line.a.x, Math.abs(ratio) === Infinity, line];
}

export function intersect(a: line, b: line): inter {

  let res: boolean;
  let x: number, y: number;
  if(a[LINE.INF] && a[LINE.INF]) {
    res = false;
    x = Infinity;
    y = Infinity;
  }
  else if(a[LINE.INF]) {
    x = a[LINE.X];
    y = b[LINE.RATIO] * x + b[LINE.B];
    res = true;
  }
  else if(b[LINE.INF]) {
    x = b[LINE.X];
    y = a[LINE.RATIO] * x + a[LINE.B];
    res = true;
  }
  else {
    x = (b[LINE.B]-a[LINE.B])/(a[LINE.RATIO]-b[LINE.RATIO]);
    y = a[LINE.RATIO] * x + a[LINE.B];
    res = Math.abs(x) !== Infinity;
  }

  if(res) {
    const l1ax = Math.min(a[LINE.SEG].a.x, a[LINE.SEG].b.x) + SEGMENT_BOUNDRY_TOLLERANCE;
    const l1bx = Math.max(a[LINE.SEG].a.x, a[LINE.SEG].b.x) - SEGMENT_BOUNDRY_TOLLERANCE;
    const l2ax = Math.min(b[LINE.SEG].a.x, b[LINE.SEG].b.x) + SEGMENT_BOUNDRY_TOLLERANCE;
    const l2bx = Math.max(b[LINE.SEG].a.x, b[LINE.SEG].b.x) - SEGMENT_BOUNDRY_TOLLERANCE;
    const l1ay = Math.min(a[LINE.SEG].a.y, a[LINE.SEG].b.y) + SEGMENT_BOUNDRY_TOLLERANCE;
    const l1by = Math.max(a[LINE.SEG].a.y, a[LINE.SEG].b.y) - SEGMENT_BOUNDRY_TOLLERANCE;
    const l2ay = Math.min(b[LINE.SEG].a.y, b[LINE.SEG].b.y) + SEGMENT_BOUNDRY_TOLLERANCE;
    const l2by = Math.max(b[LINE.SEG].a.y, b[LINE.SEG].b.y) - SEGMENT_BOUNDRY_TOLLERANCE;
    res = (x > l1ax && x < l1bx && x > l2ax && x < l2bx) || (y > l1ay && y < l1by && y > l2ay && y < l2by);
  }

  return [x, y, res];

}