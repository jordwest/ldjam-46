precision mediump float;

uniform sampler2D screenTexture;
uniform sampler2D pixelTexture;
uniform vec2 pixels;

varying vec2 texCoord;

void main() {
  vec4 col = texture2D(screenTexture, texCoord);
  vec4 bleedCol = texture2D(
    screenTexture,
    vec2(texCoord.x - (1.0/pixels.x), texCoord.y)
  );
  vec4 pixel = texture2D(pixelTexture, texCoord * pixels);
  vec3 withBleed = (col.rgb * 3.0 + bleedCol.rgb) / 4.0;

  gl_FragColor = vec4(withBleed.rgb * pixel.rgb, col.a);
}
