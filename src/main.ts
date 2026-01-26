const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
var height = 494;
var height2 = 534;
var height3 = 500;

const move = true;

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.fillRect(190, height3, 20, 40);
  ctx.fillStyle = "black";
  ctx.fillRect(186, height, 8, 12);
  ctx.fillRect(206, height, 8, 12);
  ctx.fillRect(186, height2, 8, 12);
  ctx.fillRect(206, height2, 8, 12);

  if (move) {
    height--;
    height2--;
    height3--;
  }

  requestAnimationFrame(loop);
}

loop();
