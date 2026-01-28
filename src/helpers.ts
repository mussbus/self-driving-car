export function lerp(a: number, b: number, c: number) {
  return a + (b - a) * c;
}

export function intersect(A: Point, B: Point, C: Point, D: Point) {
  const t_top = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const u_top = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = t_top / bottom;
    const u = u_top / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return new Hit(new Point(lerp(A.x, B.x, t), lerp(A.y, B.y, t)), t);
    }

    return null;
  }
}

export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class Hit {
  point: Point;
  t: number;

  constructor(point: Point, t: number) {
    this.point = point;
    this.t = t;
  }
}
