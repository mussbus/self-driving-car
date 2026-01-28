import Controls from "./controls";
import Sensor from "./sensor";
import { Point } from "./helpers";
import * as Constants from "./constants";

const turn_speed = 0.05;

export class CarControl {
  speed: number;

  constructor(speed: number) {
    this.speed = speed;
  }
}

export class Car {
  point: Point;
  width: number;
  height: number;
  color: string;
  controls: Controls | null;
  speed: number;
  max_speed: number;
  acceleration: number;
  friction: number;
  direction: number;
  sensor: Sensor;
  borders: Point[][];

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    car_control: CarControl | null,
  ) {
    this.point = new Point(x, y);
    this.width = width;
    this.height = height;
    this.color = "red";
    this.sensor = new Sensor(this);
    this.controls = car_control ? null : new Controls();
    this.speed = car_control ? car_control.speed : 0;
    this.max_speed = Constants.MAX_SPEED;
    this.acceleration = 0.2;
    this.friction = 0.03;
    this.direction = 0;

    const half_width = width / 2;
    const half_height = height / 2;
    const left = this.point.x - half_width;
    const right = this.point.x + half_width;
    const top = this.point.y - half_height;
    const bottom = this.point.y + half_height;

    const top_left = new Point(left, top);
    const top_right = new Point(right, top);
    const bottom_left = new Point(left, bottom);
    const bottom_right = new Point(right, bottom);
    this.borders = [
      [top_left, top_right],
      [top_right, bottom_right],
      [bottom_right, bottom_left],
      [bottom_left, top_left],
    ];
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.point.x, this.point.y);
    ctx.rotate(-this.direction);
    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
    if (!this.controls) return;
    this.sensor.draw(ctx);
  }

  update(road_borders: Point[][], car_borders: Point[][]) {
    this.#move();
    this.update_borders();
    if (!this.controls) return;
    this.sensor.update([...road_borders, ...car_borders]);
  }

  #move() {
    if (!this.controls) {
      // this.point.x -= Math.sin(this.direction) * this.speed;
      this.point.y -= this.speed;
    } else {
      if (this.controls.forward) this.speed += this.acceleration;
      if (this.controls.reverse) this.speed -= this.acceleration;
      var change: number = 0;
      if (this.controls.left) change = turn_speed;
      if (this.controls.right) change = -turn_speed;
      if (this.speed < 0) change *= -1;
      this.direction += change;
      if (Math.abs(this.direction) < turn_speed) this.direction = 0;

      if (this.speed > this.max_speed) this.speed = this.max_speed;
      if (this.speed < -this.max_speed / 2) this.speed = -this.max_speed / 2;
      if (this.speed > 0) this.speed -= this.friction;
      if (this.speed < 0) this.speed += this.friction;
      if (Math.abs(this.speed) < 0.025) this.speed = 0;

      this.point.x -= Math.sin(this.direction) * this.speed;
      this.point.y -= Math.cos(this.direction) * this.speed;
    }
  }
  
  update_borders() {
    const half_width = this.width / 2;
    const half_height = this.height / 2;
    const left = this.point.x - half_width;
    const right = this.point.x + half_width;
    const top = this.point.y - half_height;
    const bottom = this.point.y + half_height;

    const top_left = new Point(left, top);
    const top_right = new Point(right, top);
    const bottom_left = new Point(left, bottom);
    const bottom_right = new Point(right, bottom);
    this.borders = [
      [top_left, top_right],
      [top_right, bottom_right],
      [bottom_right, bottom_left],
      [bottom_left, top_left],
    ];
  }
}
