import { Vector2, Mesh, BufferGeometry, MeshBasicMaterial } from "three";
import {
  FollowPathBehavior,
  GameEntity,
  NavMesh,
  OnPathBehavior,
  Vector3,
} from "yuka";
import * as THREE from "three";
import { MutableRefObject } from "react";
import { Camera } from "@react-three/fiber";

// Define types for the state
export interface Mutation {
  mouse: Vector2;
}

export interface Refs {
  level: Mesh | null;
  pathHelper: Mesh | null;
}

export interface Level {
  geometry: BufferGeometry;
  material: MeshBasicMaterial;
}

export interface Agent {
  followPathBehavior: FollowPathBehavior;
  onPathBehavior: OnPathBehavior;
  agent: {
    position: Vector3;
    isPlayerDetected: boolean;
    navPoints: Vector3[];
    currentNavPoint: number;
  };
}

export interface NavMeshState {
  raycaster: THREE.Raycaster;
  camera: Camera | null;
  viewport: THREE.Vector2;
  clock: THREE.Clock | null;
  navMesh: NavMesh;
  intersects: Vector3;
  agentRefList: MutableRefObject<GameEntity[]>;
  agentList: Agent[];
  mutation: Mutation;
  refs: Refs;
  level: Level;
  actions: {
    init: (camera: Camera) => void;
    loadNavMesh: (url: string) => void;
    updateMouse: (event: { clientX: number; clientY: number }) => void;
    handleMouseDown: () => void;
    setPosition: (position: Vector3) => void;
    setAgentRefList: (agentList: MutableRefObject<GameEntity[]>) => void;
    setAgentList: (agentList: Agent[]) => void;
  };
}
