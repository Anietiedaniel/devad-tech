import { useMemo } from "react";

export default function BackgroundParticles() {
  const particles = useMemo(() => {
    const points = [];

    for (let i = 0; i < 1500; i++) {
      points.push(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80
      );
    }

    return new Float32Array(points);
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        size={0.04}
        color="#22d3ee"
        transparent
        opacity={0.7}
      />
    </points>
  );
}
