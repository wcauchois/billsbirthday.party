import React, { useRef, useEffect } from "react";
import { World, System, Component, TagComponent, Types } from "ecsy";

class Sized extends Component<Sized> {
  width!: number;
  height!: number;

  static schema = {
    width: { type: Types.Number },
    height: { type: Types.Number },
  };
}

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

class Bouncable extends TagComponent {}

class Explodable extends TagComponent {}

abstract class InputEvent {}

class ClickEvent extends InputEvent {
  constructor(
    public readonly clientX: number,
    public readonly clientY: number
  ) {
    super();
  }
}

class InputManager {
  events: InputEvent[];
  private removeListenersFn: (() => void) | undefined;

  constructor(private readonly element: HTMLElement) {
    this.events = [];
  }

  reset() {
    this.events = [];
  }

  handleClick(evt: MouseEvent) {
    this.events.push(new ClickEvent(evt.clientX, evt.clientY));
  }

  addListeners() {
    const clickListener = this.handleClick.bind(this);
    this.element.addEventListener('click', clickListener);
    this.removeListenersFn = () => {
      this.element.removeEventListener('click', clickListener);
    }
    return this; // Chainable
  }

  removeListeners() {
    if (this.removeListenersFn) {
      this.removeListenersFn();
    }
  }
}

class ExplodableSystem extends System {
  readonly inputManager: InputManager;

  constructor(world: World, attributes: { inputManager: InputManager }) {
    super(world);
    this.inputManager = attributes.inputManager;
  }

  static readonly DEFAULT_SIZE = 50;

  execute(delta: number, time: number) {
    for (const event of this.inputManager.events) {
      if (!(event instanceof ClickEvent)) {
        continue;
      }
      for (const entity of this.queries.explodable.results) {
        const sized = entity.getComponent(Sized);
        const position = entity.getComponent(Position)!;

        const halfWidth = (sized?.width ?? ExplodableSystem.DEFAULT_SIZE) / 2;
        const halfHeight = (sized?.height ?? ExplodableSystem.DEFAULT_SIZE) / 2;

        const hit = event.clientX >= position.x - halfWidth && event.clientX <= position.x + halfWidth &&
          event.clientY >= position.y - halfHeight && event.clientY <= position.y + halfHeight;

        if (hit) {
          // TODO
        }
      }
    }
  }

  static queries = {
    explodable: {
      components: [Position, Explodable]
    }
  }
}

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

class BouncableSystem extends System {
  readonly canvas: HTMLCanvasElement;

  constructor(world: World, attributes: { canvas: HTMLCanvasElement }) {
    super(world);
    this.canvas = attributes.canvas;
  }

  execute(delta: number, time: number) {
    for (const entity of this.queries.bouncable.results) {
      const velocity = entity.getMutableComponent(Velocity)!;
      const position = entity.getComponent(Position)!;
      const sized = entity.getComponent(Sized)!;

      if (
        (position.x + sized.width / 2 > this.canvas.width && velocity.x > 0) ||
        (position.x - sized.width / 2 < 0 && velocity.x < 0)
      ) {
        velocity.x *= -1;
      }

      if (
        (position.y + sized.height / 2 > this.canvas.height && velocity.y > 0) ||
        (position.y - sized.height / 2 < 0 && velocity.y < 0)
      ) {
        velocity.y *= -1;
      }
    }
  }

  static queries = {
    bouncable: {
      components: [Velocity, Position, Sized]
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
