import { GameState } from "~state/state";
import { LightingProgram } from "~rendering/shaders/lighting/lighting";
import { Coords } from "~base/coords";
import { Vec2 } from "~base/vec2";

export function drawTorches(state: GameState) {
  let torches: LightingProgram.LightInstance[] = [];

  for (const id of state.components.torchOn.keys()) {
    const pos = state.components.position.get(id);
    if (pos == null) {
      continue;
    }

    torches.push({
      pos: Vec2.quantize(
        Coords.worldToVirtualScreen(
          pos,
          state.cameraPosition,
          state.virtualScreenSize
        ),
        1
      ),
      angle: 0,
    });
  }

  LightingProgram.render(
    state.renderState.lightingProgram,
    state.virtualScreenSize,
    torches
  );
}
