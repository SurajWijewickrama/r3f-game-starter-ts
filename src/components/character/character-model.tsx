import React from "react";
import { useGraph } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { characterURL } from "./character-url";
import {
  BufferGeometry,
  Group,
  Material,
  Object3D,
  Object3DEventMap,
  Skeleton,
} from "three";

export function CharacterModel({
  positionY,
  scale = 0.75,
  positionX = 0,
  positionZ = 0,
}: {
  positionY: number;
  scale: number;
  positionX?: number;
  positionZ?: number;
}) {
  const group = React.useRef<Group<Object3DEventMap>>(null);
  const { scene } = useGLTF(characterURL);
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone) as {
    nodes: {
      [key: string]: Object3D & {
        geometry?: BufferGeometry;
        skeleton: Skeleton;
      };
    };
    materials: { [key: string]: Material };
  };

  return (
    <group
      ref={group}
      scale={scale}
      position={[positionX, positionY, positionZ]}
      dispose={null}
    >
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorigHips} />
          <skinnedMesh
            name="Alpha_Joints"
            geometry={nodes.Alpha_Joints.geometry}
            material={materials["Alpha_Joints_MAT.002"]}
            skeleton={nodes.Alpha_Joints.skeleton}
          />
          <skinnedMesh
            name="Alpha_Surface"
            geometry={nodes.Alpha_Surface.geometry}
            material={materials["Alpha_Body_MAT.002"]}
            skeleton={nodes.Alpha_Surface.skeleton}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(characterURL);
