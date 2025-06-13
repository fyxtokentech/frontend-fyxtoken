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

#define PI 3.14159265359
#define TAU 6.28318530718
#define PHI (1.0 + sqrt(5.0)) / 2.0
#define K2 (4.0 * log2(PHI))

// Funcion de ruido basado en hashing
float hash(float n) {
    return fract(sin(n) * 43758.5453123);
}

// Funcion principal para el calculo del color
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // Coordenadas de pixel normalizadas
    vec2 op = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
    float opx = 2.0 / iResolution.y;

    // Ruido basado en hashing
    float ran = hash(fragCoord.x * 7.0 + 17.0 * fragCoord.y);

    // Acumulador de color
    vec3 tot = vec3(0.0);

    // Numero de muestras para motion blur
    const int kNumSamples = 12;

    for (int mb = 0; mb < kNumSamples; mb++) {
        float time = iTime + (0.5 / 60.0) * (float(mb) + ran) / float(kNumSamples);

        float ft = fract(time);
        float it = floor(time);

        float sca = 0.5 * exp2(-ft * K2);
        vec2 p = sca * op;
        float px = sca * opx;

        // Generacion de rectangulos dorados
        vec3 col = vec3(0.0);
        float d = 1e20;
        float w = 1.0;
        vec2 q = p + vec2(3, -1) / sqrt(5.0);

        for (int i = 0; i < 20; i++) {
            float t = max(abs(q.x), abs(q.y)) - w;

            if (t < 0.0) {
                float id = float(i) + it * 4.0;
                col = vec3(0.7, 0.5, 0.4) + vec3(0.1, 0.2, 0.2) * cos(TAU * id / 12.0 + vec3(2.0, 2.5, 3.0));
                col += 0.04 * cos(TAU * p.x * 8.0 / w) * cos(TAU * p.y * 8.0 / w);
            }

            d = min(d, abs(t) - 0.001 * w);

            q -= w * vec2(PHI, 2.0 - PHI);
            q = vec2(-q.y, q.x);
            w *= PHI - 1.0;
        }
        col *= smoothstep(0.0, 1.5 * px, d - 0.001 * sca);

        // Dibujar espiral
        p /= (3.0 - PHI);
        px /= (3.0 - PHI);
        float ra = length(p);
        float an = atan(-p.x, p.y) / TAU;
        float id = round(log2(ra) / K2 - an);

        if (id > -1.5 || (id > -2.5 && an > 0.5 - ft)) {
            float d = abs(ra - exp2(K2 * (an + id)));
            col = mix(col, vec3(1.0), smoothstep(2.0 * px, 0.0, d - 0.005 * sca));
        }

        tot += col;
    }

    // Resolver motion blur
    tot /= float(kNumSamples);

    // Vignetting
    tot *= 1.2 - 0.25 * length(op);

    // Eliminacion de bandas de color mediante dithering
    tot += (1.0 / 255.0) * ran;

    // Salida final
    fragColor = vec4(tot, 1.0);
}

// Llamado principal
void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
