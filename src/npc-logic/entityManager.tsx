import { createContext, useState, useRef, useEffect } from "react";
import {
  EntityManager,
  GameEntity,
  FollowPathBehavior,
  OnPathBehavior,
  Vector3,
} from "yuka";
import { useFrame } from "@react-three/fiber";
import { Agent, NavMeshState } from "./navMeshTypes";
import useNavMesh from "./useNavMesh";

const context = createContext<EntityManager | undefined>(undefined);

export function Manager({ children }: { children: JSX.Element }) {
  const [mgr] = useState(() => new EntityManager());
  const agentListRef = useRef<GameEntity[]>([]);
  const navMesh = useNavMesh((state) => state.navMesh);
  const actions = useNavMesh((state) => state.actions);

  useEffect(
    () => () => {
      if (!navMesh) {
        return;
      }

      const agentsEntities = mgr.entities.filter(
        (item) => item.name === "Enemy"
      );
      const agents: Agent[] = [];

      // const ghost = mgr.entities.find((item) => item.name === "Ghost");
      agentsEntities.forEach((agent) => {
        // Set up agent
        const followPathBehavior = new FollowPathBehavior();
        const onPathBehavior = new OnPathBehavior();
        // agent.maxSpeed = getRandomArbitrary(3, 10);
        //  agent.maxForce = getRandomArbitrary(30, 60);
        followPathBehavior.active = false;
        onPathBehavior.active = false;
        onPathBehavior.radius = 1;

        // agent.steering.add(followPathBehavior);
        // agent.steering.add(onPathBehavior);

        agentListRef.current.push(agent);
        agents.push({
          agent: {
            position: agent.position,
            isPlayerDetected: null,
            navPoints: null,
            currentNavPoint: 0,
          },
          followPathBehavior,
          onPathBehavior,
        });
      });

      actions.setAgentRefList(agentListRef);
      actions.setAgentList(agents);

      useNavMesh.subscribe(
        (intersects) => findPathTo(intersects)
        //(state) => state.intersects
      );

      const setPaths = (agentData: Agent, from: Vector3, to: Vector3) => {
        const path = navMesh.findPath(from, to);

        agentData.onPathBehavior.active = true;
        agentData.onPathBehavior.path.clear();
        agentData.followPathBehavior.active = true;
        agentData.followPathBehavior.path.clear();

        for (const point of path) {
          agentData.followPathBehavior.path.add(point);
          agentData.onPathBehavior.path.add(point);
        }
      };

      const findPathTo = (target: NavMeshState) => {
        target.agentList.forEach((agentDate) => {
          const navPointsCount = agentDate.agent.navPoints.length;
          if (agentDate.agent.isPlayerDetected) {
            const from = agentDate.agent.position;
            const to = new Vector3(
              target.intersects.x,
              target.intersects.y,
              target.intersects.z
            );
            setPaths(agentDate, from, to);
          } else if (navPointsCount > 0) {
            let currentPointIndex = agentDate.agent.currentNavPoint;
            const from = agentDate.agent.position;
            let to = agentDate.agent.navPoints[currentPointIndex];
            if (from.distanceTo(to) < 0.5 && navPointsCount > 1) {
              currentPointIndex =
                currentPointIndex < navPointsCount - 1
                  ? currentPointIndex + 1
                  : 0;
              to = agentDate.agent.navPoints[currentPointIndex];
              agentDate.agent.currentNavPoint = currentPointIndex;
            }
            const toVec3 = new Vector3(to.x, to.y, to.z);
            setPaths(agentDate, from, toVec3);
          }
        });
      };
    },
    [navMesh]
  );

  useFrame((state, delta) => mgr.update(delta));

  return <context.Provider value={mgr}>{children}</context.Provider>;
}
