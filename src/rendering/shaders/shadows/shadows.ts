import vertSrc from "./shadow.vert";
import fragSrc from "./shadow.frag";
import * as twgl from "twgl.js";
import { Vec2 } from "~base/vec2";
import { Float32Cursor } from "~base/cursor";

export namespace ShadowProgram {
  export type State = {
    gl: WebGLRenderingContext;
    vertexData: Float32Cursor;
    programInfo: twgl.ProgramInfo;
    bufferInfo: twgl.BufferInfo;
  };

  export function setup(gl: WebGLRenderingContext): State {
    const vertexData = new Float32Cursor(1024);
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, {
      position: {
        numComponents: 2,
        data: vertexData.data,
      },
    });
    bufferInfo.attribs!.position.drawType = gl.DYNAMIC_DRAW;

    const programInfo = twgl.createProgramInfo(gl, [vertSrc, fragSrc]);
    return {
      gl,
      vertexData,
      bufferInfo,
      programInfo,
    };
  }

  export type OcclusionInstance = {
    pos: Vec2;
    size: number;
  };

  function calculateGeometry() {}

  export function render(
    state: State,
    viewSize: Vec2,
    lights: OcclusionInstance[]
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
