import { GameState } from "~state/state";
import { expect } from "~base/expect";
import { Vec2 } from "~base/vec2";
import { Coords } from "~base/coords";
import { createStoneLanding } from "~logic/entities/sounds";

export function updateThrowables(state: GameState, dt: number) {
  const cursorWorldPos = Coords.virtualScreenToWorld(
    state.inputs.cursor,
    state.cameraPosition,
    state.virtualScreenSize
  );
  const playerHand = expect(state.components.hand.get(state.entities.player));

  for (const [throwableId, throwable] of state.components.throwable.entries()) {
    if (throwable.state.t === "airborne") {
      const pos = expect(state.components.position.get(throwableId));
      const distanceRemaining = Vec2.distance(pos, throwable.state.target);

      if (distanceRemaining < 0.3) {
        // Landed
        createStoneLanding(state, pos);
        throwable.state = { t: "resting" };
      } else {
        state.components.position.set(
          throwableId,
          Vec2.add(
            pos,
            Vec2.multScalar(
              Vec2.unitVector(Vec2.subtract(throwable.state.target, pos)),
              distanceRemaining * 6.0 * dt
            )
          )
        );
      }
    } else if (throwable.state.t === "resting") {
      const pos = expect(state.components.position.get(throwableId));
      const playerPos = expect(
        state.components.position.get(state.entities.player)
      );
      const hand = expect(state.components.hand.get(state.entities.player));
      if (hand.holding == null && state.inputs.event?.t === "click") {
        if (throwable.state.t === "resting") {
          const distToCursor = Vec2.distance(
            cursorWorldPos,
            Vec2.add(pos, { x: 0.5, y: 0.5 })
          );
          const distToPlayer = Vec2.distance(
            playerPos,
            Vec2.add(pos, { x: 0.5, y: 0.5 })
          );
          if (distToCursor < 0.8 && distToPlayer < 2.5) {
            throwable.state = { t: "picked-up" };
            state.components.position.delete(throwableId);
            state.components.hand.set(state.entities.player, {
              holding: throwableId,
            });
          }
        }
      }
    } else if (
      throwable.state.t === "picked-up" &&
      playerHand.holding === throwableId &&
      state.inputs.event?.t === "click"
    ) {
      const target = Coords.virtualScreenToWorld(
        state.inputs.event.pos,
        state.cameraPosition,
        state.virtualScreenSize
      );
      const playerPos = expect(
        state.components.position.get(state.entities.player)
      );
      throwable.state = { t: "airborne", target };
      state.components.position.set(throwableId, playerPos);
      state.components.hand.set(state.entities.player, { holding: undefined });
    }
  }
}

/*
 */
