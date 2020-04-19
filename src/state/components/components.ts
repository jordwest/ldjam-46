import { Vec2 } from "~base/vec2";
import { Sprite } from "~state/sprite";
import { EntityId } from "~state/entity";

export type SpriteState = {
  sprite: Sprite;
  currentAnimation: string;
  frame: number;
  autoplay?: boolean;
};

export type Agility = {
  sneakSpeed: number;
  walkSpeed: number;
  runSpeed: number;
};

export type Brain = {
  fear: number;
  sawPlayerAt: Vec2 | undefined;
  targetAngle: number;
  state:
    | {
        t: "sitting";
      }
    | { t: "walking"; destination: Vec2 }
    | { t: "listening" }
    | { t: "investigating"; lookingAt: Vec2 }
    | { t: "running"; awayFrom: Vec2 }
    | { t: "frozen" };
};

export type Components = {
  position: Map<EntityId, Vec2>;
  sprite: Map<EntityId, SpriteState>;
  agility: Map<EntityId, Agility>;
  visibility: Map<EntityId, number>;
  lightSource: Map<EntityId, "torch" | "fire">;
  angle: Map<EntityId, number>;
  brain: Map<EntityId, Brain>;
};
