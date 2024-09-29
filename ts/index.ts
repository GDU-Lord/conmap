import Canvas from "./core/canvas.js";
import Vector from "./core/vector.js";
import { json } from "./data/data.js";
import Graph, { DEFAULT_POINT_RADIUS, label, Point } from "./graph/graph.js";
import Circle from "./objects/circle.js";
import Line from "./objects/line.js";

const S = 5;

const cvs = new Canvas(document.body, 500, 500);
cvs.cvs.style.border = "1px solid black";

const g = new Graph();

const points: Point[] = json.map(p => new Point(+p[0], +p[1], String(p[2])));

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

  g.build();

  // g.lines.filter(line => line.disabled).forEach(o => o.render(cvs, "yellow"));
  // g.inters.forEach(o => o.render(cvs, "orange", 1));
  g.linesEnabled.forEach(o => o.render(cvs, "orange"));
  // g.borders.filter(line => line.disabled).forEach(o => o.render(cvs, "blue"));
  // g.borders.filter(line => line.disabled).forEach(o => o.render(cvs));
  g.borders.filter(line => !line.disabled).forEach(o => o.render(cvs, o.labels![0]!));
  g.borders.filter(line => !line.disabled).forEach(o => o.render(cvs, o.labels![1]!));
  g.points.forEach(o => o.render(cvs, String(o.label)));
  // g.borderPoints.forEach(o => o.render(cvs));

  // g.debugObjects.forEach(o => o.render(cvs, "yellow"));
  
  g.reset();

  // points.forEach(p => {
  //   p.pos.x += (Math.random() - 0.5) * S;
  //   p.pos.y += (Math.random() - 0.5) * S;
  //   if(p.pos.x > cvs.width)
  //     p.pos.x -= cvs.width;
  //   if(p.pos.x < 0)
  //     p.pos.x += cvs.width;
  //   if(p.pos.y > cvs.height)
  //     p.pos.y -= cvs.height;
  //   if(p.pos.y < 0)
  //     p.pos.y += cvs.height;
  // });
  // c ++;
  // requestAnimationFrame(run);

}

run();

window.addEventListener("contextmenu", e => {
  e.preventDefault();
});

cvs.cvs.addEventListener("mouseup", (e => {
  e.preventDefault();
  const x = e.offsetX;
  const y = e.offsetY;
  const label: label = ["red", "blue", "green"][e.button];
  for(let i = 0; i < points.length; i ++)
    if(points[i].pos.sub(new Vector(x, y)).length <= DEFAULT_POINT_RADIUS*2)
      points.splice(i, 1);
  points.push(new Point(x, y, label));
  run();
  console.log(JSON.stringify(points.map(p => [p.pos.x, p.pos.y, p.label])));
}));