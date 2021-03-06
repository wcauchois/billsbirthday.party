import { Component, Types } from "ecsy";

export class Position extends Component<Position> {
  x!: number;
  y!: number;

  static schema = {
    x: { type: Types.Number },
    y: { type: Types.Number },
  };
}
