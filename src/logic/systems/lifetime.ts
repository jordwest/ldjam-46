import { GameState } from "~state/state";
import { Entity } from "~logic/entity";

export function updateLifetimes(state: GameState, dt: number) {
  for (const [entityId, lifetime] of state.components.lifetime.entries()) {
    const remain = lifetime.current - dt;
    if (remain < 0) {
      Entity.remove(state, entityId);
    } else {
      lifetime.current = remain;
    }
  }
}
