import { Torus } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function HolographicRings() {
  const ring1 = useRef();
  const ring2 = useRef();
  const ring3 = useRef();

  useFrame((_, delta) => {
    ring1.current.rotation.y += delta * 0.2;

    ring2.current.rotation.x += delta * 0.35;

    ring3.current.rotation.z += delta * 0.5;
  });

  return (
    <>
      <Torus
        ref={ring1}
        args={[4.5, 0.02, 16, 200]}
      >
        <meshBasicMaterial
          color="#22d3ee"
        />
      </Torus>

      <Torus
        ref={ring2}
        args={[5.2, 0.015, 16, 200]}
        rotation={[1.2, 0, 0]}
      >
        <meshBasicMaterial
          color="#3b82f6"
        />
      </Torus>

      <Torus
        ref={ring3}
        args={[5.8, 0.015, 16, 200]}
        rotation={[0.6, 0.6, 0]}
      >
        <meshBasicMaterial
          color="#67e8f9"
        />
      </Torus>
    </>
  );
}