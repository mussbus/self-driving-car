export function lerp(a: number, b: number, c: number) {
  return a + (b - a) * c;
}

export class Point {
  x: number; y: number;
  
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}