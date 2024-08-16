import { Environment, OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Canvas } from "@react-three/fiber";
import { PointerEvent, Suspense } from "react";
import { StarterMap } from "../maps/starter-map";
import { CharacterController } from "../character/character-controller";
import { Perf } from "r3f-perf";
import { StarterPerson } from "../character/starter-person";
import { Vector3 } from "three";
import { useGameStore } from "../../state/gameState";

export const StarterScene = () => {
  const characters = useGameStore((state) => state.characters);
  console.log(characters[0].position);

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
          {characters.map((character) => (
            <StarterPerson
              key={character.id}
              scale={0.75}
              position={
                new Vector3(
                  character.position.x,
                  character.position.y,
                  character.position.z
                )
              }
            />
          ))}
        </Physics>
      </Suspense>
      <Environment preset="sunset" />
    </Canvas>
  );
};
