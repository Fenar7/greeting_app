'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

const petalRings = [
  { count: 7, radius: 0.58, length: 0.96, color: '#F0C8BD', tilt: -0.15 },
  { count: 10, radius: 0.83, length: 1.08, color: '#DEA69F', tilt: 0.07 },
  { count: 13, radius: 1.08, length: 1.23, color: '#C78B8C', tilt: 0.21 },
];

function SculptedRose({ opened }) {
  const flower = useRef();
  const petals = useRef([]);
  const progress = useRef(0);
  useFrame(({ clock }, delta) => {
    progress.current = THREE.MathUtils.damp(progress.current, opened ? 1 : 0, 2.1, delta);
    const p = progress.current;
    if (flower.current) {
      flower.current.rotation.y = Math.sin(clock.elapsedTime * 0.21) * 0.19;
      flower.current.rotation.z = Math.sin(clock.elapsedTime * 0.27) * 0.035;
      flower.current.scale.setScalar(0.88 + p * 0.12);
    }
    for (const entry of petals.current) {
      if (!entry) continue;
      const { mesh, ringIndex, angle, radius } = entry;
      if (!mesh) continue;
      mesh.position.y = THREE.MathUtils.lerp(radius * 0.56, radius * 0.96, p);
      mesh.rotation.x = THREE.MathUtils.lerp(0.68, -0.44 - ringIndex * 0.15, p);
      mesh.rotation.y = Math.sin(angle * 3) * 0.055;
    }
  });

  return (
    <group ref={flower} rotation={[-0.18, 0.06, 0]}>
      <ambientLight intensity={1.15} />
      <directionalLight position={[-3, 4, 5]} color="#FFF4E4" intensity={3.1} />
      <pointLight position={[2, -2, 3]} color="#CB748B" intensity={24} distance={8} />
      {petalRings.map((ring, ringIndex) =>
        Array.from({ length: ring.count }, (_, i) => {
          const angle = (i / ring.count) * Math.PI * 2 + (ringIndex % 2) * 0.21;
          const idx = petalRings.slice(0, ringIndex).reduce((acc, r) => acc + r.count, 0) + i;
          return (
            <group key={idx} rotation={[0, 0, angle]}>
              <mesh
                ref={(mesh) => { petals.current[idx] = mesh ? { mesh, ringIndex, angle, radius: ring.radius } : null; }}
                position={[0, ring.radius * 0.56, 0]}
                rotation={[ring.tilt + 0.68, 0, 0]}
                scale={[0.46 + ringIndex * 0.04, ring.length, 0.15]}
              >
                <sphereGeometry args={[1, 18, 14]} />
                <meshStandardMaterial color={ring.color} roughness={0.72} metalness={0.02} side={THREE.DoubleSide} />
              </mesh>
            </group>
          );
        })
      )}
      <mesh position={[0, 0, 0.42]}>
        <sphereGeometry args={[0.32, 24, 20]} />
        <meshStandardMaterial color="#F8D8AE" roughness={0.55} metalness={0.2} />
      </mesh>
      <mesh rotation={[0, 0.2, 0]} position={[0, 0, -0.25]}>
        <sphereGeometry args={[0.53, 20, 16]} />
        <meshStandardMaterial color="#A86A71" roughness={0.9} />
      </mesh>
    </group>
  );
}

export default function BloomFlower({ opened = false }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      camera={{ position: [0, 0, 6.7], fov: 46 }}
      fallback={<div className="bloom-fallback" aria-hidden="true">✿</div>}
    >
      <SculptedRose opened={opened} />
    </Canvas>
  );
}
