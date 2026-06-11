import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import { EffectComposer, Bloom } from "@react-three/postprocessing";

import TechGlobe from "./TechGlobe";
import BackgroundParticles from "./BackgroundParticles";

export default function NeuralNetworkHeroGraphic() {
  return (
    <div className="relative w-full h-[700px] lg:h-[800px]">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-cyan-500/10 blur-[180px]" />

      <Canvas
        camera={{
          position: [0, 0, 12],
          fov: 45,
        }}
      >
        {/* Lights */}
        <ambientLight intensity={1.2} />

        <pointLight
          position={[0, 0, 5]}
          intensity={30}
          color="#22d3ee"
        />

        <pointLight
          position={[5, 3, 5]}
          intensity={20}
          color="#3b82f6"
        />

        <Suspense fallback={null}>
          <BackgroundParticles />

          <TechGlobe />
        </Suspense>

        {/* Glow Effects */}
        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

