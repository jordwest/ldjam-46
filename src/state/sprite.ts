import { Vec2 } from "~base/vec2";

export type SpriteSequence = {
  tile: Vec2[];
};

export type Sprite = {
  size: Vec2;
  sequences: Map<string, SpriteSequence>;
};
