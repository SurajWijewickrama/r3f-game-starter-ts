import { useEffect } from "react";
import { io } from "socket.io-client";
import { useGameStore } from "../state/gameState";
import { Character, state } from "../state/stateTypes";

export const socket = io("http://localhost:3000");

export const SocketManager = () => {
  const setCharacter = useGameStore((state: state) => state.setCharacter);

  useEffect(() => {
    function onConnect() {
      console.log("connected");
    }

    function onDisconnect() {
      console.log("disconnected");
    }
    function hello(message: string) {
      console.log(message);
    }
    function getRooms(rooms: number) {
      console.log(rooms);
    }

    function onCharacters(value: Character[]) {
      if (typeof value === "object") {
        setCharacter(value);
      } else {
        setCharacter([]);
      }
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("ping-room", hello);
    socket.on("users", onCharacters);
    socket.on("rooms", getRooms);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("hello", hello);
      socket.off("characters", onCharacters);
    };
  }, []);

  return null;
};
