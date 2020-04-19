import { Vec2 } from "~base/vec2";
import { Sprites } from "~config";
import { GameState } from "~state/state";
import { Entity } from "~logic/entity";

export function createHuman(state: GameState, pos: Vec2) {
  const id = Entity.mintId(state.entities);

  state.components.position.set(id, pos);
  state.components.sprite.set(id, {
    sprite: Sprites.human,
    currentAnimation: "sitting",
    frame: 0,
  });
  state.components.agility.set(id, {
    sneakSpeed: 0.8,
    walkSpeed: 2.0,
    runSpeed: 3.2,
  });
  state.components.angle.set(id, 1.18);
  state.components.brain.set(id, {
    state: { t: "sitting" },
    sawPlayerAt: undefined,
    targetAngle: 0,
    fear: 0,
  });
}
