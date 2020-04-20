precision mediump float;

uniform vec2 viewport;
uniform float innerRadius;
uniform float outerRadius;
uniform vec4 color;

varying vec2 pixelPos;

void main() {
  float r = distance(vec2(0,0), pixelPos);

  float intensity = step(innerRadius, r) * (1.0 - step(outerRadius, r));
  //float intensity = step(innerRadius, r);
  //gl_FragColor = vec4(position, 0.0, 1.0);

  gl_FragColor = color * intensity;
}
