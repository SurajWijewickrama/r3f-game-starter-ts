import { Environment, OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Canvas } from "@react-three/fiber";
import { PointerEvent, Suspense, useEffect, useRef } from "react";
import { StarterMap } from "../maps/starter-map";
import { CharacterController } from "../character/character-controller";
import { Perf } from "r3f-perf";
import { Vector3 } from "three";

// Helper function to check for WebGL 2.0 support
const createWebGLContext = (
  canvas: HTMLCanvasElement
): WebGLRenderingContext | WebGL2RenderingContext | null => {
  if (window.WebGL2RenderingContext) {
    return canvas.getContext("webgl2"); // Try WebGL 2.0
  } else {
    return canvas.getContext("webgl"); // Fallback to WebGL 1.0
  }
};

export const StarterScene = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const context = createWebGLContext(canvasRef.current);
      if (!context) {
        console.error("WebGL is not supported by this browser.");
      }
    }
  }, []);

  return (
    <Canvas
      ref={canvasRef}
      shadows
      camera={{ position: [3, 30, 3], fov: 30 }}
      onPointerDown={(e: PointerEvent<HTMLDivElement>) => {
        if (e.pointerType === "mouse") {
          (e.target as HTMLDivElement).requestPointerLock();
        }
      }}
      className="h-screen w-screen"
    >
      <Perf position="top-left" />
      <OrbitControls />
      <Suspense fallback={null}>
        <directionalLight
          position={[2.5, 8, 5]}
          intensity={0.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <Physics debug>
          <StarterMap />
          <CharacterController position={new Vector3(0, 0, 0)} />
        </Physics>
      </Suspense>
      <Environment preset="sunset" />
    </Canvas>
  );
};
