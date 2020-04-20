import { GameState } from "~state/state";
import { ScreenProgram } from "~rendering/shaders/screen/screen";
import { SpriteProgram } from "~/rendering/shaders/sprite/sprite";

function renderImageScreen(state: GameState, image: WebGLTexture) {
  SpriteProgram.renderScreen(state.renderState.spriteProgram, image, 1);
}

const TRANSITION_TIME = 1.5;
export function drawCurrentScreen(state: GameState, dt: number) {
  if (state.screen.t === "transition") {
    state.screen.time += dt;
    const transitionProgress = state.screen.time / TRANSITION_TIME;
    if (transitionProgress < 0.5 && state.screen.fromScreen != null) {
      renderImageScreen(state, state.screen.fromScreen);
    }
    if (transitionProgress > 0.5 && state.screen.toScreen != null) {
      renderImageScreen(state, state.screen.toScreen);
    }

    if (transitionProgress >= 1) {
      if (state.screen.toScreen == null) {
        state.screen = { t: "game" };
      } else {
        state.screen = { t: "screen", texture: state.screen.toScreen };
      }
    }
  }
  if (state.screen.t === "screen") {
    renderImageScreen(state, state.screen.texture);
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
