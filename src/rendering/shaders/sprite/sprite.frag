precision highp float;

uniform sampler2D spriteTexture;
varying vec2 v_texCoord;

void main() {
  vec4 col = texture2D(spriteTexture, v_texCoord);
  gl_FragColor = col;
}
