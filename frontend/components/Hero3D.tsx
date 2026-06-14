"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function RoyalDress() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.35;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Skirt / poshak silhouette */}
      <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.4, 2.2, 48, 1, true]} />
        <meshStandardMaterial
          color="#3d0f12"
          emissive="#d4af37"
          emissiveIntensity={0.15}
          metalness={0.6}
          roughness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Bodice */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.7, 1.1, 32]} />
        <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Golden borders */}
      <mesh position={[0, 0.45, 0]}>
        <torusGeometry args={[1.05, 0.05, 16, 64]} />
        <meshStandardMaterial color="#f4e4ba" emissive="#d4af37" emissiveIntensity={0.6} metalness={1} roughness={0.1} />
      </mesh>
      <mesh position={[0, -1.55, 0]}>
        <torusGeometry args={[1.35, 0.06, 16, 64]} />
        <meshStandardMaterial color="#f4e4ba" emissive="#d4af37" emissiveIntensity={0.6} metalness={1} roughness={0.1} />
      </mesh>

      {/* Odhni / dupatta swirl */}
      <mesh position={[0.4, 1.6, -0.3]} rotation={[0.6, 0.3, 0.2]}>
        <torusGeometry args={[0.9, 0.18, 16, 100, Math.PI * 1.4]} />
        <meshStandardMaterial color="#9c1f2e" metalness={0.4} roughness={0.4} />
      </mesh>
    </group>
  );
}

function ParticleField() {
  const count = 400;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    return arr;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#f4e4ba" size={0.035} sizeAttenuation transparent opacity={0.6} />
    </points>
  );
}

function CameraDrift() {
  useFrame((state) => {
    state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.6;
    state.camera.position.y = 0.4 + Math.cos(state.clock.elapsedTime * 0.1) * 0.2;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Hero3D() {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 5.5], fov: 45 }}
      gl={{ antialias: true }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={["#0a0807"]} />
      <ambientLight intensity={0.35} color="#f4e4ba" />
      <pointLight position={[4, 4, 4]} intensity={120} color="#f4e4ba" />
      <pointLight position={[-4, -2, -4]} intensity={60} color="#9c1f2e" />
      <spotLight
        position={[0, 6, 2]}
        angle={0.5}
        penumbra={0.8}
        intensity={200}
        color="#d4af37"
      />

      <ParticleField />
      <RoyalDress />
      <CameraDrift />
    </Canvas>
  );
}
