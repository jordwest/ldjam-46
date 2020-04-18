import { GameState } from "~state/state";
import { SpriteProgram } from "~rendering/shaders/sprite/sprite";
import { Coords } from "~base/coords";
import { Vec2 } from "~base/vec2";

export function renderSprites(state: GameState) {
  let sprites: SpriteProgram.SpriteInstance[] = [];
  for (const [id, sprite] of state.components.sprite.entries()) {
    let pos = state.components.position.get(id);
    if (pos == null) {
      // No position, we can't render it
      return;
    }

    pos = Coords.worldToVirtualScreen(
      pos,
      state.cameraPosition,
      state.virtualScreenSize
    );

    const anim = sprite.sprite.sequences.get(sprite.currentAnimation);
    if (anim == null) {
      throw new Error(
        `Animation '${sprite.currentAnimation}' not defined for sprite`
      );
    }

    // Wrap around frame number
    let frame = sprite.frame % anim.tile.length;

    sprites.push({
      position: pos,
      tile: anim.tile[frame],
      size: sprite.sprite.size,
    });
  }

  SpriteProgram.render(
    state.renderState.spriteProgram,
    state.virtualScreenSize,
    sprites
  );
}
