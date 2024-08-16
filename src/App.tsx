import { StarterScene } from "./components/scenes/starter-scene";
import UI from "./components/ui/ui";
import React, { Suspense } from "react";
import { SocketManager } from "./multiplayer/socketManager";

export default function App() {
  return (
    <>
      <SocketManager />
      <UI>
        <Suspense fallback={null}>
          <StarterScene />
        </Suspense>
      </UI>
    </>
  );
}
