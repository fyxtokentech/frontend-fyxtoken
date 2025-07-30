export function PaintBG() {
  return new (class {
    constructor() {
      this.parts = [];
    }

    solid(color) {
      this.parts.push(solid(color));
      return this;
    }

    linearGradient({ angle, colors }) {
      this.parts.push(linearGradient({ angle, colors }));
      return this;
    }

    radialGradient({ colors, radius, x, y }) {
      this.parts.push(radialGradient({ colors, radius, x, y }));
      return this;
    }

    circleGradient({ color, radius, x, y }) {
      this.parts.push(circleGradient({ color, radius, x, y }));
      return this;
    }

    holeCircleGradient({ color, radius, x, y }) {
      this.parts.push(holeCircleGradient({ color, radius, x, y }));
      return this;
    }

    ringGradient({ color, radius, holeRadius, x, y }) {
      this.parts.push(ringGradient({ color, radius, holeRadius, x, y }));
      return this;
    }

    url(url) {
      this.parts.push(url(url));
      return this;
    }

    end() {
      return this.parts.join(", ");
    }
  })();
}

/**
 * Convierte un porcentaje (0-100) en expresión CSS relativa al viewport.
 */
export function toViewportPercent(n) {
  return `calc(${n / 100} * max(100dvw, 100dvh))`;
}

export function solid(color) {
  return `linear-gradient(0, ${color}, ${color})`;
}

/**
 * Genera un gradiente lineal CSS.
 */
export function linearGradient({ angle, colors }) {
  return `linear-gradient(${angle}, ${colors.join(",")})`;
}

export function url(url) {
  return `url('${url}')`;
}

/**
 * Genera un gradiente radial CSS.
 */
export function radialGradient({
  colors = ["blue", "red"],
  radius = "500px",
  x = "center",
  y = "center",
}) {
  return `radial-gradient(circle ${radius} at ${x} ${y}, ${colors.join(",")})`;
}

/**
 * Genera un gradiente de círculo sólido CSS.
 */
export function circleGradient({
  color = "blue",
  radius = "500px",
  x = "center",
  y = "center",
}) {
  return `radial-gradient(circle ${radius} at ${x} ${y}, ${color} 100%, transparent 100%)`;
}

/**
 * Genera un gradiente de círculo con agujero transparente CSS.
 */
export function holeCircleGradient({
  color = "blue",
  radius = "500px",
  x = "center",
  y = "center",
}) {
  return `radial-gradient(circle ${radius} at ${x} ${y}, transparent 100%, ${color} 100%)`;
}

/**
 * Genera un gradiente de anillo CSS.
 */
export function ringGradient({
  color = "blue",
  radius = "500px",
  holeRadius = "400px",
  x = "center",
  y = "center",
}) {
  return `radial-gradient(circle ${radius} at ${x} ${y}, transparent ${holeRadius}, ${color} ${holeRadius}, ${color} 100%, transparent 100%)`;
}
