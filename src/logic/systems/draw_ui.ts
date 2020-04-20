import { GameState } from "~state/state";
import { SpriteProgram } from "~rendering/shaders/sprite/sprite";

export function drawUi(state: GameState) {
  const { virtualScreenSize } = state;

  const sprites: SpriteProgram.SpriteInstance[] = [
    // Fear bar top
    {
      position: { x: virtualScreenSize.x - 32, y: 0 },
      tile: { x: 10, y: 7 },
      size: { x: 2, y: 2 },
      zOrder: 1,
    },
    {
      position: { x: virtualScreenSize.x - 16, y: 32 },
      tile: { x: 11, y: 9 },
      size: { x: 1, y: 6 },
      zOrder: 1,
    },
    {
      position: { x: virtualScreenSize.x - 16, y: 0 },
      tile: { x: 10, y: 9 },
      size: { x: 1, y: 7 },
      zOrder: 1,
      verticalProgress: state.stats.fearBar,
    },
  ];

  if (state.stats.dead) {
    sprites.push({
      tile: { x: 6, y: 14 },
      size: { x: 4, y: 2 },
      position: {
        x: virtualScreenSize.x / 2 - 32,
        y: virtualScreenSize.y / 2 - 16,
      },
      zOrder: 5,
    });
  }

  SpriteProgram.render(
    state.renderState.spriteProgram,
    state.virtualScreenSize,
    sprites
  );
}
