import vertSrc from "./lighting.vert";
import fragSrc from "./lighting.frag";
import * as twgl from "twgl.js";
import torchTextureSrc from "../../../assets/torch.png";
import fireTextureSrc from "../../../assets/fire.png";
import { Vec2 } from "~base/vec2";

export namespace LightingProgram {
  export type State = {
    gl: WebGLRenderingContext;
    programInfo: twgl.ProgramInfo;
    bufferInfo: twgl.BufferInfo;
    torchTexture: WebGLTexture;
    fireTexture: WebGLTexture;
  };

  export function setup(gl: WebGLRenderingContext): State {
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, {
      position: {
        numComponents: 2,
        data: new Float32Array([-1, -1, -1, 1, 1, -1, -1, 1, 1, 1, 1, -1]),
      },
    });
    const torchTexture = twgl.createTexture(gl, {
      src: torchTextureSrc,
      mag: gl.NEAREST,
    });
    const fireTexture = twgl.createTexture(gl, {
      src: fireTextureSrc,
      mag: gl.NEAREST,
    });

    const programInfo = twgl.createProgramInfo(gl, [vertSrc, fragSrc]);
    return {
      gl,
      bufferInfo,
      programInfo,
      torchTexture,
      fireTexture,
    };
  }

  export type LightType = "torch" | "fire";
  export type LightInstance = {
    pos: Vec2;
    angle: number;
    lightType: LightType;
    alpha: number;
  };

  const textureForLight = (state: State, t: LightType) => {
    switch (t) {
      case "torch":
        return state.torchTexture;
      case "fire":
        return state.fireTexture;
    }
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
        alpha: light.alpha,
        lightTexture: textureForLight(state, light.lightType),
      });
      twgl.drawBufferInfo(gl, state.bufferInfo);
    }
  }
}
