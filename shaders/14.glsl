// --- VERTEX SHADER ---
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}

// --- FRAGMENT SHADER ---
uniform float iTime;
uniform vec2 iResolution;
varying vec2 vUv;

// Funcion de hash para generar ruido
float hash(float n) {
    return fract(sin(n) * 43758.5453123);
}

// Ruido basado en interpolacion de hashing
float noise(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);

    float n = p.x + p.y * 57.0 + p.z * 113.0;
    return mix(mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
                   mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
               mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
                   mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y),
               f.z);
}

// Mapeo del espacio y generacion de densidad
vec4 map(vec3 p, float time) {
    float den = 0.2 - p.y;

    // Inversion del espacio
    p = p / dot(p, p);

    // Escalado y reflejo
    p = -7.0 * p;

    // Rotacion en el eje Z
    float co = cos(0.8 * den);
    float si = sin(0.8 * den);
    p.xz = mat2(co, -si, si, co) * p.xz;

    // Generacion de nubes
    float f;
    float t = time + 9.0;
    vec3 q = p - vec3(0.0, t * 0.2, 0.0);
    f = 0.500000 * noise(q);
    q = q * 2.21 - vec3(0.0, t * 0.4, 0.0);
    f += 0.250000 * noise(q);
    q = q * 2.15 - vec3(0.0, t * 0.8, 0.0);
    f += 0.125000 * noise(q);
    q = q * 2.13 - vec3(0.0, t * 1.6, 0.0);
    f += 0.062500 * noise(q);
    q = q * 2.05 - vec3(0.0, t * 3.2, 0.0);
    f += 0.031250 * noise(q);

    den = den + 3.5 * f + 0.015;

    vec3 col = mix(vec3(0.8), vec3(0.5), den) + 0.02 * sin(p);

    return vec4(col, den);
}

// Funcion de raymarching
vec3 raymarch(in vec3 ro, in vec3 rd, in vec2 pixel, float time) {
    float li = 1.0;
    li *= smoothstep(0.6, 0.65, noise(vec3(time * 11.2 + 6.1, 0.0, 0.0)));
    li *= smoothstep(0.4, 0.45, noise(vec3(time * 1.1 + 6.1, 0.0, 0.0)));

    vec4 sum = vec4(0.0);
    const float stepFactor = 0.5;
    float t = 0.05 * fract(sin(iTime + pixel.x * 11.0 + 17.0 * pixel.y) * 1.317);

    for (int i = 0; i < 256; i++) {
        vec3 pos = ro + t * rd;
        vec4 col = map(pos, time);

        if (col.w > 0.0) {
            float len = length(pos);
            float at = smoothstep(2.0, 0.0, len);
            col.xyz *= mix(2.5 * vec3(0.3, 0.4, 0.5), 0.9 * vec3(0.4, 0.45, 0.55), clamp((pos.y - 0.1) / 2.0, 0.0, 1.0));
            col.xyz *= 1.0 + 0.15 * at + 1.5 * li * at;

            vec3 dir = pos / len;
            float nn = max(0.0, col.w - map(pos - dir * 0.05, time).w);
            col.xyz += 2.0 * li * (0.5 + 1.5 * at) * nn * vec3(0.8, 0.8, 0.8) * (1.0 - col.w);

            col.xyz *= 1.15 * exp2(-t * 0.1);
            col.a *= stepFactor;
            col.rgb *= col.a;
            sum = sum + col * (1.0 - sum.a);
            if (sum.a > 0.99) break;
        }
        t += 0.1 * stepFactor;
    }

    return clamp(sum.xyz, 0.0, 1.0);
}

// Funcion de renderizado principal
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    float time = iTime;
    vec2 p = (2.0 * fragCoord - iResolution.xy) / iResolution.y;

    vec3 ro = 4.0 * normalize(vec3(1.0, 1.5, 0.0));
    vec3 ta = vec3(0.0, 1.0, 0.0);
    float cr = 0.4 * cos(0.4 * iTime);

    // Efecto de vibracion
    ro += 0.01 * (-1.0 + 2.0 * noise(vec3(3.1 * time, 0.0, 0.0)));
    ta += 0.01 * (-1.0 + 2.0 * noise(vec3(3.3 * time, 0.0, 0.0)));

    // Construccion de rayos
    vec3 ww = normalize(ta - ro);
    vec3 uu = normalize(cross(vec3(sin(cr), cos(cr), 0.0), ww));
    vec3 vv = normalize(cross(ww, uu));
    vec3 rd = normalize(p.x * uu + p.y * vv + 2.0 * ww);

    vec3 col = raymarch(ro, rd, fragCoord, time);

    // Ajuste de color
    col = col * col * (3.0 - 2.0 * col);
    col = col * 0.5 + 0.5 * col * col * (3.0 - 2.0 * col);
    col *= 1.2;

    // Vignette
    vec2 q = fragCoord.xy / iResolution.xy;
    col *= 0.1 + 0.9 * pow(16.0 * q.x * q.y * (1.0 - q.x) * (1.0 - q.y), 0.15);

    fragColor = vec4(col, 1.0);
}

// Llamado principal
void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
