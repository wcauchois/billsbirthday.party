import { Component, Types } from "ecsy";

export class Velocity extends Component<Velocity> {
  x!: number;
  y!: number;

  static schema = {
    x: { type: Types.Number },
    y: { type: Types.Number },
  };
}
