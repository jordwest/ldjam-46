import { GameState } from "~state/state";
import { expect } from "~base/expect";
import { Audio } from "~audio/audio";

export function advanceStepper(state: GameState) {
  for (const [entityId, stepper] of state.components.stepper.entries()) {
    const sprite = expect(state.components.sprite.get(entityId));
    if (stepper.accum > stepper.perFrame) {
      stepper.accum -= stepper.perFrame;
      const anim = expect(sprite.sprite.sequences.get(sprite.currentAnimation));
      const frame = (sprite.frame + 1) % anim.tile.length;
      sprite.frame = frame;

      const frameSound = stepper.frameSounds.find((v) => v.frame === frame);
      if (frameSound != null) {
        Audio.playSound(state.audioState, frameSound.sound);
      }
    }
  }
}
