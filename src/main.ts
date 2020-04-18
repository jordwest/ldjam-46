import * as Rendering from "~rendering/rendering";

function start() {
  const canvas = document.querySelector("canvas#game") as HTMLCanvasElement;
  const renderState = Rendering.setup(canvas);

  function frame(_time: number) {
    Rendering.render(renderState);
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

start();
