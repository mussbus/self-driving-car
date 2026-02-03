import { Car, CarControl } from "./car";
import { Point, resizeCanvas } from "./helpers";
import { NeuralNetwork } from "./network";
import Visualizer from "./visualizer";
import * as Constants from "./constants";
import Road from "./road";
import Sensor from "./sensor";
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const network_canvas = document.getElementById(
  "networkCanvas",
) as HTMLCanvasElement;
const network_ctx = network_canvas.getContext("2d")!;

const new_canvas = document.getElementById("newCanvas") as HTMLCanvasElement;
const new_ctx = new_canvas.getContext("2d")!;
const height = window.innerHeight;

resizeCanvas(canvas, 1000, height);
resizeCanvas(network_canvas, 300, height);
resizeCanvas(new_canvas, 300, height);
canvas.width = 1000;
network_canvas.width = 300;
new_canvas.width = 300;

const neural_network_string = localStorage.getItem("best-car");
let neural_network = null;
if (neural_network_string) neural_network = JSON.parse(neural_network_string);

const road = new Road(canvas.width / 2, canvas.width * 0.9, 16);
const driver = new Car(
  road.getLaneCenter(7),
  Constants.CAR_START,
  Constants.CAR_WIDTH,
  Constants.CAR_HEIGHT,
  new CarControl(0, neural_network),
);
console.log(neural_network);

// driver.neural_network = new NeuralNetwork([Constants.RAY_COUNT, 5, 4]);

// const new_network = new NeuralNetwork([driver.sensor.ray_count, 12, 4]);
// localStorage.setItem("best-car", JSON.stringify(new_network));
// driver.neural_network = new_network;

var test_cars: Car[] = [];
test_cars.push(driver);

for (let i = 0; i < Constants.TEST_CARS - 1; i++) {
  const new_car = new Car(
    road.getLaneCenter(7),
    Constants.CAR_START,
    Constants.CAR_WIDTH,
    Constants.CAR_HEIGHT,
    new CarControl(
      0,
      NeuralNetwork.mutate(structuredClone(driver.neural_network)),
    ),
  );
  test_cars.push(new_car);
}

let cars: Car[] = [];

let best_car_height: number = 0;
let max_car_height: number = 0;
let spawnTimer = 0;
let updateTimer = 0;
let lastTime = performance.now();

function loop(time: number) {
  best_car_height = Math.min(...test_cars.map((c) => c.point.y));
  max_car_height =
    best_car_height < max_car_height ? best_car_height : max_car_height;

  if (cars.length < Constants.MAX_CARS) {
    const dt = time - lastTime;
    lastTime = time;
    spawnTimer += dt;
    updateTimer += dt;

    if (spawnTimer >= Constants.SPAWN_INTERVAL) {
      spawnTimer = 0;

      cars.push(
        new Car(
          road.getLaneCenter(Math.floor(Math.random() * road.lane_count)),
          best_car_height - Constants.NEW_CAR_HEAD_START,
          Constants.CAR_WIDTH,
          Constants.CAR_HEIGHT,
          new CarControl(
            Math.floor(Math.random() * Constants.SPEED_RANGE) +
              Constants.MIN_SPEED,
            null,
          ),
        ),
      );
    }
  }

  canvas.height = window.innerHeight;

  // ctx.translate(0, -driver.point.y + canvas.height * 0.8);
  ctx.translate(0, -best_car_height + canvas.height * 0.8);

  road.draw(ctx);

  for (const car of cars) {
    const other_cars = cars.filter((c) => c !== car);
    const other_borders: Point[][] = other_cars.flatMap((c) => c.borders);
    car.update(road.borders, [...driver.borders, ...other_borders]);
    car.draw(ctx);
  }

  cars = cars.filter((c) => !c.damaged);

  const all_cars: Point[][] = cars.flatMap((car) => car.borders);

  for (const car of test_cars) {
    car.update(road.borders, all_cars);
    car.draw(ctx);
  }

  test_cars = test_cars.filter((c) => !c.damaged);

  if (updateTimer > Constants.UPDATE_BEST_CAR_INTERVAL) {
    updateTimer = 0;
    const best_car = test_cars.reduce((best, curr) => {
      return curr.point.y < best.point.y ? curr : best;
    });
    if (best_car.point.y - 5 < max_car_height)
      localStorage.setItem("best-car", JSON.stringify(best_car.neural_network));
  }
  if (driver.neural_network)
    Visualizer.draw_network(network_ctx, driver.neural_network);

  if (
    test_cars.length === 0 ||
    Math.abs(best_car_height - max_car_height) > 1000
  )
    window.location.reload();

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
