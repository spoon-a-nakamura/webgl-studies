precision mediump float;

varying vec2 vUv;
uniform float uTime;

void main() {
  vec3 color = vec3(
    (sin(uTime * 0.5) + 1.0) * 0.5,
    (sin(uTime * 0.7) + 1.0) * 0.5,
    (sin(uTime * 0.9) + 1.0) * 0.5
  );
  gl_FragColor = vec4(color, 1.0);
}
