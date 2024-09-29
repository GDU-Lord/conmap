import Canvas from "./core/canvas.js";
import Vector from "./core/vector.js";
import Graph, { Point } from "./graph/graph.js";
import Circle from "./objects/circle.js";
import Line from "./objects/line.js";

const S = 5;

const cvs = new Canvas(document.body, 500, 500);
cvs.cvs.style.border = "1px solid black";

const g = new Graph();

const points: Point[] = [];

for(let i = 0; i < 50; i ++) {
  points.push(new Point(Math.random() * cvs.width, Math.random() * cvs.height));
}

function run() {

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

  cvs.clear();

  g.addPoints(...points);

  g.build();

  g.lines.filter(line => line.disabled).forEach(o => o.render(cvs, "yellow"));
  g.lines.filter(line => !line.disabled).forEach(o => o.render(cvs, "blue"));
  g.points.forEach(o => o.render(cvs));
  // g.inters.forEach(o => o.render(cvs, "red"));
  
  g.reset();

  requestAnimationFrame(run);

}

run();

