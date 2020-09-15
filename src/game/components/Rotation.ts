import { Component, Types } from "ecsy";

export class Rotation extends Component<Rotation> {
  angle!: number;

  static schema = {
    angle: { type: Types.Number },
  };
}
