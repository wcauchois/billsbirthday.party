import { System } from "ecsy";
import { Velocity } from "../components/Velocity";
import { Position } from "../components/Position";
import { Rotation } from "../components/Rotation";
import { AngularVelocity } from "../components/AngularVelocity";

export class MovableSystem extends System {
  execute(delta: number, time: number) {
    for (const entity of this.queries.moving.results) {
      const velocity = entity.getComponent(Velocity)!;
      const position = entity.getMutableComponent(Position)!;
      position.x += velocity.x * delta;
      position.y += velocity.y * delta;
    }

    for (const entity of this.queries.rotating.results) {
      const angularVelocity = entity.getComponent(AngularVelocity)!;
      const rotation = entity.getMutableComponent(Rotation)!;
      rotation.rotation += angularVelocity.amount;
    }
  }

  static queries = {
    moving: {
      components: [Velocity, Position]
    },
    rotating: {
      components: [Rotation, AngularVelocity]
    }
  };
}
