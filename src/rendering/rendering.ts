import * as twgl from "twgl.js";
import { SpriteProgram } from "./shaders/sprite/sprite";
import spritesheetSrc from "../assets/spritesheet.png";
import { Vec2 } from "~base/vec2";
import { ScreenProgram } from "./shaders/screen/screen";

export type RenderState = {
  gl: WebGLRenderingContext;
  canvas: HTMLCanvasElement;

  virtualScreen: twgl.FramebufferInfo;
  spriteProgram: SpriteProgram.State;
  screenProgram: ScreenProgram.State;
};

const SPRITESHEET: SpriteProgram.SpritesheetInfo = {
  src: spritesheetSrc,
  width: 256,
  height: 256,
  tileWidth: 16,
  tileHeight: 16,
};

export function setup(
  canvas: HTMLCanvasElement,
  virtualScreenSize: Vec2
): RenderState {
  const gl = canvas.getContext("webgl");
  if (!gl) {
    alert("Sorry, I couldn't get WebGL running in your browser");
    throw new Error("WebGL is null");
  }

  const spriteProgram = SpriteProgram.setup(gl, SPRITESHEET);
  const screenProgram = ScreenProgram.setup(gl);
  const virtualScreen = twgl.createFramebufferInfo(
    gl,
    [
      {
        mag: gl.NEAREST,
      },
    ],
    virtualScreenSize.x,
    virtualScreenSize.y
  );

  return {
    gl,
    canvas,
    virtualScreen,
    spriteProgram,
    screenProgram,
  };
}

function clear(renderState: RenderState) {
  const { gl } = renderState;

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

export function prepareVirtualScreen(renderState: RenderState) {
  twgl.bindFramebufferInfo(renderState.gl, renderState.virtualScreen);
  clear(renderState);
}

export function prepareScreen(renderState: RenderState) {
  twgl.bindFramebufferInfo(renderState.gl, null);
  clear(renderState);
}

export function renderScreen(renderState: RenderState) {
  ScreenProgram.render(
    renderState.screenProgram,
    renderState.virtualScreen.attachments[0]
  );
}
