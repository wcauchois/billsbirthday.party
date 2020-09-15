import { World } from "ecsy";
import { AngularVelocity } from "../components/AngularVelocity";
import { AnimatedSprite } from "../components/AnimatedSprite";
import { BoundingBox } from "../components/BoundingBox";
import { Explodable } from "../components/Explodable";
import { Important } from "../components/Important";
import { Position } from "../components/Position";
import { Rotation } from "../components/Rotation";
import { Velocity } from "../components/Velocity";
import { randomAngle } from "../utils";

export class AsteroidBuilder {
  private _frames!: string[];
  private _width!: number;
  private _height!: number;

  private constructor(private readonly position: { x: number; y: number; }) {}

  static start(canvas: HTMLCanvasElement) {
    return new AsteroidBuilder({
      // x: Math.random() * (canvas.width - 100) + 50,
      // y: Math.random() * (canvas.width - 100) + 50,
      x: Math.random() * 200 + 50,
      y: Math.random() * 200 + 50,
    });
  }

  width(width: number) {
    this._width = width;
    return this;
  }

  height(height: number) {
    this._height = height;
    return this;
  }

  frames(...frames: string[]) {
    this._frames = frames;
    return this;
  }

  addToWorld(world: World) {
    const randomAngle1 = randomAngle();
    const randomAngle2 = randomAngle();
    const velocity = {
      x: Math.cos(randomAngle2) * 0.3,
      y: Math.sin(randomAngle2) * 0.3
    };
    world
      .createEntity()
      .addComponent(Position, this.position)
      .addComponent(Rotation, { angle: randomAngle1 })
      .addComponent(AngularVelocity, { amount: 0.01 })
      .addComponent(Velocity, velocity)
      .addComponent(BoundingBox, { width: this._width, height: this._height })
      .addComponent(Explodable)
      .addComponent(Important)
      .addComponent(AnimatedSprite, {
        accumulator: 0,
        speed: 0.01,
        frames: this._frames
      });
  }
}
