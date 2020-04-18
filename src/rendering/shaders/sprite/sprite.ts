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
    return {
      gl,
      spriteTexture,
      spritesheetInfo: spritesheet,
      bufferInfo,
      programInfo,
    };
  }

  export type SpriteInstance = {
    position: Vec2;
    tile: Vec2;
    size: Vec2;
  };

  export function render(
    state: State,
    viewSize: Vec2,
    sprites: SpriteInstance[]
  ) {
    const { gl } = state;
    gl.useProgram(state.programInfo.program);
    twgl.setBuffersAndAttributes(gl, state.programInfo, state.bufferInfo);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const tileWidth =
      state.spritesheetInfo.tileWidth / state.spritesheetInfo.width;
    const tileHeight =
      state.spritesheetInfo.tileHeight / state.spritesheetInfo.height;

    for (const sprite of sprites) {
      const tileCountX = sprite.size.x;
      const tileCountY = sprite.size.y;

      twgl.setUniforms(state.programInfo, {
        texWidth: [tileWidth * tileCountX, tileHeight * tileCountY],
        texOffset: [sprite.tile.x * tileWidth, sprite.tile.y * tileHeight],
        spriteTexture: state.spriteTexture,
        viewport: Vec2.toArray(viewSize),
        pos: [sprite.position.x, sprite.position.y],
        size: [
          state.spritesheetInfo.tileWidth * tileCountX,
          state.spritesheetInfo.tileHeight * tileCountY,
        ],
      });
      twgl.drawBufferInfo(gl, state.bufferInfo);
    }
  }
}
