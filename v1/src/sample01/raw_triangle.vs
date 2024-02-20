// ----------------------------------------------
// 組み込みのattribute, uniform
// https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
// ----------------------------------------------
attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
// ----------------------------------------------
uniform float uTime;

varying vec2 vUv;

const float PI = acos(-1.0);

mat2 rot(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, s, -s, c);
}

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );

  // ----------------------------------------------
  // 何故、この描画結果になるのでしょうか？
  // ----------------------------------------------
  // gl_Position = vec4( position, 1.0 );

  // ----------------------------------------------
  // uniformを使った回転
  // ----------------------------------------------
  // vec3 pos = position;
  // pos.xy = rot(uTime) * pos.xy;
  // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( pos, 1.0 );
  // gl_Position = vec4( pos, 1.0 );

  // ----------------------------------------------
  // 動きの緩急と、floor，fract関数
  // https://graphtoy.com/
  // ----------------------------------------------
  // float t = floor(uTime);
  // t += 1.0 - pow(1.0 - fract(uTime), 5.0);
  // vec3 pos = position;
  // pos.xy = rot(t * PI / 3.0) * pos.xy;
  // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( pos, 1.0 );
}