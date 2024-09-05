import { StarterScene } from "./components/scenes/starter-scene";
import UI from "./components/ui/ui";
import { Suspense, useRef, useState } from "react";
import { useJoystickControls } from "ecctrl";
import { Joystick } from "react-joystick-component";
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick";

export default function App() {
  const pressButton1 = useJoystickControls((state) => state.pressButton1);
  const setJoystick = useJoystickControls((state) => state.setJoystick);
  const resetJoystick = useJoystickControls((state) => state.resetJoystick);
  const releaseAllButtons = useJoystickControls(
    (state) => state.releaseAllButtons
  );
  const joystick = useRef<Joystick>();

  const handleMove = (e: IJoystickUpdateEvent) => {
    console.log(e, Math.atan2(e.y, e.x));
    setJoystick(e.distance, Math.atan2(e.y, e.x), true);
  };
  const handleStop = () => {
    resetJoystick();
    joystick.current.setState({
      coordinates: {
        relativeX: 0,
        relativeY: 0,
        distance: 0,
        direction: null,
        axisX: 0,
        axisY: 0,
      },
      dragging: false,
    });
    console.log(joystick.current);
  };

  return (
    <div className="h-full w-full overflow-clip">
      <UI>
        <Suspense fallback={null}>
          <div className="lg:hidden flex absolute bottom-5 left-5 z-10">
            <Joystick
              size={100}
              sticky={true}
              baseColor="red"
              stickColor="blue"
              move={handleMove}
              stop={handleStop}
              ref={joystick}
            ></Joystick>
          </div>
          <div className="lg:hidden flex absolute bottom-10 right-5 z-10">
            <button
              onPointerDown={() => {
                pressButton1();
              }}
              onPointerUp={() => {
                releaseAllButtons();
              }}
            >
              Jump
            </button>
          </div>
          <StarterScene />
        </Suspense>
      </UI>
    </div>
  );
}
