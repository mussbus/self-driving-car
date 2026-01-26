import { lerp } from "./helpers";

export default class Road {
  x: number;
  width: number;
  lane_count: number;
  left: number;
  right: number;
  top: number;
  bottom: number;

  constructor(x: number, width: number, lane_count: number = 3) {
    this.x = x;
    this.width = width;
    this.lane_count = lane_count;
    this.left = x - width / 2;
    this.right = x + width / 2;
    const infinity = 1000000000;
    this.top = -infinity;
    this.bottom = infinity;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 8;
    ctx.strokeStyle = "white";

    for (let i = 0; i <= this.lane_count; i++) {
      ctx.save(); // save per line

      const x = lerp(this.left, this.right, i / this.lane_count);

      if (i === 0 || i === this.lane_count) {
        ctx.setLineDash([]);
      } else {
        ctx.setLineDash([20, 20]);
      }

      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();

      ctx.restore(); // restore per line
    }
  }
}
