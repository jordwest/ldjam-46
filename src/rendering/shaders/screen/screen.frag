precision mediump float;

uniform sampler2D screenTexture;
varying vec2 texCoord;

void main() {
  vec4 col = texture2D(screenTexture, texCoord);
  gl_FragColor = col;
}
