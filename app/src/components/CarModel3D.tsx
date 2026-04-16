"use client";

import { Suspense, useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Stage, Center } from "@react-three/drei";
import * as THREE from "three";

function Car({ mouseX, isMobile }: { mouseX: React.RefObject<number>; isMobile: boolean }) {
  const { scene } = useGLTF("/models/porsche_911_gt3/scene.glb");
  const ref = useRef<THREE.Group>(null!);
  const baseRotation = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    baseRotation.current += delta * 0.15;
    const cursorOffset = isMobile ? 0 : (mouseX.current ?? 0) * 0.4;
    ref.current.rotation.y = baseRotation.current + cursorOffset;
  });

  return (
    <group ref={ref}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

function Scene({
  onReady,
  mouseX,
  isMobile,
}: {
  onReady: () => void;
  mouseX: React.RefObject<number>;
  isMobile: boolean;
}) {
  return (
    <Stage
      adjustCamera={0.9}
      intensity={0.3}
      shadows={isMobile ? false : "contact"}
      environment="city"
    >
      <Car mouseX={mouseX} isMobile={isMobile} />
      <OnFirstRender callback={onReady} />
    </Stage>
  );
}

function LowerCamera() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(4, 1.2, 6);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

function OnFirstRender({ callback }: { callback: () => void }) {
  const called = useRef(false);
  useFrame(() => {
    if (!called.current) {
      called.current = true;
      callback();
    }
  });
  return null;
}

export default function CarModel3D({
  className = "",
  onLoaded,
}: {
  className?: string;
  onLoaded?: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mouseX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleReady = useCallback(() => {
    setLoaded(true);
    onLoaded?.();
  }, [onLoaded]);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    if (isMobile) return; // Skip mouse tracking on mobile
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = (e.clientX / window.innerWidth) * 2 - 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease-in" }}
    >
      <Canvas
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={isMobile ? 1 : [1, 1.5]}
        camera={{ position: [4, 1.2, 6], fov: 40 }}
        style={{
          background: "transparent",
          position: "absolute",
          inset: 0,
        }}
      >
        <LowerCamera />
        <Suspense fallback={null}>
          <Scene onReady={handleReady} mouseX={mouseX} isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/porsche_911_gt3/scene.glb");
