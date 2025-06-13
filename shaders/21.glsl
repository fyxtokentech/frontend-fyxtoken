// --- VERTEX SHADER ---
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}

// --- FRAGMENT SHADER ---
#define PI 3.1415926

uniform float iTime;
uniform vec2 iResolution;
varying vec2 vUv;

#define TIL 10  
#define ETIL 3  
#define NUM_PARTICLE 30  
#define GRAVITY 0.1
#define EXPLODE_POWER 0.25 
#define LENGTH_STEP 0.5
#define EXPLODE_STEP 0.5
#define NORMAL_FLICKER 0.005 
#define CIRCLE_FLICKER 0.02
#define DD1 4.0
#define DD2 5.0
#define TT1 2.0

vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)),
             dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 53758.5453123);
}

vec2 noise(vec2 tc) {
    return hash2(tc);
}

float rand(vec2 c) {
    return fract(sin(dot(c.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float hash(float n) {
    return fract(sin(n) * 43758.5453123);
}

vec2 getPos(vec2 o, float t, vec2 d) {
    return vec2(o.x + d.x * t, o.y + d.y * t - GRAVITY * t * t);
}

float drawPoint(float r, float size, vec2 p) {
    return smoothstep(r, r + size, length(p));
}

vec3 drawParticle(vec2 p, float size, vec3 col) {
    return mix(col, vec3(0.0), smoothstep(0.0, size, dot(p, p) * 90.0));
}

vec3 drawFly(vec2 uv, vec2 o, float off, vec3 color, vec2 initDir) {
    float t = iTime + off;
    vec3 col = vec3(0.0);

    if (t < 0.0 || t > DD1) {
        return col;
    }

    float nt = floor(t / DD1) + off + o.x + o.y;
    t = mod(t, DD1);

    if (t < TT1) {
        for (int i = 0; i < TIL; i++) {
            float id = float(i) / float(TIL);
            vec2 q = uv - getPos(o, t - LENGTH_STEP * id, initDir) + noise(vec2((id + hash(nt) + t) * 0.65)) * 0.005;
            col += drawParticle(q, mix(0.02, 0.012, id), mix(color, vec3(0.0), id));
        }
        vec2 flarePos = uv - getPos(o, t, initDir);
        col += mix(color * mix(1.0, 0.0, dot(flarePos, flarePos) * 800.0), vec3(0.0),
                   drawPoint((0.0003 * abs(0.1 + sin(t * 0.9 + PI * 0.3))) * 0.04, 0.01, flarePos));
    } else {
        float t2 = t - TT1;
        vec2 ep = getPos(o, TT1, initDir);
        float lerp = t2 / (DD1 - TT1);
        for (int i = 0; i < ETIL; i++) {
            float id = float(i) / float(ETIL);
            for (int j = 0; j < NUM_PARTICLE; j++) {
                vec2 dir = noise(vec2(float(j) / float(NUM_PARTICLE), hash(float(j) + nt) * 0.5)) * EXPLODE_POWER;
                vec2 q = uv - getPos(ep, t2 - 0.2 * EXPLODE_STEP * id, dir);
                float flicker = NORMAL_FLICKER * hash(float(j) + lerp);
                col += drawParticle(q, (0.01 + flicker) * abs(cos(lerp * 0.5 * PI)), color * mix(1.0, 0.0, id));
            }
        }
        col += mix(mix(color, vec3(0.0), clamp(3.0 * lerp, 0.0, 1.0)), vec3(0.0), drawPoint(0.0, 0.7, uv - ep));
    }

    return col;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 p = fragCoord.xy / iResolution.xy;
    float ratio = iResolution.y / iResolution.x;
    vec2 uv = p;
    uv.y *= ratio;

    float lerp = smoothstep(0.0, 1.0, uv.y);
    vec3 col = mix(vec3(0.1, 0.2, 0.3), vec3(0.1, 0.1, 0.1), sqrt(uv.y));

    vec2 moonPos = uv - vec2(0.568, 0.29);
    col.xyz += mix(vec3(0.0), sign(vec3(clamp(rand(uv) - 0.9985, 0.0, 1.0))),
                   clamp(sign(dot(moonPos, moonPos) - 0.05), 0.0, 1.0));

    col += drawFly(uv, vec2(0.6, 0.0), 0.0, vec3(0.7, 0.3, 0.0), vec2(0.07, 0.36));
    col += drawFly(uv, vec2(0.4, 0.0), -2.5, vec3(0.0, 0.4, 0.6), vec2(0.1, 0.4));
    col += drawFly(uv, vec2(0.5, 0.0), -4.5, vec3(0.2, 0.6, 0.1), vec2(0.0, 0.35));

    vec3 earthCol = vec3(0.1, 0.1, 0.1);
    float g = 0.02 * exp((uv.x) * 1.2);
    col = mix(earthCol, col, smoothstep(g, g + 0.015, abs(uv.y + 0.02)));

    fragColor = vec4(col, 1.0);
}

// Llamado principal
void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
