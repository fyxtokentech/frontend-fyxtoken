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

const float PI = 3.1415926535;
const float TWO_PI = PI * 2.0;

// Generador de ruido basado en seno
float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Función de mezcla HSV a RGB
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Transformación de rotación en 2D
mat2 rotate2D(float angle) {
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    
    // Aplicar rotación dinámica
    float rotation = mod(t * 0.5, TWO_PI);
    uv *= rotate2D(rotation);
    
    // Crear efecto fractal
    float scale = 4.0 + 2.0 * sin(t * 0.3);
    uv *= scale;
    
    float colFactor = noise(uv * 3.0 + t * 0.1) * 0.5 + 0.5;
    
    // Coloreado basado en HSV con variación en el tiempo
    vec3 color = hsv2rgb(vec3(mod(t * 0.1, 1.0), 0.8, colFactor));
    
    fragColor = vec4(color, 1.0);
}

// Llamado principal
void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
