import { get_RGBA, lerp } from "./helpers";
import { Level, NeuralNetwork } from "./network";
export default class Visualizer {
  constructor() {}

  static draw_network(ctx: CanvasRenderingContext2D, network: NeuralNetwork) {
    const margin = 20;
    const left = margin;
    const top = margin;
    const width = ctx.canvas.width - 2 * margin;
    const height = ctx.canvas.height - 2 * margin;

    const level_height = height / network.levels.length;

    for (let i = 0; i < network.levels.length; i++) {
      const level_top =
        top +
        lerp(
          height - level_height,
          0,
          network.levels.length === 1 ? 0.5 : i / (network.levels.length - 1),
        );
      Visualizer.draw_level(
        ctx,
        network.levels[i],
        left,
        level_top,
        width,
        level_height,
      );
    }
  }

  static draw_level(
    ctx: CanvasRenderingContext2D,
    level: Level,
    left: number,
    top: number,
    width: number,
    height: number,
  ) {
    const right = left + width;
    const bottom = top + height;
    const node_radius = 18;
    const { inputs, outputs, weights, biases } = level;

    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < outputs.length; j++) {
        ctx.beginPath();
        ctx.moveTo(left, Visualizer.#getNodeY(inputs, i, top, bottom));
        ctx.lineTo(right, Visualizer.#getNodeY(outputs, j, top, bottom));
        ctx.lineWidth = 1;
        const value = weights[i][j];
        ctx.strokeStyle = get_RGBA(value);
        ctx.stroke();
      }
    }

    for (let i = 0; i < inputs.length; i++) {
      const y = Visualizer.#getNodeY(inputs, i, top, bottom);
      ctx.beginPath();
      ctx.arc(left, y, node_radius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(left, y, node_radius * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = get_RGBA(inputs[i]);
      ctx.fill();
    }

    for (let i = 0; i < outputs.length; i++) {
      const y = Visualizer.#getNodeY(outputs, i, top, bottom);
      ctx.beginPath();
      ctx.arc(right, y, node_radius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(right, y, node_radius * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = get_RGBA(outputs[i]);
      ctx.fill();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.arc(right, y, node_radius, 0, Math.PI * 2);
      ctx.strokeStyle = get_RGBA(biases[i]);
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  static #getNodeY(nodes: number[], i: number, top: number, bottom: number) {
    return lerp(top, bottom, nodes.length === 1 ? 0.5 : i / (nodes.length - 1));
  }
}
