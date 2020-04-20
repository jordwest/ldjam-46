import { Vec2 } from "./vec2";

export class Float32Cursor {
  data: Float32Array;
  offset: number;

  constructor(capacity: number) {
    this.data = new Float32Array(capacity);
    this.offset = 0;
  }

  push(a: number) {
    this.data[this.offset] = a;
    this.offset += 1;
  }

  get length() {
    return this.offset;
  }

  push2(a: number, b: number) {
    this.push(a);
    this.push(b);
  }

  pushVec2(v: Vec2) {
    this.push2(v.x, v.y);
  }

  reset(capacity: number) {
    if (this.data.length < capacity) {
      this.data = new Float32Array(capacity);
    }

    this.offset = 0;
  }
}
