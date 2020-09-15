import { World, System } from "ecsy";
import { BoundingBox } from "../components/BoundingBox";
import { Velocity } from "../components/Velocity";
import { Position } from "../components/Position";

export class BouncableSystem extends System {
  readonly canvas: HTMLCanvasElement;

  constructor(world: World, attributes: { canvas: HTMLCanvasElement; }) {
    super(world);
    this.canvas = attributes.canvas;
  }

  execute(delta: number, time: number) {
    for (const entity of this.queries.bouncable.results) {
      const velocity = entity.getMutableComponent(Velocity)!;
      const position = entity.getComponent(Position)!;
      const boundingBox = entity.getComponent(BoundingBox)!;

      if ((position.x + boundingBox.width / 2 > this.canvas.width && velocity.x > 0) ||
        (position.x - boundingBox.width / 2 < 0 && velocity.x < 0)) {
        velocity.x *= -1;
      }

      if ((position.y + boundingBox.height / 2 > this.canvas.height && velocity.y > 0) ||
        (position.y - boundingBox.height / 2 < 0 && velocity.y < 0)) {
        velocity.y *= -1;
      }
    }
  }

  static queries = {
    bouncable: {
      components: [Velocity, Position, BoundingBox]
    }
  };
}
