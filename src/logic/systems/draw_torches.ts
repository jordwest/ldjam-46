import { GameState } from "~state/state";
import { LightingProgram } from "~rendering/shaders/lighting/lighting";
import { Coords } from "~base/coords";
import { Vec2 } from "~base/vec2";

export function drawTorches(state: GameState) {
  let torches: LightingProgram.LightInstance[] = [];

  for (const [id, lightType] of state.components.lightSource.entries()) {
    let pos = state.components.position.get(id);
    if (pos == null) {
      continue;
    }
    const angle = state.components.angle.get(id) || 0;
    pos = {
      x: pos.x + 0.5,
      y: pos.y + 0.5,
    };
    pos = Coords.worldToVirtualScreen(
      pos,
      state.cameraPosition,
      state.virtualScreenSize
    );

    torches.push({
      pos: Vec2.quantize(pos, 1),
      angle,
      lightType,
    });
  }

  LightingProgram.render(
    state.renderState.lightingProgram,
    state.virtualScreenSize,
    torches
  );
}
