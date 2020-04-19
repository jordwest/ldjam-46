precision highp float;

uniform sampler2D spriteTexture;
varying vec2 v_texCoord;
uniform float alpha;

void main() {
  vec4 col = texture2D(spriteTexture, v_texCoord);
  gl_FragColor = vec4(col.rgb, col.a * alpha);
}
