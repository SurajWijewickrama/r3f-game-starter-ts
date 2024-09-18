import {
  CapsuleCollider,
  CollisionEnterPayload,
  RigidBody,
} from "@react-three/rapier";
import { useYuka } from "./useYuka";
import { Vector3, Vehicle } from "yuka";
import getRandomArbitrary from "../utils/RandomCalculations";

export function NavMeshAgent({
  name = "agent",
  agentId = null,
  position = [getRandomArbitrary(0, 60), 2, getRandomArbitrary(0, 60)],
  navPoints = [new Vector3(10, 2, 10), new Vector3(60, 2, 60)],
  maxSpeed = getRandomArbitrary(3, 10),
  maxForce = getRandomArbitrary(30, 60),
  isRandomNav = false,
  isPlayerDetected = false,
  children,
  ...props
}: {
  agentId: string;
  name: string;
  position: [number, number, number];
  navPoints: Vector3[];
  maxSpeed: number;
  maxForce: number;
  isRandomNav: boolean;
  isPlayerDetected: boolean;
  children: React.ReactNode;
}) {
  const [refYuka] = useYuka<Vehicle>({
    name,
    agentId,
    position,
    navPoints,
    isRandomNav,
    isPlayerDetected,
    maxSpeed,
    maxForce,
    ...props,
  });
  const Attacked = (event: CollisionEnterPayload) => {
    if (event.rigidBodyObject.name == "Player") {
      console.log("Attacked");
    }
  };
  return (
    <RigidBody
      ref={refYuka}
      colliders={false}
      linearDamping={0}
      type="kinematicPosition"
      name="Enemy"
      lockRotations
      onCollisionEnter={Attacked}
    >
      <CapsuleCollider args={[1, 1]} position={[0, 0, 0]}>
        {children}
      </CapsuleCollider>
    </RigidBody>
  );
}
