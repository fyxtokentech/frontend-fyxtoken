// --- VERTEX SHADER ---

precision highp float;

varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}

// --- FRAGMENT SHADER ---

precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

#define S(x, y, z) smoothstep(x, y, z)
#define sat(x) clamp(x, 0.0, 1.0)

// Colores
#define streetLightCol vec3(1.0, 0.7, 0.3)
#define headLightCol vec3(0.8, 0.8, 1.0)
#define tailLightCol vec3(1.0, 0.1, 0.1)

vec3 ro, rd;

float N(float t) {
    return fract(sin(t * 10234.324) * 123423.23512);
}

vec3 ClosestPoint(vec3 ro, vec3 rd, vec3 p) {
    return ro + max(0.0, dot(p - ro, rd)) * rd;
}

float BokehMask(vec3 ro, vec3 rd, vec3 p, float size, float blur) {
    float d = length(cross(p - ro, rd));
    return S(size, size * (1.0 - blur), d);
}

vec3 HeadLights(float i, float t) {
    float z = fract(-t * 2.0 + i);
    vec3 p = vec3(-0.3, 0.1, z * 40.0);
    float d = length(p - ro);

    float size = mix(0.03, 0.05, S(0.02, 0.07, z)) * d;
    float blur = 0.1;
    float m = BokehMask(ro, rd, p - vec3(0.08, 0.0, 0.0), size, blur);
    m += BokehMask(ro, rd, p + vec3(0.08, 0.0, 0.0), size, blur);

    float distFade = max(0.01, pow(1.0 - z, 9.0));
    blur = 0.8;
    size *= 2.5;
    float r = BokehMask(ro, rd, p + vec3(-0.09, -0.2, 0.0), size, blur);
    r += BokehMask(ro, rd, p + vec3(0.09, -0.2, 0.0), size, blur);

    return headLightCol * (m + r) * distFade;
}

vec3 StreetLights(float i, float t) {
    float side = sign(rd.x);
    float z = fract(i - t);
    vec3 p = vec3(2.0 * side, 2.0, z * 60.0);
    float d = length(p - ro);
    float blur = 0.1;
    float distFade = 1.0 - pow(1.0 - z, 6.0);
    float m = BokehMask(ro, rd, p, 0.05 * d, blur) * distFade;
    return m * streetLightCol;
}

void CameraSetup(vec2 uv, vec3 pos, vec3 lookat, float zoom) {
    ro = pos;
    vec3 f = normalize(lookat - ro);
    vec3 r = cross(vec3(0.0, 1.0, 0.0), f);
    vec3 u = cross(f, r);
    vec3 center = ro + f * zoom;
    vec3 i = center + uv.x * r + uv.y * u;
    rd = normalize(i - ro);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    float t = iTime;
    vec3 col = vec3(0.0);
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv -= 0.5;
    uv.x *= iResolution.x / iResolution.y;

    vec3 pos = vec3(0.8, 0.15, 0.0);
    vec3 lookat = vec3(0.3, 0.15, 1.0);
    CameraSetup(uv, pos, lookat, 2.0);

    t *= 0.03;

    for (float i = 0.0; i < 1.0; i += 1.0 / 8.0) {
        col += StreetLights(i, t);
    }

    for (float i = 0.0; i < 1.0; i += 1.0 / 8.0) {
        col += HeadLights(i, t);
    }

    col += sat(rd.y) * vec3(0.6, 0.5, 0.9);
    fragColor = vec4(col, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
