precision mediump float;

varying vec2 texCoord;

uniform sampler2D lightingTexture;
uniform sampler2D colorTexture;

void main() {
  vec4 col = texture2D(colorTexture, texCoord);
  vec4 light = texture2D(lightingTexture, texCoord);

  gl_FragColor = vec4(col.rgb * light.rgb, 1.0);
}
