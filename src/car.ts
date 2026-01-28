import Controls from "./controls";
import Sensor from "./sensor";
import { Point } from "./helpers";

const turn_speed = 0.05;

export default class Car {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  controls: Controls;
  speed: number;
  max_speed: number;
  acceleration: number;
  friction: number;
  direction: number;
  sensor: Sensor;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = "red";
    this.sensor = new Sensor(this);
    this.controls = new Controls();
    this.speed = 0;
    this.max_speed = 10;
    this.acceleration = 0.2;
    this.friction = 0.03;
    this.direction = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.direction);
    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
    this.sensor.draw(ctx);
  }

  update(road_borders: Point[][]) {
    this.#move();
    this.sensor.update(road_borders);
  }

  #move() {
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

    this.x -= Math.sin(this.direction) * this.speed;
    this.y -= Math.cos(this.direction) * this.speed;
  }
}
