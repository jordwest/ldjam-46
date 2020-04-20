precision mediump float;

uniform sampler2D spriteTexture;
uniform float alpha;
uniform float verticalProgress;

varying vec2 v_texCoord;
varying float v_verticalFraction;

void main() {
  vec4 col = texture2D(spriteTexture, v_texCoord);
  float visible = 1.0 - step(verticalProgress, v_verticalFraction);
  gl_FragColor = vec4(col.rgb, col.a * alpha * visible);
}
