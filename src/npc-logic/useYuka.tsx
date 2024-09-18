import { RigidBody } from "@dimforge/rapier3d";
import {
  useRef,
  useEffect,
  useState,
  useContext,
  Ref,
  createContext,
} from "react";
import { Vector3, MovingEntity, EntityManager } from "yuka";

const context = createContext<EntityManager | undefined>(undefined);

class entityType extends MovingEntity {
  agentId: string | null;
  maxForce: number;
  isRandomNav: boolean;
  currentNavPoint: number;
  isPlayerDetected: boolean;
  navPoints: Vector3[];
  setPosition: (x: number, y: number, z: number) => void;
  setRotation: (x: number, y: number, z: number) => void;
}

export function useYuka({
  agentId = null,
  position,
  name = "unnamed",
  navPoints = [],
  isRandomNav = false,
  isPlayerDetected = false,
  maxForce,
  maxSpeed,
}: {
  agentId?: string | null;
  position: Vector3;
  name?: string;
  navPoints?: Vector3[];
  isRandomNav?: boolean;
  isPlayerDetected?: boolean;
  maxForce: number;
  maxSpeed: number;
}) {
  // This hook makes set-up re-usable
  const ref: Ref<RigidBody> = useRef<RigidBody>();
  const mgr = useContext(context);

  const [entity] = useState(new entityType());
  useEffect(() => {
    entity.position = position;
    entity.agentId = agentId;
    entity.name = name;
    entity.maxForce = maxForce;
    entity.maxSpeed = maxSpeed;
    entity.isRandomNav = isRandomNav;
    entity.currentNavPoint = 0;
    entity.isPlayerDetected = isPlayerDetected;
    entity.navPoints = navPoints;
    entity.setRenderComponent(ref, () => {
      if (ref) {
        ref.current.setTranslation(entity.position, true);
        ref.current.setRotation(entity.rotation, true);
        // ref.current.quaternion.copy(entity.rotation);
      }
    });
    if (mgr) {
      mgr.add(entity);
    }
  }, []);
  return [ref as Ref<RigidBody>];
}
