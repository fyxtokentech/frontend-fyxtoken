// GradientBackground.jsx
import React from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

// Vertex shader: pasa las coordenadas UV al fragment shader
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform vec3 topColor;
  uniform vec3 bottomColor;

  void main() {
    // Mezcla entre bottomColor y topColor según la coordenada Y de las UV
    vec3 color = mix(bottomColor, topColor, vUv.y);
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function GradientBackground() {
  // Definimos uniformes para los colores del degradado
  const uniforms = {
    topColor: { value: new THREE.Color('#7ae2ff') },    // color más claro (arriba)
    bottomColor: { value: new THREE.Color('#1d4e89') } // color más oscuro (abajo)
  };

  return (
    <Canvas
      // Para que el plano rellene toda la pantalla, podemos usar una cámara ortográfica
      orthographic
      camera={{ zoom: 100 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      {/* Eliminamos efectos de iluminación y sombras */}
      <ambientLight intensity={0} />
      <directionalLight intensity={0} />
      
      {/* Malla que ocupa toda la vista y aplica nuestro shader */}
      <mesh>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          // Evita que los lados del plano se vean afectados por la luz
          side={THREE.DoubleSide}
        />
      </mesh>
    </Canvas>
  );
}
