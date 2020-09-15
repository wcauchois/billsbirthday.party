import { Entity } from 'ecsy';
import SAT from 'sat';
import { BoundingBox } from '../components/BoundingBox';
import { BoundingCircle } from '../components/BoundingCircle';
import { Position } from '../components/Position';
import { Rotation } from '../components/Rotation';

type AnySAT = SAT.Polygon | SAT.Circle;

export function entityToSat(entity: Entity): AnySAT | undefined {
  const position = entity.getComponent(Position);
  if (!position) {
    return undefined;
  }

  const boundingBox = entity.getComponent(BoundingBox);
  if (boundingBox) {
    const rotation = entity.getComponent(Rotation);
    const halfWidth = boundingBox.width / 2;
    const halfHeight = boundingBox.height / 2;
    const polygon = new SAT.Polygon(new SAT.Vector(), [
      new SAT.Vector(-halfWidth, -halfHeight),
      new SAT.Vector(halfWidth, -halfHeight),
      new SAT.Vector(halfWidth, halfHeight),
      new SAT.Vector(-halfWidth, halfHeight)
    ]);
    if (rotation) {
      polygon.rotate(rotation.angle);
    }
    polygon.translate(position.x, position.y);
    return polygon;
  }

  const boundingCircle = entity.getComponent(BoundingCircle);
  if (boundingCircle) {
    return new SAT.Circle(new SAT.Vector(position.x, position.y), boundingCircle.radius);
  }

  return undefined;
}

export function pointInSat(sat: AnySAT, pointX: number, pointY: number) {
  const point = new SAT.Vector(pointX, pointY);
  return sat instanceof SAT.Polygon ? SAT.pointInPolygon(point, sat) : SAT.pointInCircle(point, sat);
}
