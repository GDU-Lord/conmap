import Canvas from "./core/canvas.js";
import Vector from "./core/vector.js";
import { json } from "./data/data.js";
import Graph, { Border, BorderPoint, DEFAULT_POINT_RADIUS, GraphLine, label, Point } from "./graph/graph.js";
import Circle from "./objects/circle.js";
import Line from "./objects/line.js";

const S = 2;
const N = 10;
const animate = true;


const cvs = new Canvas(document.body, 500, 500);
cvs.cvs.style.border = "1px solid black";

const D = cvs.width / 2;

const g = new Graph();

const points: Point[] = json.map(p => new Point(+p[0], +p[1], String(p[2])));
const mapPoints: Point[] = [];

for(let i = 0; i < N; i ++) {
  const ox = cvs.width / 2;
  const oy = cvs.height / 2;
  const a = Math.PI*2 * i / N;
  const x = ox + Math.cos(a) * D;
  const y = oy + Math.sin(a) * D;
  mapPoints.push(new Point(x, y));
}
// const points: Point[] = [];

// for(let i = 0; i < 5; i ++) {
//   points.push(new Point(Math.random() * cvs.width, Math.random() * cvs.height, "green"));
// }

// for(let i = 0; i < 15; i ++) {
//   points.push(new Point(Math.random() * cvs.width, Math.random() * cvs.height, "red"));
// }

// for(let i = 0; i < 15; i ++) {
//   points.push(new Point(Math.random() * cvs.width, Math.random() * cvs.height, "blue"));
// }

let c = 0;

function run() {

  cvs.clear();

  g.addPoints(...points);
  g.addMapPoints(...mapPoints);

  g.build();

  const looseEnds = g.getLooseEnds();

  const lines: Line[] = [];

  const origin = new Vector(cvs.width / 2, cvs.height / 2);
  looseEnds.forEach(e => lines.push(new Line(e.pos, e.pos.add(e.pos.sub(origin).norm.mult(D)), "black")));

  // g.lines.filter(line => line.disabled).forEach(o => o.render(cvs, "yellow"));
  // g.inters.forEach(o => o.render(cvs, "orange", 1));
  // g.linesEnabled.forEach(o => o.render(cvs, "yellow"));
  // g.borders.filter(line => line.disabled).forEach(o => o.render(cvs, "blue"));
  // g.borders.filter(line => line.disabled).forEach(o => o.render(cvs));
  g.borders.filter(line => !line.disabled).forEach(o => o.render(cvs, o.labels![0]!));
  g.borders.filter(line => !line.disabled).forEach(o => o.render(cvs, o.labels![1]!));
  g.points.forEach(o => o.render(cvs, String(o.label ?? "black"), 5));
  lines.forEach(o => o.render(cvs));
  // g.borderPoints.forEach(o => o.render(cvs));

  // g.debugObjects.forEach((o) => (o as Point).render(cvs, "yellow", 5));
  // g.mapPoints.forEach((o) => o.render(cvs, "black", 5));
  
  g.reset();

  c ++;

  if(animate) {
    points.forEach(p => {
      p.pos.x += (Math.random() - 0.5) * S;
      p.pos.y += (Math.random() - 0.5) * S;
      if(p.pos.x > cvs.width)
        p.pos.x -= cvs.width;
      if(p.pos.x < 0)
        p.pos.x += cvs.width;
      if(p.pos.y > cvs.height)
        p.pos.y -= cvs.height;
      if(p.pos.y < 0)
        p.pos.y += cvs.height;
    });
    requestAnimationFrame(run);
  }

}

run();

window.addEventListener("contextmenu", e => {
  e.preventDefault();
});

cvs.cvs.addEventListener("mouseup", (e => {
  e.preventDefault();
  const x = e.offsetX;
  const y = e.offsetY;

  if(e.button === 2) {
    for(let i = 0; i < points.length; i ++)
      if(points[i].pos.sub(new Vector(x, y)).length <= 5*2)
        points.splice(i, 1);
  }
  else {
    if(e.shiftKey)
      points.push(new Point(x, y, "red"));
    else if(e.ctrlKey)
      points.push(new Point(x, y, "blue"));
    else
      points.push(new Point(x, y, "green"));
  }
  
  if(!animate)
    run();
  console.log(JSON.stringify(points.map(p => [p.pos.x, p.pos.y, p.label])));
}));

// optimize