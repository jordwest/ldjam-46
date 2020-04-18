import * as Rendering from "~rendering/rendering";
import { init } from "~logic/init";
import { runAllSystems } from "~logic/systems";

function start() {
  const canvas = document.querySelector("canvas#game") as HTMLCanvasElement;
  const renderState = Rendering.setup(canvas);
  const gameState = init(renderState);

  function frame(_time: number) {
    runAllSystems(gameState);

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

start();
