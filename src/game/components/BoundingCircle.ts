import { Component, Types } from "ecsy";

export class BoundingCircle extends Component<BoundingCircle> {
  radius!: number;

  static schema = {
    radius: { type: Types.Number },
  };
}
