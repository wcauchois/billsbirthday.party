import { Component, Types } from "ecsy";

export class ConfettiParticle extends Component<ConfettiParticle> {
  color!: string;

  static schema = {
    color: { type: Types.String },
  };
} 
