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
  accumulatedFear: number;
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

type Collectable = {
  state: "available" | "collecting";
  type: { t: "fear-droplet" };
};

type Particle = {
  velocity: Vec2;
  velocityDamp: number;
  jitter: number;
};

type Lifetime = {
  current: number;
  max: number;
};

export type Components = {
  position: Map<EntityId, Vec2>;
  screenPosition: Map<EntityId, Vec2>;
  sprite: Map<EntityId, SpriteState>;
  agility: Map<EntityId, Agility>;
  visibility: Map<EntityId, number>;
  lightSource: Map<EntityId, "torch" | "fire">;
  angle: Map<EntityId, number>;
  brain: Map<EntityId, Brain>;
  lifetime: Map<EntityId, Lifetime>;
  collectable: Map<EntityId, Collectable>;
  particle: Map<EntityId, Particle>;
};
