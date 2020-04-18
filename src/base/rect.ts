import { Vec2 } from "./vec2";

export type Rect = {
  x: number;
  y: number;
  x2: number;
  y2: number;
};

export namespace Rect {
  /**
   * Given a centre point, calculate a rect with a given width & height
   */
  export function fromCenter(center: Vec2, size: Vec2): Rect {
    return {
      x: center.x - size.x / 2,
      y: center.y - size.y / 2,
      x2: center.x + size.x / 2,
      y2: center.y + size.y / 2,
    };
  }

  /**
   * Extend the size of this rect by the given amount in each direction, keeping
   * the centre of the rect the same
   */
  export function extend(rect: Rect, amount: Vec2): Rect {
    return {
      x: rect.x - amount.x / 2,
      y: rect.y - amount.y / 2,

      x2: rect.x + amount.x / 2,
      y2: rect.y + amount.y / 2,
    };
  }
}
