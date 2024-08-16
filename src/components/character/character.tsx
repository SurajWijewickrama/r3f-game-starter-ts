import { useEffect } from "react";
import { playAudio } from "../../utils/audio";
import { CharacterModel } from "./character-model";
import { useGame } from "ecctrl";

const walkAudio = playAudio("/assets/audio/walk.mp3", 0.1, true, false);
const runAudio = playAudio("/assets/audio/run.mp3", 0.1, true, false);
runAudio.playbackRate = 0.75;

export const Character = ({
  scale,
  positionY,
}: {
  scale: number;
  positionY: number;
}) => {
  const game = useGame((st) => {
    return st;
  });

  useEffect(() => {
    walkAudio.pause();
    runAudio.pause();
    if (game.curAnimation == "Walk") {
      walkAudio.play();
    } else if (game.curAnimation == "Run") {
      runAudio.play();
    }
  }, [game]);

  return <CharacterModel scale={scale} positionY={positionY} />;
};
