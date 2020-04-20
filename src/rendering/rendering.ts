import * as twgl from "twgl.js";
import { SpriteProgram } from "./shaders/sprite/sprite";
import spritesheetSrc from "../assets/spritesheet.png";
import instructionsPng from "../assets/instructions.png";
import completePng from "../assets/complete.png";
import introPng from "../assets/intro.png";
import titlePng from "../assets/title.png";
import { Vec2 } from "~base/vec2";
import { ScreenProgram } from "./shaders/screen/screen";
import { LightingProgram } from "./shaders/lighting/lighting";
import { SceneProgram } from "./shaders/scene/scene";
import { CircleProgram } from "./shaders/circle/circle";

export type RenderState = {
  gl: WebGLRenderingContext;
  canvas: HTMLCanvasElement;

  activeFramebuffer: twgl.FramebufferInfo | null;

  titleScreen: WebGLTexture;
  instructionsScreen: WebGLTexture;
  introScreen: WebGLTexture;
  completeScreen: WebGLTexture;
  virtualScreen: twgl.FramebufferInfo;
  spriteProgram: SpriteProgram.State;
  lightingProgram: LightingProgram.State;
  circleProgram: CircleProgram.State;
  screenProgram: ScreenProgram.State;
  sceneProgram: SceneProgram.State;
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
  const gl = canvas.getContext("webgl", { premultipliedAlpha: false });
  if (!gl) {
    alert("Sorry, I couldn't get WebGL running in your browser");
    throw new Error("WebGL is null");
  }

  const titleScreen = twgl.createTexture(gl, {
    src: titlePng,
    mag: gl.NEAREST,
  });
  const introScreen = twgl.createTexture(gl, {
    src: introPng,
    mag: gl.NEAREST,
  });
  const instructionsScreen = twgl.createTexture(gl, {
    src: instructionsPng,
    mag: gl.NEAREST,
  });
  const spriteProgram = SpriteProgram.setup(gl, SPRITESHEET);
  const screenProgram = ScreenProgram.setup(gl);
  const sceneProgram = SceneProgram.setup(gl, virtualScreenSize);
  const lightingProgram = LightingProgram.setup(gl);
  const circleProgram = CircleProgram.setup(gl);

  const completeScreen = twgl.createTexture(gl, {
    src: completePng,
    mag: gl.NEAREST,
  });
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
    activeFramebuffer: null,
    titleScreen,
    instructionsScreen,
    introScreen,
    completeScreen,
    virtualScreen,
    spriteProgram,
    lightingProgram,
    circleProgram,
    sceneProgram,
    screenProgram,
  };
}

function clear(renderState: RenderState) {
  const { gl } = renderState;

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function setFramebuffer(
  renderState: RenderState,
  framebuffer: twgl.FramebufferInfo | null
) {
  twgl.bindFramebufferInfo(renderState.gl, framebuffer);
  renderState.activeFramebuffer = framebuffer;
}

export function withFramebuffer(
  renderState: RenderState,
  framebuffer: twgl.FramebufferInfo | null,
  fn: () => void
) {
  const prevFramebuffer = renderState.activeFramebuffer;
  setFramebuffer(renderState, framebuffer);
  fn();
  setFramebuffer(renderState, prevFramebuffer);
}

export function prepareVirtualScreen(renderState: RenderState) {
  setFramebuffer(renderState, renderState.virtualScreen);
  clear(renderState);
}

export function prepareScreen(renderState: RenderState) {
  setFramebuffer(renderState, null);
  clear(renderState);
}

export function prepareSceneLighting(renderState: RenderState) {
  const { gl } = renderState;
  setFramebuffer(renderState, renderState.sceneProgram.sceneLighting);

  // Add some ambient light
  gl.clearColor(0.5, 0.5, 0.8, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

export function prepareSceneColors(renderState: RenderState) {
  setFramebuffer(renderState, renderState.sceneProgram.sceneColors);
  clear(renderState);
}

export function renderScene(renderState: RenderState) {
  ScreenProgram.render(
    renderState.screenProgram,
    renderState.virtualScreen.attachments[0]
  );
}
