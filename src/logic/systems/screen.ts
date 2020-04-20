import { GameState } from "~state/state";
import { ScreenProgram } from "~rendering/shaders/screen/screen";
import { SpriteProgram } from "~/rendering/shaders/sprite/sprite";

function renderInstructionsScreen(state: GameState) {
  SpriteProgram.renderScreen(
    state.renderState.spriteProgram,
    state.renderState.instructionsScreen,
    1
  );
}

const TRANSITION_TIME = 2;
export function drawCurrentScreen(state: GameState, dt: number) {
  if (state.screen.t === "transition") {
    state.screen.time += dt;
    const transitionProgress = state.screen.time / TRANSITION_TIME;
    if (transitionProgress < 0.5) {
      renderInstructionsScreen(state);
    }
    if (transitionProgress >= 1) {
      state.screen = { t: "game" };
    }
  }
  if (state.screen.t === "instructions") {
    renderInstructionsScreen(state);
  }
}

export function renderScreen(state: GameState) {
  let alpha = 1.0;
  if (state.screen.t === "transition") {
    const transitionProgress = state.screen.time / TRANSITION_TIME;

    alpha = Math.abs(transitionProgress - 0.5) * 2;

    // quantize alpha
    alpha = Math.round(alpha * 5) / 5;
  }

  ScreenProgram.render(
    state.renderState.screenProgram,
    state.renderState.virtualScreen.attachments[0],
    alpha
  );
}
