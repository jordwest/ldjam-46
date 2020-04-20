import vertSrc from "./screen.vert";
import fragSrc from "./screen.frag";
import * as twgl from "twgl.js";
import pixelSrc from "~/assets/pixelmask.png";

export namespace ScreenProgram {
  export type State = {
    gl: WebGLRenderingContext;
    programInfo: twgl.ProgramInfo;
    bufferInfo: twgl.BufferInfo;
    pixelTexture: WebGLTexture;
  };

  export function setup(gl: WebGLRenderingContext): State {
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, {
      position: {
        numComponents: 2,
        data: new Float32Array([-1, -1, -1, 1, 1, -1, -1, 1, 1, 1, 1, -1]),
      },
    });
    const pixelTexture = twgl.createTexture(gl, {
      src: pixelSrc,
      wrap: gl.REPEAT,
    });

    const programInfo = twgl.createProgramInfo(gl, [vertSrc, fragSrc]);
    return {
      gl,
      bufferInfo,
      programInfo,
      pixelTexture,
    };
  }

  export function render(
    state: State,
    screenTexture: WebGLTexture,
    alpha: number = 1
  ) {
    const { gl, pixelTexture } = state;
    gl.useProgram(state.programInfo.program);
    twgl.setBuffersAndAttributes(gl, state.programInfo, state.bufferInfo);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);

    twgl.setUniforms(state.programInfo, {
      screenTexture,
      pixelTexture,
      alpha,
      pixels: [256, 240],
    });
    twgl.drawBufferInfo(gl, state.bufferInfo);
  }
}
