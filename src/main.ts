import Car from "./car";
import Road from "./road";
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

const road = new Road(canvas.width / 2, canvas.width * 0.9, 16);
const car = new Car(road.getLaneCenter(7), 500, 40, 80);

function loop() {
  canvas.height = window.innerHeight;

  ctx.translate(0, -car.y + canvas.height * 0.8);

  road.draw(ctx);
  car.update(road.borders);
  car.draw(ctx);

  requestAnimationFrame(loop);
}

loop();
