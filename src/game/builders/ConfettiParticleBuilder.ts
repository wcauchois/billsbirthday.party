import { World } from "ecsy";
import { ConfettiParticle } from "../components/ConfettiParticle";
import { Position } from "../components/Position";
import { Velocity } from "../components/Velocity";
import tinycolor from "tinycolor2";
import { Rotation } from "../components/Rotation";
import { AngularVelocity } from "../components/AngularVelocity";
import { Decaying } from "../components/Decaying";

export class ConfettiParticleBuilder {
  private positionX!: number;
  private positionY!: number;

  static readonly StartColor = `#ce37e0`;
  static readonly EndColor = `#5f1bb9`;

  static start() {
    return new ConfettiParticleBuilder();
  }

  position(x: number, y: number) {
    this.positionX = x;
    this.positionY = y;
    return this;
  }

  private randomAngle() {
    return Math.random() * Math.PI * 2;
  }

  addToWorld(world: World) {
    const velocityAngle = this.randomAngle();
    const randomVelocity = Math.random();
    const velocityX = Math.cos(velocityAngle) * randomVelocity;
    const velocityY = Math.sin(velocityAngle) * randomVelocity;
    const mixAmount = Math.random() * 100;
    const color = tinycolor.mix(ConfettiParticleBuilder.StartColor, ConfettiParticleBuilder.EndColor, mixAmount).toHexString();
    const rotationAngle = this.randomAngle();
    return world.createEntity()
      .addComponent(Position, { x: this.positionX, y: this.positionY })
      .addComponent(Velocity, { x: velocityX, y: velocityY })
      .addComponent(Rotation, { angle: rotationAngle })
      .addComponent(Decaying, { life: 100, rate: 0.06 })
      .addComponent(AngularVelocity, { amount: 0.01 })
      .addComponent(ConfettiParticle, { color });
  }
}
