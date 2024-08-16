import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect } from "react";

export const StarterMap = () => {
  const map = useGLTF("assets/models/starter-map.glb");

  useEffect(() => {
    map.scene.traverse((child) => {
      if (child.isObject3D) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  });

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <primitive object={map.scene} />;
    </RigidBody>
  );
};

useGLTF.preload("assets/models/starter-map.glb");
