import { GameState } from "~state/state";
import { LightingProgram } from "~rendering/shaders/lighting/lighting";
import { Coords } from "~base/coords";
import { Vec2 } from "~base/vec2";
import { Debug } from "~base/debug";

export function drawTorches(state: GameState) {
  let torches: LightingProgram.LightInstance[] = [];

  for (const [id, lightType] of state.components.lightSource.entries()) {
    let pos = state.components.position.get(id);
    if (pos == null) {
      continue;
    }

    if (Vec2.distance(pos, state.cameraPosition) > 20) {
      // Don't bother with lights outside screen
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

    let alpha = 1;

    if (lightType === "fire") {
      // Fire light dances around a bit
      pos = Vec2.add(pos, {
        x: Math.sin(state.t * 2),
        y: Math.cos(state.t * 1),
      });
      alpha = Math.min(
        0.5 +
          (Math.abs(Math.sin(state.t * 25)) +
            Math.abs(Math.cos(state.t * 16))) /
            2,
        1.0
      );
    }

    torches.push({
      pos: Vec2.quantize(pos, 1),
      angle,
      alpha,
      lightType,
    });
  }

  LightingProgram.render(
    state.renderState.lightingProgram,
    state.virtualScreenSize,
    torches
  );
}
