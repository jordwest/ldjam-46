import { Angle } from "./angle";

export type Vec2 = {
  x: number;
  y: number;
};

export namespace Vec2 {
  export const ORIGIN: Vec2 = { x: 0, y: 0 };

  export const toArray = (v: Vec2): [number, number] => [v.x, v.y];

  /**
   * Quantize a vector to the nearest tile
   */
  export const quantize = (v: Vec2, tileSize: number) => ({
    x: Math.round(v.x / tileSize) * tileSize,
    y: Math.round(v.y / tileSize) * tileSize,
  });

  export const distance = (a: Vec2, b: Vec2): number =>
    Math.hypot(a.x - b.x, a.y - b.y);

  export const unitVector = (v: Vec2): Vec2 => {
    const d = distance(ORIGIN, v);
    return {
      x: v.x / d,
      y: v.y / d,
    };
  };

  export const angleOf = (v: Vec2): number =>
    Angle.normalize(Math.atan2(v.y, v.x));

  export const angleTo = (v: Vec2, target: Vec2): number =>
    angleOf(Vec2.subtract(v, target));

  export const divScalar = (v: Vec2, scalar: number) => ({
    x: v.x / scalar,
    y: v.y / scalar,
  });

  export const multScalar = (v: Vec2, scalar: number) => ({
    x: v.x * scalar,
    y: v.y * scalar,
  });
  export const add = (a: Vec2, b: Vec2): Vec2 => ({
    x: a.x + b.x,
    y: a.y + b.y,
  });
  export const subtract = (a: Vec2, b: Vec2): Vec2 => ({
    x: a.x - b.x,
    y: a.y - b.y,
  });
}
