export const idR = (prefix="R")=>Math.random().toString(36).replace("0.", `${prefix}-`);

export function clamp(value, min, max) {
  return Math.min(Math.max(+value, min), max);
}

export function lerp(vi, vf, t) {
  return vi + (vf - vi) * t;
}

export function map(value, inMin, inMax, outMin, outMax) {
  return lerp(outMin, outMax, clamp((value - inMin) / (inMax - inMin), 0, 1));
}

// Perlin noise implementation
const _PERLIN_SIZE = 4095;
let _perlin = [];
let _perlin_octaves = 4;
let _perlin_amp_falloff = 0.5;

// Seedable PRNG (Mulberry32)
function _mulberry32(a) {
  return function() {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Sets the seed for noise(), producing repeatable patterns
 */
export function noiseSeed(seed) {
  const rand = _mulberry32(seed);
  _perlin = new Array(_PERLIN_SIZE + 1).fill(0).map(() => rand());
}

/**
 * Configures the number of octaves and falloff for noise()
 */
export function noiseDetail(octaves, falloff) {
  _perlin_octaves = octaves;
  _perlin_amp_falloff = falloff;
}

/**
 * Generates Perlin noise for the given x (1D)
 */
export function noise(x) {
  if (_perlin.length === 0) {
    _perlin = new Array(_PERLIN_SIZE + 1).fill(0).map(() => Math.random());
  }
  if (x < 0) x = -x;
  let xi = Math.floor(x);
  let xf = x - xi;
  let result = 0;
  let amplitude = 1;
  for (let o = 0; o < _perlin_octaves; o++) {
    const of = xi & _PERLIN_SIZE;
    const v1 = _perlin[of];
    const v2 = _perlin[of + 1];
    const lerpVal = lerp(v1, v2, xf);
    result += lerpVal * amplitude;
    amplitude *= _perlin_amp_falloff;
    xi <<= 1;
    xf *= 2;
    if (xf >= 1) {
      xi++;
      xf--;
    }
  }
  return result;
}
