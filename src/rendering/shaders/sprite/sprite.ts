import vertSrc from "./sprite.vert";
import fragSrc from "./sprite.frag";
import * as twgl from "twgl.js";
import { Vec2 } from "~base/vec2";

export namespace SpriteProgram {
  export type State = {
    gl: WebGLRenderingContext;
    programInfo: twgl.ProgramInfo;
    bufferInfo: twgl.BufferInfo;
    spriteTexture: WebGLTexture;
    spritesheetInfo: SpritesheetInfo;
  };

  export type SpritesheetInfo = {
    width: number;
    height: number;
    tileWidth: number;
    tileHeight: number;
    src: string;
  };

  export function setup(
    gl: WebGLRenderingContext,
    spritesheet: SpritesheetInfo
  ): State {
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, {
      position: {
        numComponents: 2,
        data: new Float32Array([0, -1, 0, 0, 1, -1, 0, 0, 1, 0, 1, -1]),
      },
      texCoord: {
        numComponents: 2,
        data: new Float32Array([0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1]),
      },
    });
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    const spriteTexture = twgl.createTexture(gl, {
      src: spritesheet.src,
      mag: gl.NEAREST,
    });

    const programInfo = twgl.createProgramInfo(gl, [vertSrc, fragSrc]);
    window.offset = 16;

    return {
      gl,
      spriteTexture,
      spritesheetInfo: spritesheet,
      bufferInfo,
      programInfo,
    };
  }

  export function render(state: State, viewSize: Vec2) {
    const { gl } = state;
    gl.useProgram(state.programInfo.program);
    twgl.setBuffersAndAttributes(gl, state.programInfo, state.bufferInfo);

    const tileX = 0;
    const tileY = 0;
    const tileCountX = 1;
    const tileCountY = 2;

    const tileWidth =
      state.spritesheetInfo.tileWidth / state.spritesheetInfo.width;
    const tileHeight =
      state.spritesheetInfo.tileHeight / state.spritesheetInfo.height;

    twgl.setUniforms(state.programInfo, {
      texWidth: [tileWidth * tileCountX, tileHeight * tileCountY],
      texOffset: [tileX * tileWidth, tileY * tileHeight],
      spriteTexture: state.spriteTexture,
      viewport: Vec2.toArray(viewSize),
      pos: [0, window.offset],
      size: [
        state.spritesheetInfo.tileWidth * tileCountX,
        state.spritesheetInfo.tileHeight * tileCountY,
      ],
    });
    twgl.drawBufferInfo(gl, state.bufferInfo);
  }
}
