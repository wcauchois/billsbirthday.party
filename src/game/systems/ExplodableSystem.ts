import { System, World } from "ecsy";
import { InputManager, ClickEvent } from "../managers/InputManager";
import { BoundingBox } from "../components/BoundingBox";
import { Position } from "../components/Position";
import { Explodable } from "../components/Explodable";
import { Velocity } from "../components/Velocity";
import { ConfettiParticle } from "../components/ConfettiParticle";
import { entityToSat, pointInSat } from "../helpers/collision";

export class ExplodableSystem extends System {
  readonly inputManager: InputManager;

  constructor(world: World, attributes: { inputManager: InputManager }) {
    super(world);
    this.inputManager = attributes.inputManager;
  }

  static readonly DEFAULT_SIZE = 50;

  execute(delta: number, time: number) {
    for (const event of this.inputManager.events) {
      if (!(event instanceof ClickEvent)) {
        continue;
      }
      for (const entity of this.queries.explodable.results) {
        const position = entity.getComponent(Position)!;

        const sat = entityToSat(entity);
        if (!sat) {
          continue;
        }

        const hit = pointInSat(sat, event.clientX, event.clientY);

        if (hit) {
          entity.remove();
          for (let i = 0; i < 100; i++) {
            this.world.createEntity()
              .addComponent(Position, { x: position.x, y: position.y })
              .addComponent(Velocity, { x: Math.random() - 0.5, y: Math.random() - 0.5 })
              .addComponent(ConfettiParticle);
          }
        }
      }
    }
  }

  static queries = {
    explodable: {
      components: [Position, Explodable]
    }
  }
}
