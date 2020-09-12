import { System, World } from "ecsy";
import { InputManager, ClickEvent } from "../managers/InputManager";
import { Sized } from "../components/Sized";
import { Position } from "../components/Position";
import { Explodable } from "../components/Explodable";

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
        const sized = entity.getComponent(Sized);
        const position = entity.getComponent(Position)!;

        const halfWidth = (sized?.width ?? ExplodableSystem.DEFAULT_SIZE) / 2;
        const halfHeight = (sized?.height ?? ExplodableSystem.DEFAULT_SIZE) / 2;

        const hit = event.clientX >= position.x - halfWidth && event.clientX <= position.x + halfWidth &&
          event.clientY >= position.y - halfHeight && event.clientY <= position.y + halfHeight;

        if (hit) {
          entity.remove();
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
