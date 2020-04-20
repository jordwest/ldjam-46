import { Vec2 } from "~base/vec2";
import { Sprite } from "~state/sprite";
import { EntityId } from "~state/entity";
import { Audio } from "~audio/audio";

export type SpriteState = {
  sprite: Sprite;
  currentAnimation: string;
  frame: number;
  layer: "sprite" | "overlay";
  autoplay?: {
    timePerFrame: number;
  };
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

type Stepper = {
  perFrame: number;
  frameSounds: { frame: number; sound: string }[];
  sneaking: boolean;
  producesSound: boolean;
  accum: number;
};

/**
 * Represents an in-game sound that NPCs can hear.
 * Does not necessarily correspond to audio played through the speakers.
 */
type Sound = {
  scariness: "not-scary" | "slightly-scary" | "terrifying";
  // The audio clip to play (if any)
  audio: string | undefined;
  age: number;
  // How many tiles this sound can travel
  volume: number;
};

type Throwable = {
  state:
    | { t: "resting" }
    | { t: "picked-up" }
    | { t: "airborne"; target: Vec2 };
};

/**
 * Has a hand that can pick up throwables
 */
type Hand = {
  holding: EntityId | undefined;
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
  stepper: Map<EntityId, Stepper>;
  collectable: Map<EntityId, Collectable>;
  particle: Map<EntityId, Particle>;
  sound: Map<EntityId, Sound>;
  throwable: Map<EntityId, Throwable>;
  hand: Map<EntityId, Hand>;
};
