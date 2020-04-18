export type Vec2 = {
  x: number;
  y: number;
};

export namespace Vec2 {
  export const toArray = (v: Vec2): [number, number] => [v.x, v.y];

  /**
   * Quantize a vector to the nearest tile
   */
  export const quantize = (v: Vec2, tileSize: number) => ({
    x: Math.floor(v.x / tileSize) * tileSize,
    y: Math.floor(v.y / tileSize) * tileSize,
  });

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
