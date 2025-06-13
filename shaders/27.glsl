// --- VERTEX SHADER ---
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}

// --- FRAGMENT SHADER ---
#define TIME        iTime
#define RESOLUTION  iResolution
#define PI          3.141592654
#define TAU         (2.0*PI)
#define ROT(a)      mat2(cos(a), sin(a), -sin(a), cos(a))

uniform float iTime;
uniform vec2 iResolution;
varying vec2 vUv;

// Función para modular eje
float mod1(inout float p, float size) {
  float halfsize = size * 0.5;
  float c = floor((p + halfsize) / size);
  p = mod(p + halfsize, size) - halfsize;
  return c;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  float aa = 4.0 / RESOLUTION.y;
  vec2 q = fragCoord / RESOLUTION.xy;
  vec2 p = -1.0 + 2.0 * q;
  p.x *= RESOLUTION.x / RESOLUTION.y;
  const mat2 rot = ROT(PI / 4.0);
  p *= rot;

  // Color base (coseno modificado)
  vec3 col0 = (1.0 + cos(vec3(4.0, 1.5, 6.0) + 1.0 * (p.y * p.y * p.x - p.x) - 0.25 * TIME)) * 0.5;
  col0.g *= 0.2; // reducir el verde para que predomine el púrpura

  vec3 col1 = sqrt(0.5) * col0 * col0;

  float n = mod1(p.y, 1.0 / 128.0);
  float t = smoothstep(0.0, -aa, p.y);
  if (mod(n, 2.0) == 0.0) {
    t = 1.0 - t;
  }

  vec3 col = mix(col0, col1, t);
  col = sqrt(col);

  fragColor = vec4(col, 1.0);
}

void main() {
  mainImage(gl_FragColor, gl_FragCoord.xy);
}
