import Controls from "./controls";
import Sensor from "./sensor";
import { intersect, Point, Hit } from "./helpers";
import * as Constants from "./constants";

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
	damaged: boolean;

	constructor(x: number, y: number, width: number, height: number, car_control: CarControl | null) {
		this.point = new Point(x, y);
		this.width = width;
		this.height = height;
		this.color = car_control ? "white" : "purple";
		this.sensor = new Sensor(this);
		this.controls = car_control ? null : new Controls();
		this.speed = car_control ? car_control.speed : 0;
		this.max_speed = Constants.MAX_SPEED;
		this.acceleration = 0.2;
		this.friction = Constants.FRICTION;
		this.direction = 0;
		this.borders = [];
		this.damaged = false;
		this.#update_borders();
	}

	draw(ctx: CanvasRenderingContext2D) {
		if (
			!this?.borders?.[0]?.[0] ||
			!this?.borders?.[0]?.[1] ||
			!this?.borders?.[2]?.[0] ||
			!this?.borders?.[2]?.[1]
		)
			return;

		ctx.fillStyle = this.damaged ? "grey" : this.color;
		ctx.beginPath();
		ctx.moveTo(this.borders[0][0].x, this.borders[0][0].y);
		ctx.lineTo(this.borders[0][1].x, this.borders[0][1].y);
		ctx.lineTo(this.borders[2][0].x, this.borders[2][0].y);
		ctx.lineTo(this.borders[2][1].x, this.borders[2][1].y);
		ctx.fill();
		if (!this.controls) return;
		this.sensor.draw(ctx);
	}

	update(road_borders: Point[][], car_borders: Point[][]) {
		this.#move();
		this.#update_borders();
		this.damaged = this.damaged ? true : this.#assess_damage([...road_borders, ...car_borders]);
		if (this.damaged) {
			this.speed = 0;
			this.controls = null;
		}
		if (!this.controls) return;
		this.sensor.update([...road_borders, ...car_borders]);
	}

	#assess_damage(borders: Point[][]): boolean {
		for (const car_border of this.borders) {
			if (!car_border[0] || !car_border[1]) return true;
			for (const border of borders) {
				if (!border[0] || !border[1]) return true;
				if (intersect(car_border[0], car_border[1], border[0], border[1])) {
					return true;
				}
			}
		}
		return false;
	}

	#move() {
		if (!this.controls) {
			// this.point.x -= Math.sin(this.direction) * this.speed;
			this.point.y -= this.speed;
		} else {
			if (this.controls.forward) this.speed += this.acceleration;
			if (this.controls.reverse) this.speed -= this.acceleration;
			var change: number = 0;
			if (this.controls.left) change = Constants.TURN_SPEED;
			if (this.controls.right) change = -Constants.TURN_SPEED;
			if (this.speed < 0) change *= -1;
			this.direction += change;
			if (Math.abs(this.direction) < Constants.TURN_SPEED) this.direction = 0;

			if (this.speed > this.max_speed) this.speed = this.max_speed;
			if (this.speed < -this.max_speed / 2) this.speed = -this.max_speed / 2;
			if (this.speed > 0) this.speed -= this.friction;
			if (this.speed < 0) this.speed += this.friction;
			if (Math.abs(this.speed) < 0.025) this.speed = 0;

			this.point.x -= Math.sin(this.direction) * this.speed;
			this.point.y -= Math.cos(this.direction) * this.speed;
		}
	}

	#update_borders() {
		const rad = Math.hypot(this.width, this.height) * 0.5;
		const alpha = Math.atan2(this.width, this.height);

		const minus_angle = this.direction - alpha;
		const plus_angle = this.direction + alpha;

		const top_left = new Point(
			this.point.x - Math.sin(minus_angle) * rad,
			this.point.y - Math.cos(minus_angle) * rad,
		);
		const top_right = new Point(
			this.point.x - Math.sin(plus_angle) * rad,
			this.point.y - Math.cos(plus_angle) * rad,
		);
		const bottom_right = new Point(
			this.point.x - Math.sin(Math.PI + minus_angle) * rad,
			this.point.y - Math.cos(Math.PI + minus_angle) * rad,
		);
		const bottom_left = new Point(
			this.point.x - Math.sin(Math.PI + plus_angle) * rad,
			this.point.y - Math.cos(Math.PI + plus_angle) * rad,
		);

		this.borders = [
			[top_left, top_right],
			[top_right, bottom_right],
			[bottom_right, bottom_left],
			[bottom_left, top_left],
		];
	}
}
