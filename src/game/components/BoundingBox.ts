import { Component, Types } from "ecsy";

export class BoundingBox extends Component<BoundingBox> {
  width!: number;
  height!: number;

  static schema = {
    width: { type: Types.Number },
    height: { type: Types.Number },
  };
}
