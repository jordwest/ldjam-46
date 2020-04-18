import { GameState } from "~state/state";
import { expect } from "~base/expect";
import { Vec2 } from "~base/vec2";

export function moveCamera(state: GameState, dt: number) {
  const cameraTarget = Vec2.add(
    expect(state.components.position.get(state.entities.player)),
    { x: 0, y: 1 }
  );
  const cameraError = Vec2.subtract(cameraTarget, state.cameraPosition);
  const dPos = Vec2.multScalar(cameraError, 1.8 * dt);

  state.cameraPosition = Vec2.add(state.cameraPosition, dPos);
}
