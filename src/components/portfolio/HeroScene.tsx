import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, TorusKnot, Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Knot() {
  const ref = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();
  useFrame(({ clock }) => {
    const m = ref.current;
    if (!m) return;
    const t = clock.getElapsedTime();
    m.rotation.y = t * 0.2 + mouse.x * 0.6;
    m.rotation.x = Math.sin(t * 0.3) * 0.2 + mouse.y * 0.4;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
      <TorusKnot ref={ref} args={[1.4, 0.36, 220, 32, 2, 3]}>
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#1e3a8a"
          emissiveIntensity={0.35}
          metalness={0.85}
          roughness={0.18}
          wireframe
        />
      </TorusKnot>
    </Float>
  );
}

function Particles({ count = 900 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 5;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(p) * Math.cos(t);
      arr[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      arr[i * 3 + 2] = r * Math.cos(p);
    }
    return arr;
  }, [count]);
  const ref = useRef<THREE.Points>(null);
  const { mouse } = useThree();
  useFrame(({ clock }) => {
    const p = ref.current;
    if (!p) return;
    p.rotation.y = clock.getElapsedTime() * 0.03 + mouse.x * 0.2;
    p.rotation.x = mouse.y * 0.15;
  });
  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        color="#7dd3fc"
        opacity={0.85}
      />
    </Points>
  );
}

export function HeroScene() {
  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 4, 5]} intensity={1.1} color="#93c5fd" />
      <pointLight position={[-4, -2, -2]} intensity={0.8} color="#22c55e" />
      <pointLight position={[3, -3, 2]} intensity={0.5} color="#ef4444" />
      <Knot />
      <Particles />
    </Canvas>
  );
}