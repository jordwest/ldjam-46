import { Vec2 } from "~base/vec2";
import { Sprites } from "~config";
import { GameState } from "~state/state";
import { Entity } from "~logic/entity";

export function createHuman(state: GameState, pos: Vec2, angle: number) {
  const id = Entity.mintId(state.entities);

  state.components.position.set(id, pos);
  state.components.sprite.set(id, {
    sprite: Sprites.human,
    currentAnimation: "sitting-right",
    layer: "sprite",
    frame: 0,
  });
  state.components.stepper.set(id, {
    accum: 0,
    perFrame: 0.4,
    sneaking: false,
    frameSounds: [{ frame: 1, sound: "footstep" }],
    producesSound: false,
  });
  state.components.agility.set(id, {
    sneakSpeed: 0.8,
    walkSpeed: 2.0,
    runSpeed: 5.0,
  });
  state.components.angle.set(id, angle);
  state.components.brain.set(id, {
    state: { t: "sitting" },
    accumulatedFear: 0,
    home: { ...pos },
    sawPlayerAt: undefined,
    currentActionTime: 0,
    targetAngle: angle,
    queuedActions: [],
    fear: 0,
  });
}
