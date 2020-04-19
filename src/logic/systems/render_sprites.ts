import { GameState } from "~state/state";
import { SpriteProgram } from "~rendering/shaders/sprite/sprite";
import { Coords } from "~base/coords";
import { Vec2 } from "~base/vec2";

export function renderSprites(state: GameState, dt: number) {
  let spritesToRender: SpriteProgram.SpriteInstance[] = [];

  for (const [id, sprite] of state.components.sprite.entries()) {
    let pos, zOrder;
    let tilePos = state.components.position.get(id);
    const lifetime = state.components.lifetime.get(id);
    if (tilePos != null) {
      // Ensure bottom tile is shown at the sprite's location
      pos = Coords.worldToVirtualScreen(
        {
          x: tilePos.x,
          y: tilePos.y - (sprite.sprite.size.y - 1),
        },
        state.cameraPosition,
        state.virtualScreenSize
      );
      zOrder = tilePos.y;
    } else {
      // No position, maybe it has a screenpos?
      let screenPos = state.components.screenPosition.get(id);
      if (screenPos == null) {
        // Nope, how can we know where to render it then?!
        return;
      }
      pos = screenPos;

      // The wurst
      zOrder = 999;
    }

    const anim = sprite.sprite.sequences.get(sprite.currentAnimation);
    if (anim == null) {
      throw new Error(
        `Animation '${sprite.currentAnimation}' not defined for sprite`
      );
    }

    // Wrap around frame number
    let frame = Math.floor(sprite.frame) % anim.tile.length;
    if (sprite.autoplay) {
      sprite.frame += dt * 6;
    }

    const alpha =
      lifetime != null
        ? Math.round((lifetime.current / lifetime.max) * 4) / 4
        : 1;

    spritesToRender.push({
      position: Vec2.quantize(pos, 1),
      tile: anim.tile[frame],
      size: sprite.sprite.size,
      alpha,
      zOrder,
    });
  }

  SpriteProgram.render(
    state.renderState.spriteProgram,
    state.virtualScreenSize,
    spritesToRender
  );
}
