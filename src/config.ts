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
    sequences: new Map([
      [
        "walk-south",
        {
          tile: [
            { x: 0, y: 8 },
            { x: 1, y: 8 },
            { x: 0, y: 8 },
            { x: 2, y: 8 },
          ],
        },
      ],
    ]),
  };

  export const human: Sprite = {
    size: { x: 1, y: 1 },
    sequences: new Map([
      ["standing", { tile: [{ x: 0, y: 2 }] }],
      ["sitting", { tile: [{ x: 0, y: 3 }] }],
    ]),
  };

  export const dialogueLook: Sprite = {
    size: { x: 1, y: 1 },
    sequences: new Map([["default", { tile: [{ x: 11, y: 2 }] }]]),
  };

  export const dialogueAhh: Sprite = {
    size: { x: 1, y: 1 },
    sequences: new Map([
      [
        "default",
        {
          tile: [
            { x: 11, y: 3 },
            { x: 11, y: 4 },
          ],
        },
      ],
    ]),
  };

  export const fearParticle: Sprite = {
    size: { x: 1, y: 1 },
    sequences: new Map([
      [
        "default",
        {
          tile: [
            { x: 14, y: 0 },
            { x: 14, y: 1 },
            { x: 14, y: 2 },
            { x: 14, y: 1 },
          ],
        },
      ],
      ["collected", { tile: [{ x: 15, y: 0 }] }],
    ]),
  };

  export const fire: Sprite = {
    size: { x: 1, y: 1 },
    sequences: new Map([
      [
        "default",
        {
          tile: [
            { x: 11, y: 0 },
            { x: 11, y: 1 },
          ],
        },
      ],
    ]),
  };
}
