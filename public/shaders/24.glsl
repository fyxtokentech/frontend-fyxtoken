// --- VERTEX SHADER ---
varying vec2 vUv;

void main() {
  vUv = uv;              // Pasamos las coordenadas UV
  gl_Position = vec4(position, 1.0);
}


// --- FRAGMENT SHADER ---
// Si estás en WebGL ES, podrías necesitar:
// #ifdef GL_ES
// precision mediump float;
// #endif

// Mapear iTime -> t y iResolution.xy -> r
#define t iTime
#define r iResolution.xy

// Uniforms que usas en el shader
uniform float iTime;
uniform float iTimeDelta;   // si tu shader lo necesita
uniform vec2 iResolution;
uniform vec4 iMouse;        // si usas el mouse
uniform sampler2D iChannel0; // y si tu shader usa texturas
// Si usas más canales, decláralos igualmente:
// uniform sampler2D iChannel1; 
// ...

varying vec2 vUv;

//--------------------------------------------------------------------------------
// Aquí empieza la adaptación de tu shader “another synthwave sunset thing”
//--------------------------------------------------------------------------------

//#define AA 2
//#define VAPORWAVE
//#define stereo 1. // -1. for cross-eyed (defaults to parallel view)
#define speed 10.
#define wave_thing
//#define city

//#define disable_sound_texture_sampling  // <- controla si usas iChannel0 como audio

#ifndef disable_sound_texture_sampling
    #undef speed
    #define speed 5.
#endif

#define audio_vibration_amplitude .125

float jTime;

#ifdef disable_sound_texture_sampling
#define textureMirror(a, b) vec4(0.)
#else
vec4 textureMirror(sampler2D tex, vec2 c){
    vec2 cf = fract(c);
    // “Mirror” wrap manual:
    return texture(tex, mix(cf, 1.0 - cf, mod(floor(c), 2.0)));
}
#endif

float amp(vec2 p){
    return smoothstep(1., 8., abs(p.x));
}

float pow512(float a){
    a *= a; // ^2
    a *= a; // ^4
    a *= a; // ^8
    a *= a; // ^16
    a *= a; // ^32
    a *= a; // ^64
    a *= a; // ^128
    a *= a; // ^256
    return a * a; // ^512
}

float pow1d5(float a){
    return a * sqrt(a); // a^(1.5)
}

// pseudo-hash para 2D
float hash21(vec2 co){
    return fract(sin(dot(co, vec2(1.9898, 7.233))) * 45758.5433);
}

// “wave_thing” y sampling
float hash(vec2 uv){
    float a = amp(uv);
#ifdef wave_thing
    float w = (a > 0. ? (1. - 0.4 * pow512(0.51 + 0.49 * sin((0.02*(uv.y + 0.5*uv.x) - jTime)*2.))) : 0.);
#else
    float w = 1.;
#endif
    float base = (a > 0. ?
                  a * pow1d5(
                    // si quisieras sampling real de audio:
                    // texture(iChannel0, uv / iChannelResolution[0].xy).r
                    hash21(uv)
                  ) * w
                  : 0.)
                 - textureMirror(iChannel0, vec2((uv.x*29. + uv.y)*0.03125, 1.)).x
                   * audio_vibration_amplitude;
    return base;
}

float edgeMin(float dx, vec2 da, vec2 db, vec2 uv){
    uv.x += 5.;
    // un pseudo-hash con fract
    vec3 c = fract((round(vec3(uv, uv.x+uv.y))) * (vec3(0., 1., 2.)+0.61803398875));
    float a1 = textureMirror(iChannel0, vec2(c.y, 0.)).x > .6 ? .15 : 1.;
    float a2 = textureMirror(iChannel0, vec2(c.x, 0.)).x > .6 ? .15 : 1.;
    float a3 = textureMirror(iChannel0, vec2(c.z, 0.)).x > .6 ? .15 : 1.;

    return min(
             min((1.-dx)*db.y*a3, da.x*a2),
             da.y*a1
           );
}

// “trinoise” 2D
vec2 trinoise(vec2 uv){
    const float sq = sqrt(3./2.);
    uv.x *= sq;
    uv.y -= 0.5*uv.x;
    vec2 d = fract(uv);
    uv -= d;

    bool c = dot(d, vec2(1)) > 1.;

    vec2 dd = 1. - d;
    vec2 da = c ? dd : d;
    vec2 db = c ? d : dd;

    float nn  = hash(uv + float(c));
    float n2  = hash(uv + vec2(1,0));
    float n3  = hash(uv + vec2(0,1));

    float nmid = mix(n2, n3, d.y);
    float ns   = mix(nn, c ? n2 : n3, da.y);
    float dx   = da.x / db.y;
    return vec2(mix(ns, nmid, dx), edgeMin(dx, da, db, uv + d));
}

// map y grad
vec2 map(vec3 p){
    vec2 n = trinoise(p.xz);
    return vec2(p.y - 2.0*n.x, n.y);
}

vec3 grad(vec3 p){
    const vec2 e = vec2(0.005, 0.);
    float a = map(p).x;
    return vec3(
        map(p + e.xyy).x - a,
        map(p + e.yxy).x - a,
        map(p + e.yyx).x - a
    ) / e.x;
}

// Intersección con la “superficie” iterando
vec2 intersect(vec3 ro, vec3 rd){
    float d = 0., h=0.;
    for(int i=0; i<500; i++){ // sube o baja para calidad
        vec3 p = ro + d*rd;
        vec2 s = map(p);
        h = s.x;
        d += h * 0.5;
        if(abs(h) < 0.003*d)
            return vec2(d, s.y);
        if(d > 150. || p.y > 2.) break;
    }
    return vec2(-1.);
}

// Añadir “sol”
void addsun(vec3 rd, vec3 ld, inout vec3 col){
    float sun = smoothstep(0.21, 0.2, distance(rd, ld));
    if(sun > 0.){
        float yd = (rd.y - ld.y);
        float a = sin(3.1 * exp(-yd*14.));
        sun *= smoothstep(-0.8, 0., a);
        col = mix(col, vec3(1.,0.8,0.4)*0.75, sun);
    }
}

// Generar “estrellas” en un sky
float starnoise(vec3 rd){
    float c=0.;
    vec3 p = normalize(rd)*300.;
    for(float i=0.; i<4.; i++){
        vec3 q = fract(p)-0.5;
        vec3 id = floor(p);
        float c2 = smoothstep(0.5,0.,length(q));
        c2 *= step(hash21(id.xz / id.y),0.06 - i*i*0.005);
        c += c2;
        // “random transform”
        p = p*0.6 + 0.5*p*mat3(
              3./5., 0., 4./5.,
              0.,    1., 0.,
              -4./5.,0., 3./5.
            );
    }
    c *= c;
    float g = dot(sin(rd*10.512), cos(rd.yzx*10.512));
    c *= smoothstep(-3.14, -0.9, g)*0.5 + 0.5*smoothstep(-0.3,1.,g);
    return c*c;
}

vec3 gsky(vec3 rd, vec3 ld, bool mask){
    float haze = exp2(-5.*(abs(rd.y) - 0.2*dot(rd, ld)));
    //float st = mask? pow512(texture(iChannel0, ...).r)*(1.-min(haze,1.)) : 0.;
    float st = mask ? starnoise(rd)*(1.-min(haze,1.)) : 0.;

    vec3 back = vec3(0.4,0.1,0.7);
    back *= (1. - 0.5*
      textureMirror(iChannel0, vec2(0.5 + 0.05*rd.x/rd.y,0.)).x
      * exp2(-0.1*abs(length(rd.xz)/rd.y))
      * max(sign(rd.y),0.)
    );

    // #ifdef city -> omitido por brevedad
    vec3 col = clamp(mix(back, vec3(0.7,0.1,0.4), haze) + st, 0.,1.);
    if(mask) addsun(rd, ld, col);
    return col;
}

//--------------------------------------------------------------------------------
// mainImage adaptado al modelo
//--------------------------------------------------------------------------------
void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // Se inicializa a negro
    fragColor = vec4(0.0);

    // (AA = antialiasing manual; en tu ejemplo no lo usas, así que omitimos #define AA)
    // Podrías adaptarlo si quieres samplear en bucles.

    // sin AA, hacemos 1 sample
    vec2 uv = (2.0*fragCoord - r)/r.y;

    const float shutter_speed = 0.25;
    float dt = fract(hash21(fragCoord) + iTime) * shutter_speed;

    // jTime combina iTime con iTimeDelta (si la usas)
    jTime = mod(iTime - dt*iTimeDelta, 4000.);

    vec3 ro = vec3(0., 1., (-20000. + jTime*speed));

    vec3 rd = normalize(vec3(uv, 4./3.));

    // intersect
    vec2 it = intersect(ro, rd);
    float d = it.x;

    vec3 ld = normalize(vec3(0., 0.125 + 0.05*sin(0.1*jTime), 1.));
    vec3 fog = (d>0.) ? exp2(-d*vec3(0.14,0.1,0.28)) : vec3(0.);
    vec3 sky = gsky(rd, ld, (d<0.));  // si no hay intersección, pinta cielo

    // si se intersecta, calculamos normal
    vec3 col;
    if(d > 0.){
        // p = punto en la “superficie”
        vec3 p = ro + d*rd;
        vec3 n = normalize(grad(p));
        float diff = dot(n, ld) + 0.1*n.y;
        col = vec3(0.1,0.11,0.18)*diff;

        // reflejo
        vec3 rfd = reflect(rd, n);
        vec3 rfcol = gsky(rfd, ld, true);

        col = mix(col, rfcol, 0.05 + 0.95*pow(max(1.+dot(rd,n),0.),5.));
        col = mix(sky, col, fog);
    }
    else {
        // no intersección => solo cielo
        d = 1e6;
        col = sky;
    }

    d = min(d, 10.);
    // alpha
    float alpha = (d<0.?0.:0.1+exp2(-d));
    fragColor = vec4(clamp(col, 0.,1.), alpha);
}

//--------------------------------------------------------------------------------
// main() que llama a mainImage
//--------------------------------------------------------------------------------
void main() {
  mainImage(gl_FragColor, gl_FragCoord.xy);
}
