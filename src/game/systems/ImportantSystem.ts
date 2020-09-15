import { System, World } from "ecsy";
import { Important } from "../components/Important";

export class ImportantSystem extends System {
  private readonly onDone: () => void;
  private fired = false;

  constructor(world: World, attributes: { onDone(): void; }) {
    super(world);
    this.onDone = attributes.onDone;
  }

  execute(delta: number, time: number) {
    if (this.queries.important.results.length === 0) {
      if (!this.fired) {
        this.onDone();
        this.fired = true;
      }
    }
  }

  static queries = {
    important: {
      components: [Important]
    },
  };
}
