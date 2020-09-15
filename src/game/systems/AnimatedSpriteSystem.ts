import { World, System } from "ecsy";
import { Position } from "../components/Position";
import { Rotation } from "../components/Rotation";
import { AnimatedSprite } from "../components/AnimatedSprite";
import { ResourceManager } from "../managers/ResourceManager";
import { entityToSat } from "../helpers/collision";

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
      const angle = entity.getComponent(Rotation)?.angle ?? 0;

      sprite.accumulator += delta * sprite.speed;
      const frameIndex = Math.floor(sprite.accumulator % sprite.frames.length);

      const allImages = sprite.frames.map(frame => ResourceManager.get().image(frame));
      if (!allImages.every(x => x)) {
        continue; // Images not loaded yet
      }
      const image = allImages[frameIndex]!;

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
