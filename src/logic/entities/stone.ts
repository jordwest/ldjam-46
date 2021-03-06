import { GameState } from "~state/state";
import { Entity } from "~logic/entity";
import { Vec2 } from "~base/vec2";
import { Sprites } from "~config";

export function createStone(state: GameState, pos: Vec2) {
  const id = Entity.mintId(state.entities);

  state.components.throwable.set(id, {
    state: { t: "resting" },
  });
  state.components.position.set(id, { ...pos });
  state.components.sprite.set(id, {
    currentAnimation: "default",
    frame: 0,
    sprite: Sprites.stone,
    layer: "sprite",
  });
}

