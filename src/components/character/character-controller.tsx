import { RigidBody } from "@react-three/rapier";
import Ecctrl, { EcctrlAnimation } from "ecctrl";
import { KeyboardControls } from "@react-three/drei";
import { characterURL } from "./character-url";
import { useMemo } from "react";
import { Character } from "./character";

const animationSet = {
  idle: "Idle",
  walk: "Walk",
  run: "Run",
  jump: "Falling",
  jumpIdle: "Falling",
  jumpLand: "Falling",
  fall: "Falling", // This is for falling from high sky
  action1: "Jump",
  action2: "Jump",
  action3: "Jump",
  action4: "Jump",
};

const Controls = {
  forward: "forward",
  back: "backward",
  left: "leftward",
  right: "rightward",
  jump: "jump",
  run: "run",
  action1: "action1",
  action2: "action2",
  action3: "action3",
  action4: "action4",
};

export const CharacterController = ({ position }: { position: Vector3}) => {
  const map = useMemo(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
      { name: Controls.run, keys: ["Shift"] },
      { name: Controls.action1, keys: ["1"] },
      { name: Controls.action2, keys: ["2"] },
      { name: Controls.action3, keys: ["3"] },
      { name: Controls.action4, keys: ["KeyF"] },
    ],
    []
  );

  return (
    <group position={position}>
      <RigidBody colliders={false} lockRotations>
        <KeyboardControls map={map}>
          <Ecctrl animated floatHeight={0.0} disableFollowCam={false}>
            {/* <Ecctrl debug animated floatHeight={0.0}>  -- use debugger to customize Ecctrl   */}
            <EcctrlAnimation
              characterURL={characterURL}
              animationSet={animationSet}
            >
              <Character scale={0.75} positionY={-0.65} />
            </EcctrlAnimation>
          </Ecctrl>
        </KeyboardControls>
      </RigidBody>
    </group>
  );
};
