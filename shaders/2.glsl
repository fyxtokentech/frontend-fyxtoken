// --- VERTEX SHADER ---
varying vec2 vUv;

void main() {
    // Pasar las coordenadas UV al fragment shader
    vUv = uv;

    // Transformación estándar de posición
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}



// --- FRAGMENT SHADER ---
#define t iTime
#define r iResolution.xy

uniform float iTime;
uniform vec2 iResolution;
varying vec2 vUv;

// Función de paleta de colores basada en https://iquilezles.org/articles/palettes/
vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);

    return a + b * cos(6.28318 * (c * t + d));
}

// Función mainImage que genera el efecto visual
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord * 2.0 - r) / r.y;
    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0);
    
    for (float i = 0.0; i < 4.0; i++) {
        uv = fract(uv * 1.5) - 0.5;

        float d = length(uv) * exp(-length(uv0));

        vec3 col = palette(length(uv0) + i * 0.4 + t * 0.4);

        d = sin(d * 8.0 + t) / 8.0;
        d = abs(d);

        d = pow(0.01 / d, 1.2);

        finalColor += col * d;
    }
    
    fragColor = vec4(finalColor, 1.0);
}

// Función main que invoca mainImage en Three.js
void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
