import * as twgl from "twgl.js";
import { SpriteProgram } from "./shaders/sprite/sprite";
import spritesheetSrc from "../assets/spritesheet.png";
import { VIRTUAL_SCREEN_SIZE } from "~config";

export type RenderState = {
  gl: WebGLRenderingContext;
  canvas: HTMLCanvasElement;

  spriteProgram: SpriteProgram.State;
};

const SPRITESHEET: SpriteProgram.SpritesheetInfo = {
  src: spritesheetSrc,
  width: 256,
  height: 256,
  tileWidth: 16,
  tileHeight: 16,
};

export function setup(canvas: HTMLCanvasElement): RenderState {
  const gl = canvas.getContext("webgl");
  if (!gl) {
    alert("Sorry, I couldn't get WebGL running in your browser");
    throw new Error("WebGL is null");
  }

  const spriteProgram = SpriteProgram.setup(gl, SPRITESHEET);

  return {
    gl,
    canvas,
    spriteProgram,
  };
}

function clear(renderState: RenderState) {
  const { gl } = renderState;

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

export function prepareScreen(renderState: RenderState) {
  twgl.bindFramebufferInfo(renderState.gl, null);
  clear(renderState);
}
