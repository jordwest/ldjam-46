precision mediump float;

attribute vec2 position;
uniform vec2 translate;
uniform vec2 viewport;

varying vec2 pixelPos;

void main() {
  vec2 offset = vec2(
    (translate.x - (viewport.x / 2.0)) / (viewport.x / 2.0),
    -(translate.y - (viewport.y / 2.0)) / (viewport.y / 2.0)
  );

  pixelPos = position * (viewport / 2.0);

  gl_Position = vec4(position + offset, 0.0, 1.0);
}
