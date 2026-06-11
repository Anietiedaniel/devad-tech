import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function CoreSphere() {
  const sphereRef = useRef();

  useFrame((state) => {
    const scale =
      1 +
      Math.sin(state.clock.elapsedTime * 2) *
        0.08;

    sphereRef.current.scale.set(
      scale,
      scale,
      scale
    );
  });

  return (
    <group>

      <mesh ref={sphereRef}>
        <sphereGeometry args={[1.2, 64, 64]} />

        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={2}
          transparent
          opacity={0.25}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.7, 64, 64]} />

        <meshStandardMaterial
          color="#67e8f9"
          emissive="#67e8f9"
          emissiveIntensity={4}
        />
      </mesh>

      <Html center>
        <div className="text-center pointer-events-none">

          <h2 className="text-cyan-400 font-bold text-2xl">
            DEVAD
          </h2>

          <p className="text-white text-xs tracking-widest">
            TECH ACADEMY
          </p>

        </div>
      </Html>

    </group>
  );
}