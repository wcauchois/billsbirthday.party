import { World, System } from "ecsy";
import { Position } from "../components/Position";
import { ConfettiParticle } from "../components/ConfettiParticle";
import { Rotation } from "../components/Rotation";
import { Decaying } from "../components/Decaying";
import tinycolor from "tinycolor2";

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
      const angle = entity.getComponent(Rotation)?.angle ?? 0;
      const particle = entity.getComponent(ConfettiParticle)!;
      const decaying = entity.getComponent(Decaying);
      const alpha = decaying ? decaying.life / 100 : 100;

      ctx.save();
      ctx.translate(position.x, position.y);
      ctx.rotate(angle);
      ctx.fillStyle = tinycolor(particle.color).setAlpha(alpha).toRgbString();
      ctx.beginPath();
      ctx.moveTo(0, -8);
      ctx.lineTo(5, 0);
      ctx.lineTo(0, 8);
      ctx.lineTo(-5, 0);
      ctx.fill();
      ctx.restore();
    }
  }

  static queries = {
    particles: { components: [ConfettiParticle, Position] }
  };
}
