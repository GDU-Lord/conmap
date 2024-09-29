const SEGMENT_BOUNDRY_TOLLERANCE = 0.1;
export var LINE;
(function (LINE) {
    LINE[LINE["RATIO"] = 0] = "RATIO";
    LINE[LINE["B"] = 1] = "B";
    LINE[LINE["X"] = 2] = "X";
    LINE[LINE["INF"] = 3] = "INF";
    LINE[LINE["SEG"] = 4] = "SEG";
})(LINE || (LINE = {}));
export var INTER;
(function (INTER) {
    INTER[INTER["X"] = 0] = "X";
    INTER[INTER["Y"] = 1] = "Y";
    INTER[INTER["RES"] = 2] = "RES";
})(INTER || (INTER = {}));
export function getLine(line) {
    const vector = line.b.sub(line.a);
    const ratio = vector.y / vector.x;
    const b = line.a.y - line.a.x * ratio;
    return [ratio, b, line.a.x, Math.abs(ratio) === Infinity, line];
}
export function intersect(a, b) {
    let res;
    let x, y;
    if (a[LINE.INF] && a[LINE.INF]) {
        res = false;
        x = Infinity;
        y = Infinity;
    }
    else if (a[LINE.INF]) {
        x = a[LINE.X];
        y = b[LINE.RATIO] * x + b[LINE.B];
        res = true;
    }
    else if (b[LINE.INF]) {
        x = b[LINE.X];
        y = a[LINE.RATIO] * x + a[LINE.B];
        res = true;
    }
    else {
        x = (b[LINE.B] - a[LINE.B]) / (a[LINE.RATIO] - b[LINE.RATIO]);
        y = a[LINE.RATIO] * x + a[LINE.B];
        res = Math.abs(x) !== Infinity;
    }
    if (res) {
        const l1ax = Math.min(a[LINE.SEG].a.x, a[LINE.SEG].b.x) + SEGMENT_BOUNDRY_TOLLERANCE;
        const l1bx = Math.max(a[LINE.SEG].a.x, a[LINE.SEG].b.x) - SEGMENT_BOUNDRY_TOLLERANCE;
        const l2ax = Math.min(b[LINE.SEG].a.x, b[LINE.SEG].b.x) + SEGMENT_BOUNDRY_TOLLERANCE;
        const l2bx = Math.max(b[LINE.SEG].a.x, b[LINE.SEG].b.x) - SEGMENT_BOUNDRY_TOLLERANCE;
        res = x > l1ax && x < l1bx && x > l2ax && x < l2bx;
    }
    return [x, y, res];
}
