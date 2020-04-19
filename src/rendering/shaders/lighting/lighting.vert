precision mediump float;

attribute vec2 position;

uniform vec2 translate;
uniform float rotate;

varying vec2 texCoord;

void main() {
  texCoord = ((position + 1.0) / 2.0);
  vec2 rotatedPosition = vec2(
    position.x * cos(rotate) + position.y * sin(rotate),
    position.y * cos(rotate) - position.x * sin(rotate)
  );
  gl_Position = vec4(rotatedPosition + translate, 0.0, 1.0);
}
