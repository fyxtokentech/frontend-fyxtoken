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

float R1seq(int n) {
    return fract(float(n) * 0.6180339887498948);
}

vec2 R2seq(int n) {
    return fract(vec2(n) * vec2(0.7548776662, 0.5698402909));
}

vec2 Line(vec2 a, vec2 b, vec2 p, vec2 identity, float sa, float sb) {
    vec2 pa = p - a;
    vec2 pb = p - b;
    vec2 ba = b - a;
    float t = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    vec2 pp = a + ba * t;
    vec2 y = vec2(-identity.y, identity.x);
    float cutoff = max(dot(pb, identity), dot(pa, -identity));
    float s = mix(sa, sb, t);
    return vec2(max(cutoff - 0.005, abs(dot(y, p - pp)) - s), t);
}

float Rythm(float x) {
    x = x * 6.28318 * 10.0 / 60.0;
    x = smoothstep(0.0, 1.0, sin(x));
    x = smoothstep(0.0, 1.0, x);
    return x;
}

vec3 Magic(float leadTime, vec3 baseColor, vec2 uv, vec2 baseDir, float time, float spread, float freq, float intensity) {
    int frame = int(iTime * 24.0) / 12;
    float speed = -1.5 - ((Rythm(time)) * 0.5 + 0.5) * 2.0;
    vec2 dir = normalize(baseDir);
    uv -= dir * mix(0.1, 0.3, Rythm(time));
    
    vec2 normal = vec2(-dir.y, dir.x);
    vec2 baseOffset = dir * speed * float(frame);
    
    vec2 p = uv;
    p += dir * speed * float(frame);
    p -= R2seq(frame) * 0.05;
    p += normal * sin(time * 12.0) * 0.05;

    float ray = 0.0;
    float glow = 0.0;

    float leadingTime = 1.0 - smoothstep(leadTime - 0.5, leadTime, time);
    float distanceToLead = dot(uv - 0.5, dir) - leadingTime * 2.0;
    float leadingMask = smoothstep(-0.85, -0.0, distanceToLead);

    spread *= leadingMask * (1.0 - Rythm(time) * 0.75);

    for (int i = -12; i < 10; i++) {
        float offsetA = R1seq(i + frame) * 2.0 - 1.0;
        float offsetB = R1seq(i + frame + 1) * 2.0 - 1.0;

        vec2 a = baseOffset + dir * float(i) * freq + normal * offsetA * spread;
        vec2 b = baseOffset + dir * float(i + 1) * freq + normal * offsetB * spread;

        float sa = mix(0.05, 3.0 * intensity, R1seq(frame * 7 + i - 1)) * 0.005;
        float sb = mix(0.05, 3.0 * intensity, R1seq(frame * 7 + i)) * 0.005;

        vec2 l = Line(a, b, p, dir, sa, sb);
        float d = 0.025 * leadingMask;

        ray += smoothstep(d, d * 0.75 - 0.0001, l.x);
        glow += 0.5 * leadingMask * smoothstep(d * 20.0, d, l.x);
    }

    ray = clamp(ray, 0.0, 1.0);
    return baseColor * (1.0 + glow * (Rythm(time * 16.0) * 0.05 + 0.025)) + vec3(ray) * intensity * leadingMask;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    float time = -.25 + floor(iTime * 1.1 * 24.0) / 24.0;
    float intro = smoothstep(1.75, 1.9, time);
    vec2 uv = fragCoord / r;
    
    uv.y -= 0.075;
    uv.x -= sin(time * 4.0) * 0.2;

    vec2 baseDir = normalize(vec2(0.57, 0.45));
    
    vec3 col = vec3(0.1, 0.1, 0.1) * intro;
    
    float spread = 0.35 + (sin(time * 10.0) * 0.5 + 0.5);
    float freq = 0.6 - (sin(time * 4.0) * 0.5 + 0.5) * 0.2;

    float offset = 1.0 - (smoothstep(1.0, 3.0, time) * smoothstep(4.0, 3.0, time));

    spread *= offset;
    
    col = Magic(0.5, col, uv + vec2(0.4, 0.1) * offset, baseDir, time, 0.2, 0.35, 1.0 - intro * 0.5);
    col = Magic(3.0, col, uv + vec2(0.2, 0.0) * offset, baseDir, time, 0.05, 0.15, 0.55 + intro * 0.3);
    col = Magic(8.0, col, uv + vec2(0.2, -0.25) * offset, baseDir, time, 0.05, 0.15, 0.35 + intro * 0.3);
    col = Magic(10.0, col, uv + vec2(-0.15, -0.35) * offset, baseDir, time, 0.04, 0.05, 0.75 + intro * 0.3);
    col = Magic(11.0, col, uv + vec2(-0.3, -0.15) * offset, baseDir, time, 0.04, 0.05, 0.75 + intro * 0.3);
    col = Magic(12.0, col, uv, baseDir, time, spread * 0.75, freq, 1.0);

    fragColor = vec4(col, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
