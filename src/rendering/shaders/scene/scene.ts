import vertSrc from "./scene.vert";
import fragSrc from "./scene.frag";
import * as twgl from "twgl.js";
import { Vec2 } from "~base/vec2";

export namespace SceneProgram {
  export type State = {
    gl: WebGLRenderingContext;
    programInfo: twgl.ProgramInfo;
    bufferInfo: twgl.BufferInfo;

    sceneColors: twgl.FramebufferInfo;
    sceneLighting: twgl.FramebufferInfo;
  };

  export function setup(gl: WebGLRenderingContext, size: Vec2): State {
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, {
      position: {
        numComponents: 2,
        data: new Float32Array([-1, -1, -1, 1, 1, -1, -1, 1, 1, 1, 1, -1]),
      },
    });

    const attachments = [{}];
    const sceneColors = twgl.createFramebufferInfo(
      gl,
      attachments,
      size.x,
      size.y
    );
    const sceneLighting = twgl.createFramebufferInfo(
      gl,
      attachments,
      size.x,
      size.y
    );

    const programInfo = twgl.createProgramInfo(gl, [vertSrc, fragSrc]);
    return {
      gl,
      bufferInfo,
      programInfo,
      sceneLighting,
      sceneColors,
    };
  }

  export function render(state: State) {
    const { gl } = state;
    gl.useProgram(state.programInfo.program);
    twgl.setBuffersAndAttributes(gl, state.programInfo, state.bufferInfo);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    twgl.setUniforms(state.programInfo, {
      lightingTexture: state.sceneLighting.attachments[0],
      colorTexture: state.sceneColors.attachments[0],
    });
    twgl.drawBufferInfo(gl, state.bufferInfo);
  }
}
