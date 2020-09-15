import { Component, Types } from "ecsy";

export class Rotation extends Component<Rotation> {
  rotation!: number;

  static schema = {
    rotation: { type: Types.Number },
  };
}
