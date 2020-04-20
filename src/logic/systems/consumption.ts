import { GameState } from "~state/state";
import { expect } from "~base/expect";
import { Debug } from "~base/debug";
import { Audio } from "~audio/audio";

export function consumeFear(state: GameState, dt: number) {
  if (state.screen.t !== "game") {
    return;
  }

  state.stats.fearBar -= 0.003 * dt;
  if (state.stats.fearBar <= 0) {
    const sprite = expect(state.components.sprite.get(state.entities.player));
    Debug.record("currentAnimation", sprite.currentAnimation);
    sprite.currentAnimation = "dead";
    if (state.stats.dead != true) {
      Audio.playSound(state.audioState, "die");
    }
    state.stats.dead = true;
  }
}
