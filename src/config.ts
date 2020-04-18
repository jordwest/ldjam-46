import { Vec2 } from "~base/vec2";
import { Sprite } from "~state/sprite";

// Using the screen size of a NES
export const VIRTUAL_SCREEN_SIZE: Vec2 = {
  x: 256,
  y: 240,
};

export namespace Sprites {
  export const player: Sprite = {
    size: { x: 1, y: 2 },
    sequences: new Map([["walk-south", { tile: [{ x: 0, y: 0 }] }]]),
  };
}
