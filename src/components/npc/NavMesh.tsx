import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { World } from "arancini";
import { createReactAPI, EntityProps } from "arancini/react";
import { Executor } from "arancini/systems";
import { useControls } from "leva";
import { useEffect, useState } from "react";
import { NavMeshQuery, init as initRecasty } from "recast-navigation";
import * as THREE from "three";
import { suspend } from "suspend-react";
import { NavMeshHelper, threeToSoloNavMesh } from "@recast-navigation/three";

const LEVA_KEY = "recast-navigation-character-controller";

const world = new World();

// const world = new World({
//   components: [
//     "player",
//     "playerInput",
//     "playerSpeed",
//     "playerMovement",
//     "playerAnimation",
//     "camera",
//     "cameraConfiguration",
//     "traversable",
//     "three",
//     "navigationMesh",
//   ],
// });

const executor = new Executor(world);
executor.init();

const { Entity, Component, useQuery } = createReactAPI(world);

const NavigationMesh = () => {
  const {
    showHelper,
    cellSize,
    cellHeight,
    walkableSlopeAngle,
    walkableClimb,
    walkableRadius,
    walkableHeight,
  } = useControls(`${LEVA_KEY}-nav-mesh`, {
    showHelper: {
      label: "Show Helper",
      value: true,
    },
    cellSize: {
      label: "Cell Size",
      value: 0.1,
      min: 0.05,
      max: 0.2,
      step: 0.05,
    },
    cellHeight: {
      label: "Cell Height",
      value: 0.05,
      min: 0.01,
      max: 0.5,
      step: 0.01,
    },
    walkableRadius: {
      label: "Walkable Radius",
      value: 0.7,
      min: 0.1,
      max: 1,
      step: 0.1,
    },
    walkableSlopeAngle: {
      label: "Walkable Slope Angle",
      value: 45,
      min: 0,
      max: 90,
      step: 1,
    },
    walkableClimb: {
      label: "Walkable Climb",
      value: 0.4,
      min: 0.1,
      max: 1,
      step: 0.1,
    },
    walkableHeight: {
      label: "Walkable Height",
      value: 1.5,
      min: 0.1,
      max: 3,
      step: 0.1,
    },
  });
  const [navMeshHelper, setNavMeshHelper] = useState<NavMeshHelper>();

  const traversable = useQuery((e: EntityProps) =>
    e.has("three", "traversable")
  );

  useEffect(() => {
    if (traversable.entities.length === 0) return;

    const meshes: THREE.Mesh<
      THREE.BufferGeometry<THREE.NormalBufferAttributes>
    >[] = [];

    traversable.entities.forEach((e) => {
      e.three.traverse((object: THREE.Object3D) => {
        if (object instanceof THREE.Mesh) {
          meshes.push(object);
        }
      });
    });

    const { success, navMesh } = threeToSoloNavMesh(meshes, {
      cs: cellSize,
      ch: cellHeight,
      walkableSlopeAngle,
      walkableClimb: walkableClimb / cellHeight,
      walkableRadius: walkableRadius / cellSize,
      walkableHeight: walkableHeight / cellHeight,
      minRegionArea: 12,
    });

    if (!success) return;

    const navMeshQuery = new NavMeshQuery(navMesh);

    const navigationMeshEntity = world.create({
      navigationMesh: {
        navMesh,
        query: navMeshQuery,
      },
    });

    const navMeshHelper = new NavMeshHelper({ navMesh });
    navMeshHelper.position.y += 0.15;

    setNavMeshHelper(navMeshHelper);

    return () => {
      setNavMeshHelper(undefined);

      world.destroy(navigationMeshEntity);

      navMesh.destroy();
      navMeshQuery.destroy();
    };
  }, [
    traversable.version,
    cellSize,
    cellHeight,
    walkableSlopeAngle,
    walkableClimb,
    walkableRadius,
    walkableHeight,
  ]);

  return (
    <>{navMeshHelper && showHelper && <primitive object={navMeshHelper} />}</>
  );
};

const Traversable = ({ children }: { children: JSX.Element }) => {
  return (
    <Entity traversable>
      <Component name="three">{children}</Component>
    </Entity>
  );
};

const Level = () => {
  const gltf = useGLTF("./models/game-level-transformed.glb");

  useEffect(() => {
    gltf.scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  }, [gltf]);

  return (
    <>
      <Traversable>
        <group scale={0.01}>
          <primitive object={gltf.scene} />
        </group>
      </Traversable>
    </>
  );
};

export const NavMeshBuilder = () => {
  useFrame((_, delta) => {
    executor.update(delta);
  });

  return (
    <>
      <Level />
      <NavigationMesh />
    </>
  );
};

export const Level_Builder = () => {
  suspend(() => initRecasty(), []);

  return <NavMeshBuilder />;
};
