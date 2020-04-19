import { Vec2 } from "~base/vec2";
import { Entity } from "~logic/entity";
import { GameState } from "~state/state";
import { Sprites } from "~config";

export function createFire(state: GameState, pos: Vec2) {
  const id = Entity.mintId(state.entities);
  state.components.lightSource.set(id, "fire");
  state.components.position.set(id, pos);
  state.components.sprite.set(id, {
    currentAnimation: "default",
    frame: 0,
    layer: "sprite",
    sprite: Sprites.fire,
    autoplay: {
      timePerFrame: 0.2,
    },
  });
}
