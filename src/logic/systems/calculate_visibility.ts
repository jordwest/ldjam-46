import { GameState } from "~state/state";
import { Coords } from "~base/coords";
import { expect } from "~base/expect";
import { withFramebuffer } from "~rendering/rendering";
import { Debug } from "~base/debug";
import { Vec2 } from "~base/vec2";
import { SpriteProgram } from "~rendering/shaders/sprite/sprite";

export function calculateVisibility(state: GameState) {
  let data = new Uint8Array(16 * 16 * 4);
  withFramebuffer(
    state.renderState,
    state.renderState.sceneProgram.sceneLighting,
    () => {
      const { gl } = state.renderState;
      const playerPos = expect(
        state.components.position.get(state.entities.player)
      );
      const pos = Coords.worldToVirtualScreen(
        playerPos,
        state.cameraPosition,
        state.virtualScreenSize
      );
      gl.readPixels(
        pos.x,
        state.virtualScreenSize.y - pos.y - 16,
        16,
        16,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        data
      );
      Debug.record("player pos", playerPos);
      Debug.record("vis pos", pos);

      const minVisibility = 256 * 128;
      const maxVisibility = 256 * 255;
      // Sample each pixel's red value
      let visibility = 0;
      for (let i = 0; i < 256; i++) {
        visibility += data[i * 4];
      }

      visibility =
        (visibility - minVisibility) / (maxVisibility - minVisibility);
      Debug.record("visibility", visibility);
    }
  );
}
