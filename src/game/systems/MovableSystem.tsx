import { System } from "ecsy";
import { Velocity } from "../components/Velocity";
import { Position } from "../components/Position";

export class MovableSystem extends System {
  execute(delta: number, time: number) {
    for (const entity of this.queries.moving.results) {
      const velocity = entity.getComponent(Velocity)!;
      const position = entity.getMutableComponent(Position)!;
      position.x += velocity.x * delta;
      position.y += velocity.y * delta;
    }
  }

  static queries = {
    moving: {
      components: [Velocity, Position]
    }
  };
}
