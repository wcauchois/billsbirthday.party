import React, { useRef, useEffect } from "react";
import { World } from "ecsy";

import { Sized } from "./components/Sized";
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

    const world = new World();
    world
      .registerComponent(Velocity)
      .registerComponent(Position)
      .registerComponent(Shape)
      .registerComponent(Sized)
      .registerComponent(Bouncable)
      .registerComponent(Renderable)
      .registerComponent(Explodable)
      .registerSystem(MovableSystem)
      .registerSystem(ExplodableSystem, { inputManager })
      .registerSystem(RendererSystem, { canvas })
      .registerSystem(BouncableSystem, { canvas });

    world
      .createEntity()
      .addComponent(Position, { x: 100, y: 100 })
      .addComponent(Velocity, { x: 0.1, y: 0.1 })
      .addComponent(Shape)
      .addComponent(Explodable)
      .addComponent(Sized, { width: 40, height: 40 })
      .addComponent(Bouncable)
      .addComponent(Renderable);

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
    };
  }, []);

  return (
    <canvas width="200" height="200" ref={canvasRef} />
  );
}
