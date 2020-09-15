import { World, System } from "ecsy";
import { Position } from "../components/Position";
import { ConfettiParticle } from "../components/ConfettiParticle";

export class ConfettiParticleRendererSystem extends System {
  readonly canvas: HTMLCanvasElement;

  constructor(world: World, attributes: { canvas: HTMLCanvasElement; }) {
    super(world);
    this.canvas = attributes.canvas;
  }

  execute(delta: number, time: number) {
    const ctx = this.canvas.getContext('2d')!;

    for (const entity of this.queries.particles.results) {
      const position = entity.getComponent(Position)!;
      ctx.beginPath();
      ctx.rect(position.x - 5, position.y - 5, 10, 10);
      ctx.fillStyle = "#e2736e";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#b74843";
      ctx.stroke();
    }
  }

  static queries = {
    particles: { components: [ConfettiParticle] }
  };
}
