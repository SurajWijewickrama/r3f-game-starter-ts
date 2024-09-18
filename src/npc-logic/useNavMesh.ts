import * as THREE from "three";
import { GameEntity, NavMeshLoader, Vector3 } from "yuka";
import { create } from "zustand";
import { createConvexRegionHelper } from "./createConvexRegionHelper";
import { Camera } from "@react-three/fiber";
import { MutableRefObject } from "react";
import { Agent, NavMeshState } from "./navMeshTypes";

const useNavMesh = create<NavMeshState>((set, get) => ({
  raycaster: new THREE.Raycaster(),
  camera: null,
  viewport: new THREE.Vector2(window.innerWidth, window.innerHeight),
  clock: null,
  navMesh: null,
  intersects: new Vector3(),
  agentList: null,
  agentRefList: null,
  mutation: {
    mouse: new THREE.Vector2(0, 0),
  },
  refs: {
    level: null,
    pathHelper: null,
  },
  level: {
    geometry: new THREE.BufferGeometry(),
    material: new THREE.MeshBasicMaterial(),
  },
  actions: {
    init(camera: Camera) {
      set({ camera });
    },
    loadNavMesh(url: string) {
      const loader = new NavMeshLoader();
      loader.load(url).then((navMesh) => {
        const { geometry, material } = createConvexRegionHelper(navMesh);
        set({ navMesh });
        set({ level: { geometry, material } });
      });
    },
    updateMouse({ clientX, clientY }: { clientX: number; clientY: number }) {
      const { viewport, mutation } = get();

      mutation.mouse.x = (clientX / viewport.x) * 2 - 1;
      mutation.mouse.y = -(clientY / viewport.y) * 2 + 1;
    },
    handleMouseDown() {
      const { mutation, raycaster, camera, refs } = get();
      if (!refs.level) {
        return null;
      }

      raycaster.setFromCamera(mutation.mouse, camera!);

      const intersects = raycaster.intersectObject(refs.level);

      if (intersects.length > 0) {
        const point = new Vector3(
          intersects[0].point.x,
          intersects[0].point.y,
          intersects[0].point.z
        );
        set({ intersects: point });
      }
    },
    setPosition(position: Vector3) {
      set({ intersects: position });
    },
    setAgentRefList(agentRefList: MutableRefObject<GameEntity[]>) {
      set({ agentRefList });
    },
    setAgentList(agentList: Agent[]) {
      set({ agentList });
    },
  },
}));

export default useNavMesh;
