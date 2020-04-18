import vertSrc from "./sprite.vert";
import fragSrc from "./sprite.frag";
import * as twgl from "twgl.js";

export namespace SpriteProgram {
  export type State = {
    //spriteTexture: WebGLTexture,
    gl: WebGLRenderingContext;
    programInfo: twgl.ProgramInfo;
    bufferInfo: twgl.BufferInfo;
  };

  export function setup(gl: WebGLRenderingContext): State {
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, {
      position: {
        numComponents: 2,
        data: new Float32Array([-1, -1, -1, 1, 1, -1]),
      },
    });
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const programInfo = twgl.createProgramInfo(gl, [vertSrc, fragSrc]);

    return {
      gl,
      bufferInfo,
      programInfo,
    };
  }

  export function render(state: State) {
    const { gl } = state;
    gl.useProgram(state.programInfo.program);
    twgl.setBuffersAndAttributes(gl, state.programInfo, state.bufferInfo);
    twgl.drawBufferInfo(gl, state.bufferInfo);
  }
}
