import { GameState } from "~state/state";
import { Rect } from "~base/rect";
import { SpriteProgram } from "~rendering/shaders/sprite/sprite";
import { Coords } from "~base/coords";
import { Vec2 } from "~base/vec2";

export function renderGrass(state: GameState) {
  const screenWorldSize = Vec2.divScalar(state.virtualScreenSize, 16);
  const screenExtent = Rect.fromCenter(state.cameraPosition, screenWorldSize);
  let sprites: SpriteProgram.SpriteInstance[] = [];
  for (let x = Math.floor(screenExtent.x); x < screenExtent.x2; x++) {
    for (let y = Math.floor(screenExtent.y); y < screenExtent.y2; y++) {
      let pos = { x, y };

      pos = Vec2.quantize(
        Coords.worldToVirtualScreen(
          { x, y },
          state.cameraPosition,
          state.virtualScreenSize
        ),
        1
      );

      // Pick a number between 1 and 10 for this tile
      const pseudoRand = Math.floor(
        (state.randomSource[Math.abs(x % 32) + Math.abs((y % 32) * 32)] / 255) *
          60
      );

      let variant = 3;
      if (pseudoRand < 3) {
        variant = pseudoRand;
      }
      sprites.push({
        position: pos,
        tile: { x: 9, y: variant },
        size: { x: 1, y: 1 },
        zOrder: 1,
      });
    }
  }

  SpriteProgram.render(
    state.renderState.spriteProgram,
    state.virtualScreenSize,
    sprites
  );
}
