import { World, System } from "ecsy";
import { Position } from "../components/Position";
import { Renderable } from "../components/Renderable";
import { Shape } from "../components/Shape";

const SHAPE_SIZE = 40;
const SHAPE_HALF_SIZE = SHAPE_SIZE / 2;

export class RendererSystem extends System {
  readonly canvas: HTMLCanvasElement;

  constructor(world: World, attributes: { canvas: HTMLCanvasElement; }) {
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
      ctx.fillStyle = "#e2736e";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#b74843";
      ctx.stroke();
    }
  }

  static queries = {
    renderables: { components: [Renderable, Shape] }
  };
}
