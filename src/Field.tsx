import React, { useRef, useEffect } from "react";
import { World, System, Component, TagComponent, Types } from "ecsy";

class Velocity extends Component<Velocity> {
  x!: number;
  y!: number;
  
  static schema = {
    x: { type: Types.Number },
    y: { type: Types.Number },
  };
}

class Position extends Component<Position> {
  x!: number;
  y!: number;

  static schema = {
    x: { type: Types.Number },
    y: { type: Types.Number },
  };
}

class Shape extends Component<{}> {}

class Renderable extends TagComponent {}

class MovableSystem extends System {
  execute(delta: number, time: number) {
    for (const entity of this.queries.moving.results) {
      const velocity = entity.getComponent(Velocity)!;
      const position = entity.getMutableComponent(Position)!;
      position.x += velocity.x * delta;
      position.y += velocity.y * delta;
    }
  }

  static queries = {
    moving: {
      components: [Velocity, Position]
    }
  };
}

const SHAPE_SIZE = 40;
const SHAPE_HALF_SIZE = SHAPE_SIZE / 2;

class RendererSystem extends System {
  readonly canvas: HTMLCanvasElement;

  constructor(world: World, attributes: { canvas: HTMLCanvasElement }) {
    super(world);
    this.canvas = attributes.canvas;
  }

  execute(delta: number, time: number) {
    const ctx = this.canvas.getContext('2d')!;
    ctx.fillStyle = "#d4d4d4";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (const entity of this.queries.renderables.results) {
      const position = entity.getComponent(Position)!;
      ctx.beginPath();
      ctx.rect(position.x - SHAPE_HALF_SIZE, position.y - SHAPE_HALF_SIZE, SHAPE_SIZE, SHAPE_SIZE);
      ctx.fillStyle= "#e2736e";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#b74843";
      ctx.stroke();
    }
  }

  static queries = {
    renderables: { components: [Renderable, Shape] }
  }
}

export default function Field() {
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
    const world = new World();
    world
      .registerComponent(Velocity)
      .registerComponent(Position)
      .registerComponent(Shape)
      .registerComponent(Renderable)
      .registerSystem(MovableSystem)
      .registerSystem(RendererSystem, { canvas: canvasRef.current });

    world.createEntity()
      .addComponent(Position, { x: 100, y: 100 })
      .addComponent(Velocity, { x: 0.1, y: 0.1 })
      .addComponent(Shape)
      .addComponent(Renderable);

    let animHandle = 0;
    let lastTime = performance.now();
    function run() {
      const time = performance.now();
      const delta = time - lastTime;

      world.execute(delta, time);

      lastTime = time;
      requestAnimationFrame(run);
    }
    requestAnimationFrame(run);
    return () => cancelAnimationFrame(animHandle);
  }, []);

  return (
    <canvas width="200" height="200" ref={canvasRef} />
  );
}
