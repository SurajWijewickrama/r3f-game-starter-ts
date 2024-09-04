import { Environment, OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Canvas } from "@react-three/fiber";
import { PointerEvent, Suspense } from "react";
import { StarterMap } from "../maps/starter-map";
import { CharacterController } from "../character/character-controller";
import { Perf } from "r3f-perf";
import { Vector3 } from "three";

export const StarterScene = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [3, 30, 3], fov: 30 }}
      onPointerDown={(e: PointerEvent<HTMLDivElement>) => {
        if (e.pointerType === "mouse") {
          (e.target as HTMLDivElement).requestPointerLock();
        }
      }}
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
