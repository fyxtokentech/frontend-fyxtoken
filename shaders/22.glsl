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

// Función para generar ruido
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec4 permute(vec4 x) {
    return mod((34.0 * x + 1.0) * x, 289.0);
}

vec2 celluar2x2(vec2 P) {
    float pp = 7.0;
    float K = 1.0 / pp;
    float K2 = 0.5 / pp;
    float jitter = 0.8;
    vec2 Pi = mod(floor(P), 289.0);
    vec2 Pf = fract(P);
    vec4 Pfx = Pf.x + vec4(-0.5, -1.5, -0.5, -1.5);
    vec4 Pfy = Pf.y + vec4(-0.5, -0.5, -1.5, -1.5);
    vec4 p = permute(Pi.x + vec4(0.0, 1.0, 0.0, 1.0));
    p = permute(p + Pi.y + vec4(0.0, 0.0, 1.0, 1.0));
    vec4 ox = mod(p, pp) * K + K2;
    vec4 oy = mod(floor(p * K), pp) * K + K2;
    vec4 dx = Pfx + jitter * ox;
    vec4 dy = Pfy + jitter * oy;
    vec4 d = dx * dx + dy * dy;
    d.xy = min(d.xy, d.zw);
    d.x = min(d.x, d.y);
    return d.xx;
}

void drawParticleSet(inout vec4 color, vec2 uv, float size) {
    float cellSize = size;
    vec3 colorTint;
    float randomSeed01 = rand(floor(uv / cellSize));
    float randomSeed02 = rand(floor(uv / cellSize) + 5.0);
    float randomSeed03 = rand(floor(uv / cellSize) + 10.0);
    
    colorTint = vec3(randomSeed01, randomSeed02, randomSeed03);
    float circleSize = abs(sin(t * randomSeed03 + randomSeed02)) * randomSeed01 * cellSize;
    
    float jitterFreedom = 0.5 - circleSize;
    float jitterX = jitterFreedom * (randomSeed03 * 2.0 - 1.0);
    float jitterY = jitterFreedom * (randomSeed01 * 2.0 - 1.0);
    vec2 coord = fract(uv / cellSize) - 0.5;
    
    float z = 0.0;
    vec3 outputColor;
    for (int i = 0; i < 3; i++) {
        z += 0.015 * celluar2x2(coord + t * 0.1).x;
        coord += z;
        outputColor[i] = 1.0 - smoothstep(circleSize - 30.5 / r.y, circleSize, distance(coord, vec2(jitterX, jitterY)));
    }
    
    outputColor = mix(color.xyz, colorTint * outputColor, length(outputColor));
    color = vec4(outputColor.xyz, 0.1);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord.xy / r.y;
    float aspectRatio = r.x / r.y;
    vec4 finalColor = vec4(0.0);
    
    uv.x -= aspectRatio / 2.0;
    uv.y -= 0.5;
    
    drawParticleSet(finalColor, uv, 0.1);
    drawParticleSet(finalColor, uv - 0.1, 0.15);
    drawParticleSet(finalColor, uv + 0.3, 0.17);
    
    fragColor = vec4(finalColor);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
