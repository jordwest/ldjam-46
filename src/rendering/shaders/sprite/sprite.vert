precision highp float;

attribute vec2 position;
attribute vec2 texCoord;

uniform vec2 texOffset;
uniform vec2 texWidth;

uniform vec2 viewport;
uniform vec2 size;
uniform vec2 pos;

varying vec2 v_texCoord;

void main() {
  v_texCoord = (texCoord * texWidth) + texOffset;

  vec2 scale = size / viewport;
  vec2 translate = (vec2(pos.x, -pos.y) / viewport);

  gl_Position = vec4(((position * scale) + translate) * 2.0 + vec2(-1.0, 1.0), 0.0, 1.0);
}
