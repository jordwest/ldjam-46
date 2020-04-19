precision mediump float;

attribute vec2 position;

uniform vec2 translate;
uniform float rotate;

varying vec2 texCoord;

void main() {
  texCoord = ((position + 1.0) / 2.0);
  gl_Position = vec4(position + translate, 0.0, 1.0);
}
