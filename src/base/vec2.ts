export type Vec2 = {
  x: number;
  y: number;
};

export namespace Vec2 {
  export const toArray = (v: Vec2): [number, number] => [v.x, v.y];
}
