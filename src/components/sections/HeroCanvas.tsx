'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Center } from '@react-three/drei';
import * as THREE from 'three';
import { COLORS } from '@/lib/constants';
import { Suspense } from 'react';

function VibeLogo3D({ visible }: { visible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const idleRotation = useRef(0);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    idleRotation.current += delta * 0.15;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      Math.sin(idleRotation.current) * 0.15,
      0.05
    );
    const target = visible ? 1 : 0.01;
    groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, target, 0.04);
    groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, target, 0.04);
    groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, target, 0.04);
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 0.25 + Math.sin(idleRotation.current * 3) * 0.1;
    }
  });

  return (
    <Center>
      <group ref={groupRef} scale={0.01}>
        <Text
          fontSize={2.2}
          letterSpacing={0.15}
          font="/fonts/PlayfairDisplay-Bold.woff2"
          anchorX="center"
          anchorY="middle"
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          VIBE
          <meshStandardMaterial
            ref={materialRef}
            color={hovered ? COLORS.goldLight : COLORS.gold}
            metalness={0.9}
            roughness={0.15}
            emissive={COLORS.goldDark}
            emissiveIntensity={0.3}
          />
        </Text>
      </group>
    </Center>
  );
}

function ParticleField() {
  const count = 600;
  const meshRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.05;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <float32BufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={COLORS.gold}
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

export default function HeroCanvas({ logoVisible }: { logoVisible: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#fff8e1" />
        <directionalLight position={[-3, -2, 4]} intensity={0.4} color={COLORS.gold} />
        <pointLight position={[0, 0, 3]} intensity={0.8} color={COLORS.goldLight} />
        <ParticleField />
        <VibeLogo3D visible={logoVisible} />
      </Suspense>
    </Canvas>
  );
}
