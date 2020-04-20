import { GameState } from "~state/state";
import { expect } from "~base/expect";
import { Vec2 } from "~base/vec2";
import { Coords } from "~base/coords";
import { Debug } from "~base/debug";

export function moveCamera(state: GameState, dt: number) {
  const cursorPos = Coords.virtualScreenToWorld(
    state.inputs.cursor,
    state.cameraPosition,
    state.virtualScreenSize
  );
  const playerPos = expect(
    state.components.position.get(state.entities.player)
  );
  const vecToCursor = Vec2.subtract(playerPos, cursorPos);
  Debug.record("vecToCursor", vecToCursor);

  state.cameraPosition = Vec2.add(
    playerPos,
    Vec2.multScalar(vecToCursor, -0.1)
  );
}
