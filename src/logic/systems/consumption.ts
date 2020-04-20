import { GameState } from "~state/state";
import { expect } from "~base/expect";
import { Debug } from "~base/debug";

export function consumeFear(state: GameState, dt: number) {
  state.stats.fearBar -= 0.01 * dt;
  if (state.stats.fearBar <= 0) {
    const sprite = expect(state.components.sprite.get(state.entities.player));
    Debug.record("currentAnimation", sprite.currentAnimation);
    sprite.currentAnimation = "dead";
    state.stats.dead = true;
  }
}
