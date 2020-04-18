import { GameState } from "~state/state";
import { renderGrass } from "./systems/render_grass";
import { prepareScreen } from "~rendering/rendering";
import { renderSprites } from "./systems/render_sprites";

export function runAllSystems(state: GameState) {
  prepareScreen(state.renderState);
  renderGrass(state);
  renderSprites(state);
}
