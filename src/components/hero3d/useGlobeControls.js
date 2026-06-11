import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export default function useGlobeControls(groupRef) {
  const { gl } = useThree();

  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);

  const velocityX = useRef(0);
  const velocityY = useRef(0);

  useFrame(() => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y += velocityX.current;
    groupRef.current.rotation.x += velocityY.current;

    velocityX.current *= 0.96;
    velocityY.current *= 0.96;
  });

  const onPointerDown = (e) => {
    dragging.current = true;

    lastX.current = e.clientX;
    lastY.current = e.clientY;
  };

  const onPointerMove = (e) => {
    if (!dragging.current || !groupRef.current) return;

    const deltaX = e.clientX - lastX.current;
    const deltaY = e.clientY - lastY.current;

    groupRef.current.rotation.y += deltaX * 0.005;
    groupRef.current.rotation.x += deltaY * 0.005;

    velocityX.current = deltaX * 0.0008;
    velocityY.current = deltaY * 0.0008;

    lastX.current = e.clientX;
    lastY.current = e.clientY;
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  gl.domElement.addEventListener(
    "pointerdown",
    onPointerDown
  );

  gl.domElement.addEventListener(
    "pointermove",
    onPointerMove
  );

  window.addEventListener(
    "pointerup",
    onPointerUp
  );

  return null;
}