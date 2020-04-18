import { GameState } from "~state/state";
import { renderGrass } from "./systems/render_grass";
import {
  prepareScreen,
  renderScreen,
  prepareVirtualScreen,
} from "~rendering/rendering";
import { renderSprites } from "./systems/render_sprites";
import { handleInput } from "./systems/inputs";
import { moveCamera } from "./systems/move_camera";

export function runAllSystems(state: GameState, dt: number) {
  handleInput(state, dt);
  moveCamera(state, dt);

  prepareVirtualScreen(state.renderState);
  renderGrass(state);
  renderSprites(state);
  prepareScreen(state.renderState);
  renderScreen(state.renderState);
}
