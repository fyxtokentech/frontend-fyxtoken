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

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // Normalized pixel coordinates
    vec2 p = 6.0 * fragCoord / iResolution.xy;
    
    // Pattern
    float f = sin(p.x + sin(2.0 * p.y + iTime)) +
              sin(length(p) + iTime) +
              0.5 * sin(p.x * 2.5 + iTime);
    
    // Color
    vec3 col = 0.7 + 0.3 * cos(f + vec3(0.0, 2.1, 4.2));

    // Output to screen
    fragColor = vec4(col, 1.0);
}

// Llamado principal
void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
