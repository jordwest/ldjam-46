import { GameState } from "~state/state";
import { expect } from "~base/expect";
import { createFootstep } from "~/logic/entities/sounds";
import { Audio } from "~audio/audio";
import { Vec2 } from "~base/vec2";

export function advanceStepper(state: GameState) {
  for (const [entityId, stepper] of state.components.stepper.entries()) {
    const sprite = expect(state.components.sprite.get(entityId));
    if (stepper.accum > stepper.perFrame) {
      stepper.accum -= stepper.perFrame;
      const anim = expect(sprite.sprite.sequences.get(sprite.currentAnimation));
      const frame = (sprite.frame + 1) % anim.tile.length;
      sprite.frame = frame;

      const frameSound = stepper.frameSounds.find((v) => v.frame === frame);
      if (frameSound != null && !stepper.sneaking) {
        const pos = expect(state.components.position.get(entityId));
        if (stepper.producesSound) {
          createFootstep(state, pos);
        } else {
          const distanceFromCamera = Vec2.distance(state.cameraPosition, pos);
          if (distanceFromCamera < 10) {
            const vol = 1 - distanceFromCamera / 10;
            Audio.playSound(state.audioState, frameSound.sound, vol);
          }
        }
      }
    }
  }
}
