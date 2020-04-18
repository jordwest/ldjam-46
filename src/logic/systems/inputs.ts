import { GameState } from "~state/state";
import { expect } from "~base/expect";

export function handleInput(state: GameState, dt: number) {
  const playerId = state.entities.player;
  const pos = expect(state.components.position.get(playerId));
  const agility = expect(state.components.agility.get(playerId));
  if (state.inputs.moveUp) {
    pos.y -= agility.walkSpeed * dt;
  }
  if (state.inputs.moveDown) {
    pos.y += agility.walkSpeed * dt;
  }
  if (state.inputs.moveLeft) {
    pos.x -= agility.walkSpeed * dt;
  }
  if (state.inputs.moveRight) {
    pos.x += agility.walkSpeed * dt;
  }
}
