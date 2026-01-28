import { lerp, Point } from "./helpers";

export default class Road {
  x: number;
  width: number;
  lane_count: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  borders: Point[][];

  constructor(x: number, width: number, lane_count: number = 3) {
    this.x = x;
    this.width = width;
    this.lane_count = lane_count;
    this.left = x - width / 2;
    this.right = x + width / 2;
    const infinity = 10000000;
    this.top = -infinity;
    this.bottom = infinity;

    const top_left = new Point(this.left, this.top);
    const top_right = new Point(this.right, this.top);
    const bottom_left = new Point(this.left, this.bottom);
    const bottom_right = new Point(this.right, this.bottom);
    this.borders = [
      [top_left, bottom_left],
      [top_right, bottom_right],
    ];
  }

  getLaneCenter(index: number) {
    index = Math.min(Math.max(index, 0), this.lane_count - 1);
    const lane_width = this.width / this.lane_count;
    return this.left + lane_width / 2 + lane_width * index;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.lineWidth = 8;
    ctx.strokeStyle = "white";

    ctx.setLineDash([20, 40]);
    for (let i = 1; i <= this.lane_count - 1; i++) {
      const x = lerp(this.left, this.right, i / this.lane_count);

      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }

    ctx.setLineDash([]);
    for (const border of this.borders) {
      if (!border[0] || !border[1]) continue;
      ctx.beginPath();

      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    }
    ctx.restore();
  }
}
