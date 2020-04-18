import * as Rendering from "~rendering/rendering";
import { init } from "~logic/init";
import { runAllSystems } from "~logic/systems";
import { VIRTUAL_SCREEN_SIZE } from "~config";

function start() {
  const canvas = document.querySelector("canvas#game") as HTMLCanvasElement;
  const renderState = Rendering.setup(canvas, VIRTUAL_SCREEN_SIZE);
  const gameState = init(renderState);

  document.addEventListener("keydown", (e) => {
    e.preventDefault();

    switch (e.key) {
      case "w":
      case "W":
      case "ArrowUp":
        gameState.inputs.moveUp = true;
        break;
      case "s":
      case "S":
      case "ArrowDown":
        gameState.inputs.moveDown = true;
        break;
      case "a":
      case "A":
      case "ArrowLeft":
        gameState.inputs.moveLeft = true;
        break;
      case "d":
      case "D":
      case "ArrowRight":
        gameState.inputs.moveRight = true;
        break;
      default:
        console.log("unhandled key", e.key);
    }
  });
  document.addEventListener("keyup", (e) => {
    e.preventDefault();

    switch (e.key) {
      case "w":
      case "W":
      case "ArrowUp":
        gameState.inputs.moveUp = false;
        break;
      case "s":
      case "S":
      case "ArrowDown":
        gameState.inputs.moveDown = false;
        break;
      case "a":
      case "A":
      case "ArrowLeft":
        gameState.inputs.moveLeft = false;
        break;
      case "d":
      case "D":
      case "ArrowRight":
        gameState.inputs.moveRight = false;
        break;
    }
  });

  let lastTime: number | undefined;

  function frame(time: number) {
    if (lastTime != null) {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Only run everything for normal timesteps
      if (dt < 1000) {
        runAllSystems(gameState, dt);
      }
    } else {
      lastTime = time;
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

start();
