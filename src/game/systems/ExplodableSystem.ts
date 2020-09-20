import { System, World } from "ecsy";
import { InputManager, ClickEvent } from "../managers/InputManager";
import { Position } from "../components/Position";
import { Explodable } from "../components/Explodable";
import { entityToSat, pointInSat } from "../helpers/collision";
import { ConfettiParticleBuilder } from "../builders/ConfettiParticleBuilder";
import { Sound, SoundManager } from "../managers/SoundManager";

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
          SoundManager.get().play(Sound.Explosion);
          for (let i = 0; i < 100; i++) {
            ConfettiParticleBuilder.start()
              .position(position.x, position.y)
              .addToWorld(this.world);
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
