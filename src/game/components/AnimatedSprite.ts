import { Component, Types } from "ecsy";

export class AnimatedSprite extends Component<AnimatedSprite> {
  frames!: string[];
  accumulator!: number;
  speed!: number;

  static schema = {
    frames: { type: Types.Array },
    accumulator: { type: Types.Number },
    speed: { type: Types.Number },
  };
}
