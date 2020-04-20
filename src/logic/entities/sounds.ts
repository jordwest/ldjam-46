import { GameState } from "~state/state";
import { Vec2 } from "~base/vec2";
import { Entity } from "~logic/entity";

export function createStoneLanding(state: GameState, pos: Vec2) {
  const id = Entity.mintId(state.entities);
  state.components.position.set(id, { x: pos.x, y: pos.y });
  state.components.sound.set(id, {
    scariness: "slightly-scary",
    audio: "stone",
    age: 0,
    volume: 6,
  });
}

export function createFootstep(state: GameState, pos: Vec2) {
  const id = Entity.mintId(state.entities);
  state.components.position.set(id, { x: pos.x, y: pos.y + 0.25 });
  state.components.sound.set(id, {
    scariness: "slightly-scary",
    audio: "footstep",
    age: 0,
    volume: 3,
  });
}

export function createShriek(state: GameState, pos: Vec2) {
  const id = Entity.mintId(state.entities);
  state.components.position.set(id, { x: pos.x, y: pos.y - 1.25 });
  state.components.sound.set(id, {
    scariness: "terrifying",
    audio: "shriek",
    age: 0,
    volume: 20,
  });
}
