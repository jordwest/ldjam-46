import { GameState } from "~state/state";
import { expect } from "~base/expect";
import { Vec2 } from "~base/vec2";

export function handleInput(state: GameState, dt: number) {
  // Update cursor positions
  state.components.screenPosition.set(
    state.entities.cursor,
    state.inputs.cursor
  );

  if (state.stats.dead) {
    // Player is dead, they can't do anything!
    return;
  }

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
    const speed = state.inputs.sneak ? agility.sneakSpeed : agility.walkSpeed;
    const movement = speed * dt;
    const dPos = Vec2.multScalar(Vec2.unitVector(direction), movement);

    const stepper = expect(state.components.stepper.get(playerId));
    stepper.accum += movement;
    stepper.sneaking = state.inputs.sneak;

    state.components.position.set(playerId, Vec2.add(pos, dPos));
  } else {
    const sprite = expect(state.components.sprite.get(playerId));
    sprite.frame = 0;
  }
}
