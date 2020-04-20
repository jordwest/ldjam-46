import { GameState } from "~state/state";
import { Coords } from "~base/coords";
import { expect } from "~base/expect";
import { withFramebuffer } from "~rendering/rendering";

let data = new Uint8Array(16 * 16 * 4);
export function calculateVisibility(state: GameState) {
  withFramebuffer(
    state.renderState,
    state.renderState.sceneProgram.sceneLighting,
    () => {
      const { gl } = state.renderState;

      for (const entityId of state.components.visibility.keys()) {
        const entityPos = expect(state.components.position.get(entityId));
        const pos = Coords.worldToVirtualScreen(
          entityPos,
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

        const minVisibility = 256 * 128;
        const maxVisibility = 256 * 255;
        // Sample each pixel's red value
        let visibility = 0;
        for (let i = 0; i < 256; i++) {
          visibility += data[i * 4];
        }

        visibility =
          (visibility - minVisibility) / (maxVisibility - minVisibility);
        state.components.visibility.set(entityId, visibility);
      }
    }
  );
}
