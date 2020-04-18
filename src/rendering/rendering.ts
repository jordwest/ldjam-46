import * as twgl from "twgl.js";

export type RenderState = {
  gl: WebGLRenderingContext;
  canvas: HTMLCanvasElement;
};

export function setup(canvas: HTMLCanvasElement): RenderState {
  const gl = canvas.getContext("webgl");
  if (!gl) {
    alert("Sorry, I couldn't get WebGL running in your browser");
    throw new Error("WebGL is null");
  }

  return {
    gl,
    canvas,
  };
}

function clear(renderState: RenderState) {
  const { gl } = renderState;

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

export function render(renderState: RenderState) {
  clear(renderState);
}
