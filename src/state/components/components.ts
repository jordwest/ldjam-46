import { EntityId } from "~state/entityid";
import { Vec2 } from "~base/vec2";
import { Sprite } from "~state/sprite";

export type SpriteState = {
  sprite: Sprite;
  currentAnimation: string;
  frame: number;
};

export type Agility = {
  sneakSpeed: number;
  walkSpeed: number;
  runSpeed: number;
};

export type Components = {
  position: Map<EntityId, Vec2>;
  sprite: Map<EntityId, SpriteState>;
  agility: Map<EntityId, Agility>;
};
