import vertSrc from "./screen.vert";
import fragSrc from "./screen.frag";
import * as twgl from "twgl.js";

export namespace ScreenProgram {
  export type State = {
    gl: WebGLRenderingContext;
    programInfo: twgl.ProgramInfo;
    bufferInfo: twgl.BufferInfo;
  };

  export function setup(gl: WebGLRenderingContext): State {
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, {
      position: {
        numComponents: 2,
        data: new Float32Array([-1, -1, -1, 1, 1, -1, -1, 1, 1, 1, 1, -1]),
      },
    });

    const programInfo = twgl.createProgramInfo(gl, [vertSrc, fragSrc]);
    return {
      gl,
      bufferInfo,
      programInfo,
    };
  }

  export function render(state: State, screenTexture: WebGLTexture) {
    const { gl } = state;
    gl.useProgram(state.programInfo.program);
    twgl.setBuffersAndAttributes(gl, state.programInfo, state.bufferInfo);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    twgl.setUniforms(state.programInfo, {
      screenTexture,
    });
    twgl.drawBufferInfo(gl, state.bufferInfo);
  }
}
