import vertSrc from "./lighting.vert";
import fragSrc from "./lighting.frag";
import * as twgl from "twgl.js";
import torchTextureSrc from "../../../assets/torch.png";
import { Vec2 } from "~base/vec2";

export namespace LightingProgram {
  export type State = {
    gl: WebGLRenderingContext;
    programInfo: twgl.ProgramInfo;
    bufferInfo: twgl.BufferInfo;
    torchTexture: WebGLTexture;
  };

  export function setup(gl: WebGLRenderingContext): State {
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, {
      position: {
        numComponents: 2,
        data: new Float32Array([-1, -1, -1, 1, 1, -1, -1, 1, 1, 1, 1, -1]),
      },
    });
    const torchTexture = twgl.createTexture(gl, { src: torchTextureSrc });

    const programInfo = twgl.createProgramInfo(gl, [vertSrc, fragSrc]);
    return {
      gl,
      bufferInfo,
      programInfo,
      torchTexture,
    };
  }

  export type LightInstance = {
    pos: Vec2;
    angle: number;
  };

  export function render(
    state: State,
    viewSize: Vec2,
    lights: LightInstance[]
  ) {
    const { gl } = state;
    gl.useProgram(state.programInfo.program);
    twgl.setBuffersAndAttributes(gl, state.programInfo, state.bufferInfo);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    for (const light of lights) {
      twgl.setUniforms(state.programInfo, {
        translate: [
          (light.pos.x / viewSize.x) * 2 - 1,
          -((light.pos.y / viewSize.y) * 2 - 1),
        ],
        rotate: light.angle,
        lightTexture: state.torchTexture,
      });
      twgl.drawBufferInfo(gl, state.bufferInfo);
    }
  }
}
