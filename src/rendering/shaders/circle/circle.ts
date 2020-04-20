import vertSrc from "./circle.vert";
import fragSrc from "./circle.frag";
import * as twgl from "twgl.js";
import { Vec2 } from "~base/vec2";

export namespace CircleProgram {
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

  export type LightType = "torch" | "fire";
  export type CircleInstance = {
    pos: Vec2;
    innerRadius: number;
    outerRadius: number;
    color: [number, number, number, number];
  };

  export function render(
    state: State,
    viewSize: Vec2,
    circles: CircleInstance[]
  ) {
    const { gl } = state;
    gl.useProgram(state.programInfo.program);
    twgl.setBuffersAndAttributes(gl, state.programInfo, state.bufferInfo);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    for (const circle of circles) {
      twgl.setUniforms(state.programInfo, {
        viewport: Vec2.toArray(viewSize),
        translate: Vec2.toArray(circle.pos),
        innerRadius: circle.innerRadius,
        outerRadius: circle.outerRadius,
        color: circle.color,
      });
      twgl.drawBufferInfo(gl, state.bufferInfo);
    }
  }
}
