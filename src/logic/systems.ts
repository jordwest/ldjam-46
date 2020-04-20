import { GameState } from "~state/state";
import { renderGrass } from "./systems/render_grass";
import {
  prepareScreen,
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
import { updateLifetimes } from "./systems/lifetime";
import { updateParticles } from "./systems/particles";
import { collectCollectables } from "./systems/collectables";
import { advanceStepper } from "./systems/stepper";
import { drawAndUpdateSounds } from "./systems/sound";
import { updateThrowables } from "./systems/throwable";
import { updateCursor } from "./systems/cursor";
import { drawUi } from "./systems/draw_ui";
import { consumeFear } from "./systems/consumption";
import { drawCurrentScreen, renderScreen } from "./systems/screen";
import { checkWinState } from "./systems/win_state";

export function runAllSystems(state: GameState, dt: number) {
  state.t += dt;

  checkWinState(state);

  calculateVisibility(state);

  updateLifetimes(state, dt);
  updateParticles(state, dt);
  updateThrowables(state, dt);
  consumeFear(state, dt);
  updateCursor(state);
  collectCollectables(state, dt);

  handleInput(state, dt);

  advanceStepper(state);

  moveCamera(state, dt);

  runAi(state, dt);

  prepareSceneColors(state.renderState);
  renderGrass(state);
  renderSprites(state, dt, (sprite) => sprite.layer === "sprite");

  prepareSceneLighting(state.renderState);
  drawTorches(state);

  prepareVirtualScreen(state.renderState);
  SceneProgram.render(state.renderState.sceneProgram);
  drawAndUpdateSounds(state, dt);
  drawUi(state);
  renderSprites(state, dt, (sprite) => sprite.layer === "overlay");

  drawCurrentScreen(state, dt);

  renderSprites(state, dt, (sprite) => sprite.layer === "cursor");

  prepareScreen(state.renderState);
  renderScreen(state);

  // Sorry, you only get one chance to process an input event
  state.inputs.event = undefined;
}
