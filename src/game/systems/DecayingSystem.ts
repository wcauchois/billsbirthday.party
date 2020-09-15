import { System } from "ecsy";
import { Decaying } from "../components/Decaying";

export class DecayingSystem extends System {
  execute(delta: number, time: number) {
    for (const entity of this.queries.decaying.results) {
      const decaying = entity.getMutableComponent(Decaying)!;
      decaying.life -= decaying.rate * delta;
      if (decaying.life <= 0) {
        entity.remove();
      }
    }
  }

  static queries = {
    decaying: {
      components: [Decaying]
    }
  };
}
