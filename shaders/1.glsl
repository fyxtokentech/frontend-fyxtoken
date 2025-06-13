// --- VERTEX SHADER ---
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}

// --- FRAGMENT SHADER ---
#define t iTime
#define r iResolution.xy

uniform float iTime;
uniform vec2 iResolution;
varying vec2 vUv;

void mainImage( out vec4 fragColor, in vec2 fragCoord ){
  vec3 c;
  float l, z = t;
  for(int i = 0; i < 3; i++) {
    vec2 uv, p = fragCoord.xy / r;
    uv = p;
    p -= 0.5;
    p.x *= r.x / r.y;
    z += 0.07;
    l = length(p);
    uv += p / l * (sin(z) + 1.0) * abs(sin(l * 9.0 - z - z));
    c[i] = 0.01 / length(mod(uv, 1.0) - 0.5);
  }
  fragColor = vec4(c / l, t);
}

void main() {
  // Convertir las coordenadas de gl_FragCoord a nuestro mainImage
  mainImage(gl_FragColor, gl_FragCoord.xy);
}
