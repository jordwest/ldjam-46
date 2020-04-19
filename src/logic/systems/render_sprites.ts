import { GameState } from "~state/state";
import { SpriteProgram } from "~rendering/shaders/sprite/sprite";
import { Coords } from "~base/coords";
import { Vec2 } from "~base/vec2";

export function renderSprites(state: GameState) {
  let spritesToRender: SpriteProgram.SpriteInstance[] = [];

  for (const [id, sprite] of state.components.sprite.entries()) {
    let tilePos = state.components.position.get(id);
    if (tilePos == null) {
      // No position, we can't render it
      return;
    }

    // Ensure bottom tile is shown at the sprite's location
    let pos = {
      x: tilePos.x,
      y: tilePos.y - (sprite.sprite.size.y - 1),
    };

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

    spritesToRender.push({
      position: Vec2.quantize(pos, 1),
      tile: anim.tile[frame],
      size: sprite.sprite.size,
      zOrder: tilePos.y,
    });
  }

  SpriteProgram.render(
    state.renderState.spriteProgram,
    state.virtualScreenSize,
    spritesToRender
  );
}
