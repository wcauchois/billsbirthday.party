import { Component, Types } from "ecsy";

export class Decaying extends Component<Decaying> {
  life!: number;
  rate!: number;

  static schema = {
    life: { type: Types.Number },
    rate: { type: Types.Number },
  };
}
