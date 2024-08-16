import React, { useEffect, useState } from "react";
import { useGraph } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { characterURL } from "./character-url";
import {
  BufferGeometry,
  Group,
  Material,
  Object3D,
  Object3DEventMap,
  Skeleton,
  Vector3,
} from "three";

export function StarterPerson({
  scale = 0.75,
  position,
}: {
  scale?: number;
  position: Vector3;
}) {
  const group = React.useRef<Group<Object3DEventMap>>(null);
  const { scene, animations } = useGLTF(characterURL);
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

  const { actions } = useAnimations(animations, group);

  const animation = useState("Idle")[0];

  useEffect(() => {
    if (actions[animation] === null) return;
    else {
      actions[animation].reset().fadeIn(0.5).play();
      return () => {
        if (actions[animation] === null) return;
        actions[animation].fadeOut(0.5);
      };
    }
  }, [animation]);


  return (
    <group ref={group} scale={scale} position={position} dispose={null}>
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
