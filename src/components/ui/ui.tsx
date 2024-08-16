import React, { useEffect, useState } from "react";
import LoaderBar from "./loader";
import { Pause, Plus, RefreshCw, Volume, Volume2 } from "lucide-react";
import { playAudio } from "../../utils/audio";
import { useGameStore } from "../../state/gameState";
import { socket } from "../../multiplayer/socketManager";
import { Rooms } from "../../state/stateTypes";

const audio = playAudio("/assets/audio/starter-audio.mp3", 0.1, true, true);

export default function UI({ children }: { children: React.ReactNode }) {
  const [start, setStart] = useState(true);
  const [roomName, setRoomName] = useState<
    string | number | readonly string[] | undefined
  >();
  const [message, setMessage] = useState<
    string | number | readonly string[] | undefined
  >();
  const [rooms, setRooms] = useState<Rooms | undefined>();
  const [isPlayAudio, setPlayAudio] = useState(false);
  const characters = useGameStore((state) => state.characters);
  const increaseCount = useGameStore((state) => state.increaseCount);
  const reset = useGameStore((state) => state.reset);

  const handleJoinRoom = () => {
    socket.emit("join-room", roomName);
  };

  const handleSend = () => {
    socket.emit("ping-room", roomName, message);
  };

  const handleGetRooms = () => {
    socket.emit("get-rooms");
  };

  useEffect(() => {
    if (isPlayAudio) {
      audio.play();
      // audio.volume = 0.1;
    } else {
      audio.pause();
    }
  }, [isPlayAudio]);

  useEffect(() => {
    socket.on("get-rooms", setRooms);
    console.log("rooms", rooms);
  }, [socket]);

  if (start) {
    return (
      <div className="h-screen w-screen relative">
        <div className="absolute h-screen w-screen flex justify-center items-center flex-col gap-4">
          <h1>Starter UI</h1>
          <h2>Press start to load starter scene</h2>
          <button onClick={() => setStart(false)}>Start</button>
          <div className="flex justify-center items-center gap-4">
            Character: {characters.length}
            <button onClick={increaseCount} className="flex p-1">
              <Plus />
            </button>{" "}
            <button onClick={reset} className="flex p-1">
              <RefreshCw scale={0.75} />
            </button>
          </div>
          <div>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter Room Name"
            />
            <button onClick={handleJoinRoom} className="flex p-1">
              Join
            </button>
          </div>
          <div>
            <h3>Room Panel</h3>
            <button onClick={handleGetRooms} className="flex p-1">
              Refresh
            </button>
            <ul>
              {rooms
                ? Object.keys(rooms).map((roomName) => {
                    return (
                      <li key={roomName}>
                        <strong>{roomName}</strong>: {rooms[roomName].length}{" "}
                        characters
                      </li>
                    );
                  })
                : null}
            </ul>
          </div>
          <div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message"
            />
            <button onClick={handleSend} className="flex p-1">
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen relative">
      <LoaderBar loadingText={"Starter Scene Loading"} />
      <div className="absolute  w-screen p-4   z-40">
        <div className="flex justify-between">
          <h1>Starter UI</h1>
          <div className="flex gap-2">
            <button onClick={() => setStart(true)}>
              <Pause />
            </button>
            <button onClick={() => setPlayAudio(!isPlayAudio)}>
              {isPlayAudio ? <Volume2 /> : <Volume />}
            </button>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
