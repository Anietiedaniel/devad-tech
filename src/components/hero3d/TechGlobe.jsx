import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";

import {
  FaPython,
  FaReact,
  FaNodeJs,
  FaDocker,
  FaGitAlt,
  FaFigma,
  FaJsSquare,
} from "react-icons/fa";

import { SiMysql, SiArduino } from "react-icons/si";

import CoreSphere from "./CoreSphere";
import HolographicRings from "./HolographicRings";
import DataParticles from "./DataParticles";
import useGlobeControls from "./useGlobeControls";

const techs = [
  { name: "Python", icon: FaPython },
  { name: "React", icon: FaReact },
  { name: "Node.js", icon: FaNodeJs },
  { name: "Docker", icon: FaDocker },
  { name: "Git", icon: FaGitAlt },
  { name: "Figma", icon: FaFigma },
  { name: "JavaScript", icon: FaJsSquare },
  { name: "SQL", icon: SiMysql },
  { name: "Arduino", icon: SiArduino },
];

function pointOnSphere(radius, theta, phi) {
  return [
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

export default function TechGlobe() {
  const groupRef = useRef();

  useGlobeControls(groupRef);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y += delta * 0.04;
  });

  const nodes = useMemo(() => {
    const pts = [];

    for (let i = 0; i < 90; i++) {
      const theta = Math.random() * Math.PI * 2;

      const phi = Math.acos(
        2 * Math.random() - 1
      );

      pts.push(
        pointOnSphere(
          4,
          theta,
          phi
        )
      );
    }

    return pts;
  }, []);

  const connections = useMemo(() => {
    const links = [];

    nodes.forEach((p1, i) => {
      nodes.forEach((p2, j) => {
        if (i >= j) return;

        const distance = Math.sqrt(
          (p1[0] - p2[0]) ** 2 +
            (p1[1] - p2[1]) ** 2 +
            (p1[2] - p2[2]) ** 2
        );

        if (distance < 1.8) {
          links.push([p1, p2]);
        }
      });
    });

    return links;
  }, [nodes]);

  return (
    <group ref={groupRef}>

      {/* Core */}
      <CoreSphere />

      {/* Rings */}
      <HolographicRings />

      {/* Data Particles */}
      <DataParticles />

      {/* Connections */}
      {connections.map((line, index) => (
        <Line
          key={index}
          points={line}
          color="#22d3ee"
          transparent
          opacity={0.25}
          lineWidth={1}
        />
      ))}

      {/* Neural Nodes */}
      {nodes.map((position, index) => (
        <mesh
          key={index}
          position={position}
        >
          <sphereGeometry
            args={[0.06, 16, 16]}
          />

          <meshBasicMaterial
            color="#22d3ee"
          />
        </mesh>
      ))}

      {/* Tech Logos */}
      {techs.map((tech, index) => {
        const Icon = tech.icon;

        const theta =
          (index /
            techs.length) *
          Math.PI *
          2;

        const pos = pointOnSphere(
          4.6,
          theta,
          Math.PI / 2
        );

        return (
          <Html
            key={tech.name}
            position={pos}
            center
          >
            <div className="group">

              <div
                className="
                  w-16
                  h-16
                  rounded-full
                  bg-slate-900/90
                  border
                  border-cyan-400/40
                  backdrop-blur-xl
                  flex
                  items-center
                  justify-center
                  shadow-[0_0_30px_rgba(34,211,238,0.4)]
                  transition-all
                  duration-300
                  hover:scale-110
                "
              >
                <Icon
                  size={28}
                  className="
                    text-cyan-400
                  "
                />
              </div>

              <p
                className="
                  text-center
                  text-xs
                  mt-2
                  text-slate-300
                  whitespace-nowrap
                "
              >
                {tech.name}
              </p>

            </div>
          </Html>
        );
      })}
    </group>
  );
}