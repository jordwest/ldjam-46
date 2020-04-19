precision mediump float;

uniform sampler2D lightTexture;

varying vec2 texCoord;

void main() {
  vec4 lightCol = texture2D(lightTexture, texCoord);
  gl_FragColor = vec4(lightCol);
}
