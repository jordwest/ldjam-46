import { GameState } from "~state/state";

export function checkWinState(state: GameState) {
  if (state.screen.t === "game" && state.stats.fearBar >= 1) {
    // Win!

    state.screen = {
      t: "transition",
      fromScreen: undefined,
      toScreen: state.renderState.completeScreen,
      time: 0,
    };
  }
}
