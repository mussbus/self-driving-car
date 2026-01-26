import Car from "./car";
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

const car = new Car(400, 500, 20, 40);

function loop() {
  canvas.height = window.innerHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  car.update();
  car.draw(ctx);

  requestAnimationFrame(loop);
}

loop();

// if (import.meta.hot) {
//   import.meta.hot.accept();
// }
