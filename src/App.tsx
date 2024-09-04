import { StarterScene } from "./components/scenes/starter-scene";
import UI from "./components/ui/ui";
import { Suspense } from "react";

export default function App() {
  return (
    <>
      <UI>
        <Suspense fallback={null}>
          <StarterScene />
        </Suspense>
      </UI>
    </>
  );
}
