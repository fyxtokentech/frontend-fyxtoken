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

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 norm = fragCoord.xy / r;
    vec2 pos = (norm - vec2(0.5, 0.5)) * vec2(3.6, 2.0);
    
    float radius = sqrt(dot(pos, pos));
    radius *= 1.0 + 0.4 * sin(t * 0.12);
    
    float brightness = 1.0;
    
    if (radius < 1.0) {
        norm = vec2(1.0, 1.0) - norm;
        norm *= sqrt(radius);
        brightness -= pow(radius, 10.0);
        brightness *= 0.9 + 0.2 * sin(t * 3.1);
    }

    vec2 uv = norm;
    uv.x += 0.6 * sin(t + norm.y * 3.0);
    uv.y += 0.6 * sin(t + norm.x * 3.0);

    fragColor = vec4(uv, 0.5 + 0.5 * sin(t * 1.228), 1.0);
    
    uv.x += 0.2 * sin(t + norm.y * 29.0);
    uv.y += 0.2 * sin(t + norm.x * 29.0);
    fragColor += 0.3 * vec4(uv, 0.5 + 0.5 * sin(t), 1.0);
    
    uv.x += 0.2 * sin(t * 5.0 + norm.y * 129.0);
    uv.y += 0.2 * sin(t * 5.0 + norm.x * 129.0);
    fragColor += max(uv.x * uv.y - (sin(t * 0.04) + 1.0) * 0.1, 0.0);

    fragColor -= 0.7 * radius;
    fragColor *= brightness;
    fragColor.b = max(fragColor.b, -0.2);
    fragColor.b += fragColor.g * 0.4;
    
    fragColor = max(fragColor, vec4(0.0, 0.0, 0.0, 0.0));
    
    if (radius > 1.0) {
        float angle = atan(pos.y, pos.x);
        float halo = 0.2 * pow(0.5, radius * radius + sin(angle * 12.0 + t));
        halo += 0.2 * pow(0.5, radius * radius + sin(angle * 8.0 - t * 1.3));
        halo += 0.2 * pow(0.5, radius * radius + sin(angle * 18.0 + t * 1.2));
        
        vec4 col = vec4(halo - 0.1, halo - 0.08, halo, 0.0);
        fragColor += max(col, vec4(0.0, 0.0, 0.0, 0.0));
    }
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
