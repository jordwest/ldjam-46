import { GameState } from "~state/state";
import { expect } from "~base/expect";
import { Vec2 } from "~base/vec2";

export function handleInput(state: GameState, dt: number) {
  const playerId = state.entities.player;
  const pos = expect(state.components.position.get(playerId));
  const agility = expect(state.components.agility.get(playerId));

  const direction = { x: 0, y: 0 };
  if (state.inputs.moveUp) {
    direction.y -= 1;
  }
  if (state.inputs.moveDown) {
    direction.y += 1;
  }
  if (state.inputs.moveLeft) {
    direction.x -= 1;
  }
  if (state.inputs.moveRight) {
    direction.x += 1;
  }

  if (Vec2.len(direction) > 0) {
    const dPos = Vec2.multScalar(
      Vec2.unitVector(direction),
      agility.walkSpeed * dt
    );
    state.components.position.set(playerId, Vec2.add(pos, dPos));
  }
}
