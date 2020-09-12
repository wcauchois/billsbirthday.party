import { Component, Types } from "ecsy";

export class Sized extends Component<Sized> {
  width!: number;
  height!: number;

  static schema = {
    width: { type: Types.Number },
    height: { type: Types.Number },
  };
}
