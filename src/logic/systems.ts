import { GameState } from "~state/state";
import { renderGrass } from "./systems/render_grass";
import {
  prepareScreen,
  renderScreen,
  prepareVirtualScreen,
  prepareSceneLighting,
  prepareSceneColors,
} from "~rendering/rendering";
import { renderSprites } from "./systems/render_sprites";
import { handleInput } from "./systems/inputs";
import { moveCamera } from "./systems/move_camera";
import { SceneProgram } from "~rendering/shaders/scene/scene";
import { drawTorches } from "./systems/draw_torches";
import { calculateVisibility } from "./systems/calculate_visibility";
import { runAi } from "./systems/human_ai";

export function runAllSystems(state: GameState, dt: number) {
  calculateVisibility(state);
  handleInput(state, dt);
  moveCamera(state, dt);

  runAi(state, dt);

  prepareSceneColors(state.renderState);
  renderGrass(state);
  renderSprites(state, dt);

  prepareSceneLighting(state.renderState);
  drawTorches(state);

  prepareVirtualScreen(state.renderState);
  SceneProgram.render(state.renderState.sceneProgram);

  prepareScreen(state.renderState);
  renderScreen(state.renderState);
}
