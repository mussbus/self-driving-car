import { Car, CarControl } from "./car";
import { Point } from "./helpers";
import * as Constants from "./constants";
import Road from "./road";
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

const road = new Road(canvas.width / 2, canvas.width * 0.9, 16);
const driver = new Car(road.getLaneCenter(7), Constants.CAR_START, Constants.CAR_WIDTH, Constants.CAR_HEIGHT, null);
const cars: Car[] = [];

let spawnTimer = 0;
const SPAWN_INTERVAL = 1_000; // ms
let lastTime = performance.now();

function loop(time: number) {
  if (cars.length < Constants.MAX_CARS) {
    const dt = time - lastTime;
    lastTime = time;

    spawnTimer += dt;

    if (spawnTimer >= SPAWN_INTERVAL) {
      spawnTimer = 0;

      cars.push(
        new Car(
          road.getLaneCenter(Math.floor(Math.random() * road.lane_count)),
          driver.point.y - Constants.NEW_CAR_HEAD_START,
          Constants.CAR_WIDTH,
          Constants.CAR_HEIGHT,
          new CarControl(
            Math.floor(Math.random() * Constants.SPEED_RANGE) +
              Constants.MIN_SPEED,
          ),
        ),
      );
    }
  }

  canvas.height = window.innerHeight;

  ctx.translate(0, -driver.point.y + canvas.height * 0.8);

  road.draw(ctx);

  for (const car of cars) {
    const other_cars = cars.filter((c) => c !== car);
    const other_borders: Point[][] = other_cars.flatMap((c) => c.borders);
    car.update(road.borders, [...driver.borders, ...other_borders]);
    car.draw(ctx);
  }
  const all_cars: Point[][] = cars.flatMap((car) => car.borders);
  driver.update(road.borders, all_cars);
  driver.draw(ctx);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
