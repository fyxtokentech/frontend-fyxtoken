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

const float PI = 3.141593;
const float TWO_PI = PI * 2.0;

// Función para generar ruido aleatorio
float rand(float v) {
    return fract(sin(v) * 5364.54367);
}

// Interpolación de ruido 1D
float noise(float v) {
    float i = floor(v);
    float f = fract(v);   
    float a = rand(i);
    float b = rand(i + 1.0);                   
    return mix(a, b, smoothstep(0.0, 1.0, f));
}

// Rotación 2D
vec2 rotate2D(float angle, vec2 uv) {
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * uv;
}

// Función para generar patrón hexagonal
float hex(vec2 p, float thickness) {
    p.x *= 0.57735 * 2.0;
    p.y += mod(floor(p.x), 2.0) * 0.5;
    p = abs((mod(p, 1.0) - 0.5));
    float sm = thickness * 0.5;
    return smoothstep(thickness + sm, thickness - sm, abs(max(p.x * 1.5 + p.y, p.y * 2.0) - 1.0));
}

// Generación de paleta de colores
vec3 palette() {
    vec3 ORANGE = vec3(0.7, 0.3, 0.1);
    vec3 BROWN = vec3(0.5, 0.35, 0.2);
    vec3 PURPLE = vec3(0.6, 0.2, 0.5);
    vec3 RED = vec3(0.7, 0.1, 0.2);
    
    vec3 c1 = mix(ORANGE, PURPLE, noise(iTime * 0.55 + 185.43));
    vec3 c2 = mix(BROWN, RED, noise(iTime * 0.45 + 1485.34));
    
    return mix(c1, c2, noise(iTime * 0.5 + 432.63));
}

// Función principal para el color del fragmento
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - r * 0.5) / r.y;
    uv = rotate2D((noise(iTime * 0.05 + 534.453) - 0.5) * TWO_PI, uv);
    
    float tiles = sin(iTime * 0.5 + 12.5) * 6.0 + 9.0;
    int LAYERS = 6;
    
    vec3 pal = palette();
    vec3 col = pal * 0.6;
    
    float scaleAnim = 0.15 * sin(iTime * 1.3 + 4324.0) + 0.2;
    vec2 cameraAnim = (vec2(noise(iTime * 0.15 + 123.25), noise(iTime * 0.2 + 1544.123)) - 0.5) * 10.0;

    float scale = 1.0;
    for (int i = 1; i <= LAYERS; ++i) {
        float thicknessAnim = 0.08 * sin(0.9 * iTime + float(i) * 0.6) + 0.1;
        
        float h = hex((scale * uv * tiles) + cameraAnim, thicknessAnim);
        vec3 c = float(i) * pal * h;
        
        c *= mix(0.9, -noise(iTime * 0.5 + 1515.11) * 0.6, step(0.5, float(i % 2)));
        c += mix(0.2, -0.2, hex(5.0 * uv, 0.6)) * h;
   
        col += (1.0 - length(uv)) * c;
        scale -= scaleAnim / float(LAYERS);
    }
           
    fragColor = vec4(col, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
