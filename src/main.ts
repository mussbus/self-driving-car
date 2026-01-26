import Car from "./car";
import Road from "./road";
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

const car = new Car(400, 500, 20, 40);
const road = new Road(canvas.width / 2, canvas.width * 0.95, 7);

function loop() {
  canvas.height = window.innerHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  road.draw(ctx);
  car.update();
  car.draw(ctx);

  requestAnimationFrame(loop);
}

loop();
