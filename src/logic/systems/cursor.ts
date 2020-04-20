import { GameState } from "~state/state";
import { expect } from "~base/expect";
import { Coords } from "~base/coords";
import { Vec2 } from "~base/vec2";

export function updateCursor(state: GameState) {
  const sprite = expect(state.components.sprite.get(state.entities.cursor));

  const cursorWorldPos = Coords.virtualScreenToWorld(
    state.inputs.cursor,
    state.cameraPosition,
    state.virtualScreenSize
  );

  let cursor = "default";
  let hand = expect(state.components.hand.get(state.entities.player));

  if (hand.holding != null) {
    cursor = "throw";
  } else {
    for (const [id, throwable] of state.components.throwable.entries()) {
      const throwablePos = state.components.position.get(id);
      if (throwable.state.t === "resting" && throwablePos) {
        const distToCursor = Vec2.distance(
          cursorWorldPos,
          Vec2.add(throwablePos, { x: 0.5, y: 0.5 })
        );
        if (distToCursor < 0.8) {
          cursor = "pick-up";
        }
      }
    }
  }

  sprite.currentAnimation = cursor;
}

