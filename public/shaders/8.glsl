// --- VERTEX SHADER ---

varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}

// --- FRAGMENT SHADER ---

#define Rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))  
#define antialiasing(n) n / min(iResolution.y, iResolution.x)  
#define S(d, b) smoothstep(antialiasing(1.5), -antialiasing(1.5), d - b)  
#define B(p, s) max(abs(p).x - s.x, abs(p).y - s.y)  

uniform float iTime;       
uniform vec2 iResolution;  

varying vec2 vUv;  

float random(vec2 p) {
    return fract(sin(dot(p.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float hexagon(vec2 p, float animate) {
    p *= Rot(radians(-30.0 * iTime) * animate);
    float size = 0.1;
    float d = B(p, vec2(size - 0.02, 0.1));
    p.x = abs(p.x) - size;
    p.y = abs(p.y) - size * 0.35;
    float a = radians(-120.0);
    d = max(-dot(p, vec2(cos(a), sin(a))), d);
    return abs(d) - 0.003;
}

vec3 graphicItem1Layer(vec2 p, vec3 col) {
    p.x = abs(p.x) - 0.3;
    p.y -= iTime * 0.15;
    p *= 2.1;
    vec2 id = floor(p);
    vec2 gr = fract(p) - 0.5;

    float n = random(id);
    gr.x += sin(n * 10.0) * 0.1;
    gr.y += sin(n * 10.0) * 0.1 + mix(0.0, 1.0, step(0.9, n));
    gr *= Rot(n * 2.0);
    gr *= clamp(n * 2.5, 0.85, 2.5);

    float d = hexagon(gr, 1.0);
    col = mix(col, vec3(0.7), S(d, 0.0));

    return col;
}

vec3 drawGraphics(vec2 p, vec3 col) {
    col = graphicItem1Layer(p, col);
    return col;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.0);
    col = drawGraphics(p, col);

    fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}

