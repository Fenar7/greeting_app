'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function Asterism() {
  const points = useRef();
  const geometry = useMemo(() => {
    const count = 1150;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    // Deterministic pseudo-random stars keep the composition consistent.
    let seed = 20261122;
    const random = () => {
      seed = (1664525 * seed + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    for (let i = 0; i < count; i++) {
      const radius = Math.sqrt(random()) * 10;
      const angle = random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius * 0.68;
      positions[i * 3 + 2] = (random() - 0.5) * 7;
      const tint = random();
      colors[i * 3] = 0.76 + tint * 0.2;
      colors[i * 3 + 1] = 0.55 + tint * 0.32;
      colors[i * 3 + 2] = 0.55 + tint * 0.27;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  useFrame(({ clock, pointer }, delta) => {
    if (!points.current) return;
    points.current.rotation.z += Math.min(delta, 0.05) * 0.0035;
    points.current.rotation.y = THREE.MathUtils.damp(points.current.rotation.y, pointer.x * 0.11, 1.2, delta);
    points.current.position.y = Math.sin(clock.elapsedTime * 0.15) * 0.08;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial size={0.026} vertexColors transparent opacity={0.76} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function OrbitalRings() {
  const ring = useRef();
  useFrame(({ clock }) => {
    if (!ring.current) return;
    ring.current.rotation.z = clock.elapsedTime * 0.012;
    ring.current.rotation.y = Math.sin(clock.elapsedTime * 0.09) * 0.12;
  });
  return (
    <group ref={ring} rotation={[0.36, 0, -0.15]}>
      {[3.2, 3.55, 3.94].map((radius, i) => (
        <mesh key={radius} rotation={[0.05 * i, 0, -0.12 * i]}>
          <torusGeometry args={[radius, 0.0045, 3, 220]} />
          <meshBasicMaterial color={i % 2 ? '#B89586' : '#B79A6C'} transparent opacity={0.14 - i * 0.024} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

export default function CelestialCanvas() {
  return (
    <Canvas
      className="cosmos-canvas"
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
      camera={{ position: [0, 0, 11], fov: 54 }}
      fallback={<div className="cosmos-fallback" aria-hidden="true" />}
    >
      <Asterism />
      <OrbitalRings />
    </Canvas>
  );
}
