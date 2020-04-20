import * as Rendering from "~rendering/rendering";
import { init } from "~logic/init";
import { runAllSystems } from "~logic/systems";
import { VIRTUAL_SCREEN_SIZE } from "~config";
import { Debug } from "~base/debug";

function start() {
  const canvas = document.querySelector("canvas#game") as HTMLCanvasElement;
  const renderState = Rendering.setup(canvas, VIRTUAL_SCREEN_SIZE);
  const gameState = init(renderState);

  document.addEventListener("keydown", (e) => {
    let handled = true;
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
      case "Shift":
        gameState.inputs.sneak = true;
        break;
      default:
        console.log("unhandled key", e.key);
        handled = false;
    }
    if (handled) {
      e.preventDefault();
    }
  });
  document.addEventListener("keyup", (e) => {
    let handled = true;
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
      case "Shift":
        gameState.inputs.sneak = false;
        break;
      default:
        handled = false;
    }
    if (handled) {
      e.preventDefault();
    }
  });

  const canvasToVirtualScreen = (e: { offsetX: number; offsetY: number }) => ({
    x: e.offsetX * (gameState.virtualScreenSize.x / canvas.width),
    y: e.offsetY * (gameState.virtualScreenSize.y / canvas.height),
  });

  canvas.addEventListener("mousedown", (e) => {
    gameState.inputs.event = {
      t: "click",
      pos: canvasToVirtualScreen(e),
    };
  });
  canvas.addEventListener("mousemove", (e) => {
    gameState.inputs.cursor = canvasToVirtualScreen(e);
  });

  let lastTime: number | undefined;

  function frame(time: number) {
    if (lastTime != null) {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Only run everything for normal timesteps
      if (dt < 1) {
        Debug.measure("runAllSystems", () => {
          runAllSystems(gameState, dt);
        });
        Debug.measure("glFinish", () => {
          gameState.renderState.gl.finish();
        });
      }
    } else {
      lastTime = time;
    }

    //Debug.update();

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

start();
