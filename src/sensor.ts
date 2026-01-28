import Car from "./car";
import { lerp, intersect, Hit, Point } from "./helpers";
export default class Sensor {
  car: Car;
  ray_count: number;
  ray_length: number;
  rays: Point[][];
  ray_spread: number;
  readings: (Hit | null)[];

  constructor(car: Car, ray_count: number = 25, ray_length: number = 1000) {
    this.car = car;
    this.ray_count = ray_count;
    this.ray_length = ray_length;
    this.ray_spread = Math.PI;
    this.rays = [];
    this.readings = [];
  }

  update(road_borders: Point[][]) {
    this.#castRays();
    this.#readings(road_borders);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.lineWidth = 1;
    for (let i = 0; i < this.ray_count; i++) {
      const ray = this.rays[i];
      if (!ray?.[0] || !ray?.[1]) continue;
      let end = new Hit(ray[1], 1);

      const reading = this.readings[i];
      if (reading) {
        end = reading;
      }

      ctx.strokeStyle = "lime";
      ctx.beginPath();
      ctx.moveTo(ray[0].x, ray[0].y);
      ctx.lineTo(end.point.x, end.point.y);
      ctx.stroke();
      
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(ray[1].x, ray[1].y);
      ctx.lineTo(end.point.x, end.point.y);
      ctx.stroke();
    }
    ctx.restore();
  }

  #castRays() {
    this.rays = [];
    const start = new Point(this.car.point.x, this.car.point.y);
    for (let i = 0; i < this.ray_count; i++) {
      const c = this.ray_count === 1 ? 0.5 : this.ray_count - 1;
      const ray_angle =
        lerp(this.ray_spread / 2, -this.ray_spread / 2, i / c) +
        this.car.direction;
      const end = new Point(
        this.car.point.x - Math.sin(ray_angle) * this.ray_length,
        this.car.point.y - Math.cos(ray_angle) * this.ray_length,
      );
      this.rays.push([start, end]);
    }
  }

  #scan(ray: Point[], road_borders: Point[][]): Hit | null {
    let closest_hit = null;
    if (!ray[0] || !ray[1]) return null;
    for (const border of road_borders) {
      if (!border[0] || !border[1]) return null;
      const hit = intersect(ray[0], ray[1], border[0], border[1]);
      if (hit) {
        if (!closest_hit || hit.t < closest_hit.t) closest_hit = hit;
      }
    }
    return closest_hit;
  }

  #readings(road_borders: Point[][]) {
    this.readings = [];
    for (const ray of this.rays) {
      this.readings.push(this.#scan(ray, road_borders));
    }
  }
}
