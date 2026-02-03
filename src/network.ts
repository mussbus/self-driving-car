import * as Constants from "./constants";

export class NeuralNetwork {
  levels: Level[];

  constructor(neuron_counts: number[]) {
    this.levels = [];
    for (let i = 0; i < neuron_counts.length - 1; i++) {
      this.levels.push(new Level(neuron_counts[i], neuron_counts[i + 1]));
    }
  }

  static mutate(network: NeuralNetwork | null): NeuralNetwork | null {
    if (!network) return null;
    for (let i = 0; i < network.levels.length; i++) {
      network.levels[i].biases = Level.mutate_biases(network.levels[i]);
      network.levels[i].weights = Level.mutate_weights(network.levels[i]);
    }
    return network;
  }

  static feed_forward(given_inputs: number[], network: NeuralNetwork) {
    let outputs = Level.feed_forward(given_inputs, network.levels[0]);
    for (let i = 1; i < network.levels.length; i++)
      outputs = Level.feed_forward(given_inputs, network.levels[i]);
    return outputs;
  }
}

export class Level {
  inputs: number[];
  outputs: number[];
  biases: number[];
  weights: number[][];

  constructor(input_count: number, output_count: number) {
    this.inputs = new Array(input_count);
    this.outputs = new Array(output_count);
    this.biases = [];
    this.weights = [];
    this.weights = Array.from({ length: this.inputs.length }, () =>
      Array(this.outputs.length).fill(0),
    );

    Level.#randomize(this);
  }

  static #randomize(level: Level) {
    for (let i = 0; i < level.weights.length; i++)
      for (let j = 0; j < level.weights[i].length; j++)
        level.weights[i][j] = Math.random() * 2 - 1;

    for (let i = 0; i < level.weights.length; i++)
      level.biases[i] = Math.random() * 2 - 1;
  }

  static feed_forward(given_inputs: number[], level: Level) {
    for (let i = 0; i < level.inputs.length; i++)
      level.inputs[i] = given_inputs[i];

    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++)
        sum += level.inputs[j] * level.weights[j][i];
      level.outputs[i] = sum > level.biases[i] ? 1 : 0;
    }
    return level.outputs;
  }
  
  static mutate_biases(level: Level): number[] {
    return level.biases.map((b) =>
      Math.max(-1, Math.min(1, b + (Math.random() * 2 - 1) * Constants.MUTATE)),
    );
  }
  
  static mutate_weights(level: Level): number[][] {
    for (let i = 0; i < level.weights.length; i++)
      for (let j = 0; j < level.weights[i].length; j++)
        level.weights[i][j] = level.weights[i][j] + Math.max(-1, Math.min(1, (Math.random() * 2 - 1) * Constants.MUTATE));
    
    return level.weights;
  }
}
