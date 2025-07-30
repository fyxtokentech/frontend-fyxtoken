/**
 * Clase Vector para operaciones 2D/3D.
 * Parámetros x, y, z: componentes numéricas.
 */
export class Vector {
  /**
   * Constructor del vector.
   * @param {number} [x=0]
   * @param {number} [y=0]
   * @param {number} [z=0]
   */
  constructor(x = 0, y = 0, z = 0) {
    this.set(x, y, z);
  }

  /**
   * Representación en cadena: Vector(x, y, z)
   * @returns {string}
   */
  toString() {
    return `Vector(${this.x}, ${this.y}, ${this.z})`;
  }

  /**
   * Asigna componentes: números, Vector o arreglo.
   * @param {number|Vector|Array} a
   * @param {number} [b]
   * @param {number} [c]
   * @returns {Vector}
   */
  set(a = 0, b = 0, c = 0) {
    if (a instanceof Vector) {
      this.x = a.x;
      this.y = a.y;
      this.z = a.z;
    } else if (Array.isArray(a)) {
      this.x = a[0] || 0;
      this.y = a[1] || 0;
      this.z = a[2] || 0;
    } else {
      this.x = a || 0;
      this.y = b || 0;
      this.z = c || 0;
    }
    return this;
  }

  /**
   * Crea copia del vector
   * @returns {Vector}
   */
  copy() {
    return new Vector(this.x, this.y, this.z);
  }

  /**
   * Suma: números, Vector o arreglo. Versión estática: Vector.add(v1,v2)
   * @param {number|Vector|Array} a
   * @param {number} [b]
   * @param {number} [c]
   * @returns {Vector}
   */
  add(a = 0, b = 0, c = 0) {
    let vx = 0;
    let vy = 0;
    let vz = 0;
    if (a instanceof Vector) {
      vx = a.x;
      vy = a.y;
      vz = a.z;
    } else if (Array.isArray(a)) {
      vx = a[0] || 0;
      vy = a[1] || 0;
      vz = a[2] || 0;
    } else {
      vx = a;
      vy = b;
      vz = c;
    }
    this.x += vx;
    this.y += vy;
    this.z += vz;
    return this;
  }

  /**
   * Versión estática de suma.
   * @param {Vector} v1
   * @param {Vector} v2
   * @returns {Vector}
   */
  static add(v1, v2) {
    return v1.copy().add(v2);
  }

  /**
   * Resta: números, Vector o arreglo. Versión estática: Vector.rem(v1,v2)
   * @param {number} [a]
   * @param {number} [b]
   * @param {number} [c]
   * @returns {Vector}
   */
  rem(a, b, c) {
    if (arguments.length === 0) {
      return this;
    }
    let rx, ry, rz;
    if (arguments.length === 1) {
      rx = ry = rz = a;
    } else if (arguments.length === 2) {
      rx = a;
      ry = b;
      rz = this.z;
    } else {
      rx = a;
      ry = b;
      rz = c;
    }
    this.x %= rx;
    this.y %= ry;
    this.z %= rz;
    return this;
  }

  /**
   * Versión estática de resta.
   * @param {Vector} v
   * @param {number} a
   * @param {number} b
   * @param {number} c
   * @returns {Vector}
   */
  static rem(v, a, b, c) {
    return v.copy().rem(a, b, c);
  }

  /**
   * Resta: números, Vector o arreglo. Versión estática: Vector.sub(v1,v2)
   * @param {number|Vector|Array} a
   * @param {number} [b]
   * @param {number} [c]
   * @returns {Vector}
   */
  sub(a = 0, b = 0, c = 0) {
    let vx, vy, vz;
    if (a instanceof Vector) {
      vx = a.x;
      vy = a.y;
      vz = a.z;
    } else if (Array.isArray(a)) {
      vx = a[0] || 0;
      vy = a[1] || 0;
      vz = a[2] || 0;
    } else {
      vx = a;
      vy = b;
      vz = c;
    }
    this.x -= vx;
    this.y -= vy;
    this.z -= vz;
    return this;
  }

  /**
   * Versión estática de resta.
   * @param {Vector} v1
   * @param {Vector} v2
   * @returns {Vector}
   */
  static sub(v1, v2) {
    return v1.copy().sub(v2);
  }

  /**
   * Multiplica: números, Vector o arreglo. Versión estática: Vector.mult(v1,v2)
   * @param {number|Vector|Array} a
   * @param {number} [b]
   * @param {number} [c]
   * @returns {Vector}
   */
  mult(a, b, c) {
    let mx, my, mz;
    if (arguments.length === 0) {
      return this;
    }
    if (a instanceof Vector) {
      mx = a.x;
      my = a.y;
      mz = a.z;
    } else if (Array.isArray(a)) {
      mx = a[0];
      my = a[1];
      mz = a[2];
    } else if (arguments.length === 1) {
      mx = my = mz = a;
    } else {
      mx = a;
      my = b;
      mz = c;
    }
    this.x *= mx;
    this.y *= my;
    this.z *= mz;
    return this;
  }

  /**
   * Versión estática de multiplicación.
   * @param {Vector} v
   * @param {number} a
   * @param {number} b
   * @param {number} c
   * @returns {Vector}
   */
  static mult(v, a, b, c) {
    return v.copy().mult(a, b, c);
  }

  /**
   * Divide: números, Vector o arreglo. Versión estática: Vector.div(v1,v2)
   * @param {number|Vector|Array} a
   * @param {number} [b]
   * @param {number} [c]
   * @returns {Vector}
   */
  div(a, b, c) {
    let dx, dy, dz;
    if (arguments.length === 0) {
      return this;
    }
    if (a instanceof Vector) {
      dx = a.x;
      dy = a.y;
      dz = a.z;
    } else if (Array.isArray(a)) {
      dx = a[0];
      dy = a[1];
      dz = a[2];
    } else if (arguments.length === 1) {
      dx = dy = dz = a;
    } else {
      dx = a;
      dy = b;
      dz = c;
    }
    this.x /= dx;
    this.y /= dy;
    this.z /= dz;
    return this;
  }

  /**
   * Versión estática de división.
   * @param {Vector} v
   * @param {number} a
   * @param {number} b
   * @param {number} c
   * @returns {Vector}
   */
  static div(v, a, b, c) {
    return v.copy().div(a, b, c);
  }

  /**
   * Magnitud del vector.
   * @returns {number}
   */
  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  /**
   * Versión estática de magnitud.
   * @param {number} x
   * @param {number} y
   * @param {number} [z=0]
   * @returns {number}
   */
  static mag(x, y, z = 0) {
    if (x instanceof Vector) return x.mag();
    return Math.sqrt(x * x + y * y + z * z);
  }

  /**
   * Magnitud al cuadrado del vector.
   * @returns {number}
   */
  magSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  /**
   * Producto escalar entre dos vectores.
   * @param {Vector} v
   * @returns {number}
   */
  dot(v) {
    if (arguments.length === 3) return this.x * v + this.y * arguments[1] + this.z * arguments[2];
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  /**
   * Versión estática de producto escalar.
   * @param {Vector} v1
   * @param {Vector} v2
   * @returns {number}
   */
  static dot(v1, v2) {
    return v1.dot(v2);
  }

  /**
   * Producto cruzado entre dos vectores.
   * @param {Vector} v
   * @returns {Vector}
   */
  cross(v) {
    let x1 = this.x;
    let y1 = this.y;
    let z1 = this.z;
    let x2 = v.x;
    let y2 = v.y;
    let z2 = v.z;
    return new Vector(y1 * z2 - z1 * y2, z1 * x2 - x1 * z2, x1 * y2 - y1 * x2);
  }

  /**
   * Versión estática de producto cruzado.
   * @param {Vector} v1
   * @param {Vector} v2
   * @returns {Vector}
   */
  static cross(v1, v2) {
    return v1.cross(v2);
  }

  /**
   * Distancia entre dos vectores.
   * @param {Vector} v
   * @returns {number}
   */
  dist(v) {
    return this.copy().sub(v).mag();
  }

  /**
   * Versión estática de distancia.
   * @param {Vector} v1
   * @param {Vector} v2
   * @returns {number}
   */
  static dist(v1, v2) {
    if (arguments.length === 4) {
      return Math.hypot(arguments[2] - v1, arguments[3] - v2);
    }
    return v1.dist(v2);
  }

  /**
   * Normaliza el vector.
   * @returns {Vector}
   */
  normalize() {
    let m = this.mag();
    return m !== 0 ? this.div(m) : this;
  }

  /**
   * Versión estática de normalización.
   * @param {Vector} v
   * @returns {Vector}
   */
  static normalize(v) {
    return v.copy().normalize();
  }

  /**
   * Limita la magnitud del vector.
   * @param {number} max
   * @returns {Vector}
   */
  limit(max) {
    if (this.mag() > max) this.setMag(max);
    return this;
  }

  /**
   * Versión estática de limitación.
   * @param {Vector} v
   * @param {number} max
   * @returns {Vector}
   */
  static limit(v, max) {
    return v.copy().limit(max);
  }

  /**
   * Establece la magnitud del vector.
   * @param {number} len
   * @returns {Vector}
   */
  setMag(len) {
    return this.normalize().mult(len);
  }

  /**
   * Versión estática de establecimiento de magnitud.
   * @param {Vector} v
   * @param {number} len
   * @returns {Vector}
   */
  static setMag(v, len) {
    return v.copy().setMag(len);
  }

  /**
   * Dirección del vector en grados.
   * @returns {number}
   */
  heading() {
    return Math.atan2(this.y, this.x);
  }

  /**
   * Versión estática de dirección.
   * @param {Vector} v
   * @returns {number}
   */
  static heading(v) {
    return v.heading();
  }

  /**
   * Establece la dirección del vector en grados.
   * @param {number} angle
   * @returns {Vector}
   */
  setHeading(angle) {
    let m = this.mag();
    this.x = Math.cos(angle) * m;
    this.y = Math.sin(angle) * m;
    return this;
  }

  /**
   * Rota el vector en grados.
   * @param {number} angle
   * @returns {Vector}
   */
  rotate(angle) {
    let h = this.heading() + angle;
    return this.setHeading(h);
  }

  /**
   * Versión estática de rotación.
   * @param {Vector} v
   * @param {number} angle
   * @returns {Vector}
   */
  static rotate(v, angle) {
    return v.copy().rotate(angle);
  }

  /**
   * Ángulo entre dos vectores.
   * @param {Vector} v
   * @returns {number}
   */
  angleBetween(v) {
    let dot = this.dot(v) / (this.mag() * v.mag());
    dot = Math.max(-1, Math.min(1, dot));
    let crossZ = this.x * v.y - this.y * v.x;
    return Math.atan2(crossZ, dot);
  }

  /**
   * Versión estática de ángulo entre vectores.
   * @param {Vector} v1
   * @param {Vector} v2
   * @returns {number}
   */
  static angleBetween(v1, v2) {
    return v1.angleBetween(v2);
  }

  /**
   * Interpola entre dos vectores.
   * @param {Vector} v
   * @param {number} amt
   * @returns {Vector}
   */
  lerp(v, amt) {
    this.x += (v.x - this.x) * amt;
    this.y += (v.y - this.y) * amt;
    this.z += (v.z - this.z) * amt;
    return this;
  }

  /**
   * Versión estática de interpolación.
   * @param {Vector} v0
   * @param {Vector} v1
   * @param {number} amt
   * @returns {Vector}
   */
  static lerp(v0, v1, amt) {
    return v0.copy().lerp(v1, amt);
  }

  /**
   * Interpola entre dos vectores utilizando esferas.
   * @param {Vector} v
   * @param {number} amt
   * @returns {Vector}
   */
  slerp(v, amt) {
    let mag0 = this.mag();
    let mag1 = v.mag();
    let u0 = this.copy().normalize();
    let u1 = v.copy().normalize();
    let dot = Math.max(-1, Math.min(1, u0.dot(u1)));
    let theta = Math.acos(dot);
    let sinT = Math.sin(theta);
    if (sinT < 1e-6) {
      return this.lerp(v, amt);
    }
    let f0 = Math.sin((1 - amt) * theta) / sinT;
    let f1 = Math.sin(amt * theta) / sinT;
    let result = u0.mult(f0).add(u1.mult(f1)).setMag(this.lerp(mag0, mag1, amt));
    this.x = result.x;
    this.y = result.y;
    this.z = result.z;
    return this;
  }

  /**
   * Versión estática de interpolación esférica.
   * @param {Vector} v0
   * @param {Vector} v1
   * @param {number} amt
   * @returns {Vector}
   */
  static slerp(v0, v1, amt) {
    return v0.copy().slerp(v1, amt);
  }

  /**
   * Refleja el vector en un plano.
   * @param {Vector} n
   * @returns {Vector}
   */
  reflect(n) {
    // r = v - 2*(v·n)*n
    let d = this.dot(n) * 2;
    return this.sub(n.copy().mult(d));
  }

  /**
   * Versión estática de reflexión.
   * @param {Vector} v
   * @param {Vector} n
   * @returns {Vector}
   */
  static reflect(v, n) {
    return v.copy().reflect(n);
  }

  /**
   * Convierte el vector a un arreglo.
   * @returns {Array}
   */
  array() {
    return [this.x, this.y, this.z];
  }

  /**
   * Comprueba si dos vectores son iguales.
   * @param {number} a
   * @param {number} b
   * @param {number} c
   * @returns {boolean}
   */
  equals(a, b, c) {
    if (arguments.length === 1 && a instanceof Vector) return this.x === a.x && this.y === a.y && this.z === a.z;
    let vx = a;
    let vy = b || 0;
    let vz = c || 0;
    return this.x === vx && this.y === vy && this.z === vz;
  }

  /**
   * Versión estática de igualdad.
   * @param {Vector} v0
   * @param {Vector} v1
   * @returns {boolean}
   */
  static equals(v0, v1) {
    return v0.equals(v1);
  }

  /**
   * Crea un vector a partir de un ángulo.
   * @param {number} angle
   * @returns {Vector}
   */
  static fromAngle(angle) {
    return new Vector(Math.cos(angle), Math.sin(angle), 0);
  }

  /**
   * Crea un vector a partir de dos ángulos.
   * @param {number} theta
   * @param {number} phi
   * @returns {Vector}
   */
  static fromAngles(theta, phi) {
    return new Vector(
      Math.cos(theta) * Math.sin(phi),
      Math.sin(theta) * Math.sin(phi),
      Math.cos(phi)
    );
  }

  /**
   * Crea un vector aleatorio en 2D.
   * @returns {Vector}
   */
  static random2D() {
    let a = Math.random() * Math.PI * 2;
    return Vector.fromAngle(a);
  }

  /**
   * Crea un vector aleatorio en 3D.
   * @returns {Vector}
   */
  static random3D() {
    let u = Math.random();
    let v = Math.random();
    let theta = 2 * Math.PI * u;
    let phi = Math.acos(2 * v - 1);
    return Vector.fromAngles(theta, phi);
  }
}