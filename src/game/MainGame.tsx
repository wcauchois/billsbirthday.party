import React, { useRef, useEffect } from "react";
import { World } from "ecsy";

import { BoundingBox } from "./components/BoundingBox";
import { Velocity } from "./components/Velocity";
import { Bouncable } from "./components/Bouncable";
import { Position } from "./components/Position";
import { MovableSystem } from "./systems/MovableSystem";
import { ExplodableSystem } from "./systems/ExplodableSystem";
import { BouncableSystem } from "./systems/BouncableSystem";
import { Renderable } from "./components/Renderable";
import { Shape } from "./components/Shape";
import { RendererSystem } from "./systems/RendererSystem";
import { InputManager } from "./managers/InputManager";
import { Explodable } from "./components/Explodable";
import { ConfettiParticle } from "./components/ConfettiParticle";
import { ConfettiParticleRendererSystem } from "./systems/ConfettiParticleRendererSystem";
import { AnimatedSpriteSystem } from "./systems/AnimatedSpriteSystem";
import { AnimatedSprite } from "./components/AnimatedSprite";

import twentyTwenty0 from '../images/2020/frame-0.png';
import twentyTwenty1 from '../images/2020/frame-1.png';
import twentyTwenty2 from '../images/2020/frame-2.png';
import twentyTwenty3 from '../images/2020/frame-3.png';
import twentyTwenty4 from '../images/2020/frame-4.png';
import { Rotation } from "./components/Rotation";
import { AngularVelocity } from "./components/AngularVelocity";
const twentyTwentyFrames = [
  twentyTwenty0,
  twentyTwenty1,
  twentyTwenty2,
  twentyTwenty3,
  twentyTwenty4,
];

export default function MainGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    function doResize() {
      if (!canvasRef.current) {
        return;
      }
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    }
    doResize();
    const resizeListener = () => doResize();
    window.addEventListener('resize', resizeListener);
    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    const inputManager = new InputManager(canvas).addListeners();

    let paused = false;
    const keydownListener =  (evt: KeyboardEvent) => {
      if (evt.key === 'p') {
        paused = !paused;
      }
    };
    window.addEventListener('keydown', keydownListener);

    const world = new World();
    world
      .registerComponent(Velocity)
      .registerComponent(Position)
      .registerComponent(Shape)
      .registerComponent(BoundingBox)
      .registerComponent(Bouncable)
      .registerComponent(Renderable)
      .registerComponent(Explodable)
      .registerComponent(ConfettiParticle)
      .registerComponent(AnimatedSprite)
      .registerComponent(Rotation)
      .registerComponent(AngularVelocity)
      .registerSystem(MovableSystem, { getPaused: () => paused })
      .registerSystem(ExplodableSystem, { inputManager })
      .registerSystem(RendererSystem, { canvas })
      .registerSystem(ConfettiParticleRendererSystem, { canvas })
      .registerSystem(AnimatedSpriteSystem, { canvas })
      .registerSystem(BouncableSystem, { canvas });

    world
      .createEntity()
      .addComponent(Position, { x: 100, y: 100 })
      .addComponent(Rotation, { angle: 0 })
      .addComponent(AngularVelocity, { amount: 0.01 })
      .addComponent(Velocity, { x: 0.1, y: 0.1 })
      .addComponent(BoundingBox, { width: 188, height: 88 })
      .addComponent(Explodable)
      .addComponent(AnimatedSprite, {
        accumulator: 0,
        speed: 0.01,
        frames: twentyTwentyFrames
      });
      /*
    world
      .createEntity()
      .addComponent(Position, { x: 100, y: 100 })
      .addComponent(Velocity, { x: 0.1, y: 0.1 })
      .addComponent(Shape)
      .addComponent(Explodable)
      .addComponent(Sized, { width: 40, height: 40 })
      .addComponent(Bouncable)
      .addComponent(Renderable);

    world
      .createEntity()
      .addComponent(Position, { x: 500, y: 100 })
      .addComponent(Velocity, { x: -0.1, y: 0.1 })
      .addComponent(Shape)
      .addComponent(Explodable)
      .addComponent(Sized, { width: 40, height: 40 })
      .addComponent(Bouncable)
      .addComponent(Renderable);
      */


    let animHandle = 0;
    let lastTime = performance.now();
    function run() {
      const time = performance.now();
      const delta = time - lastTime;

      world.execute(delta, time);

      inputManager.reset();
      lastTime = time;
      requestAnimationFrame(run);
    }
    requestAnimationFrame(run);

    return () => {
      cancelAnimationFrame(animHandle)
      inputManager.removeListeners();
      window.removeEventListener('keydown', keydownListener);
    };
  }, []);

  return (
    <canvas width="200" height="200" ref={canvasRef} />
  );
}
