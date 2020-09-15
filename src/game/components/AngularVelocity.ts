import { Component, Types } from "ecsy";

export class AngularVelocity extends Component<AngularVelocity> {
  amount!: number;

  static schema = {
    amount: { type: Types.Number },
  };
}
