import { World, System } from "ecsy";
import { Position } from "../components/Position";
import { ConfettiParticle } from "../components/ConfettiParticle";
import { Rotation } from "../components/Rotation";
import { AnimatedSprite } from "../components/AnimatedSprite";
import { ResourceManager } from "../managers/ResourceManager";

export class AnimatedSpriteSystem extends System {
  readonly canvas: HTMLCanvasElement;

  constructor(world: World, attributes: { canvas: HTMLCanvasElement; }) {
    super(world);
    this.canvas = attributes.canvas;
  }

  execute(delta: number, time: number) {
    const ctx = this.canvas.getContext('2d')!;

    for (const entity of this.queries.sprites.results) {
      const sprite = entity.getMutableComponent(AnimatedSprite)!;
      const position = entity.getComponent(Position)!;
      const angle = entity.getComponent(Rotation)?.rotation ?? 0;

      sprite.accumulator += delta * sprite.speed;
      const frameIndex = Math.floor(sprite.accumulator % sprite.frames.length);
      const currentFrame = sprite.frames[frameIndex];

      const image = ResourceManager.get().image(currentFrame);
      if (!image) {
        continue; // Image not loaded yet
      }

      ctx.save();
      ctx.translate(position.x, position.y);
      ctx.rotate(angle);
      ctx.drawImage(image, -image.width / 2, -image.height / 2);
      ctx.restore();

    }
  }

  static queries = {
    sprites: { components: [AnimatedSprite, Position] } // Rotation optional
  };
}
