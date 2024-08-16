import { Vector3 } from "three";

export type state = {
  count: number;
  characters: Character[];
  increaseCount: () => void;
  reset: () => void;
  setCharacter: (charactersArray: Character[]) => void;
};

export type Character = {
  id: string;
  position: Vector3;
};


export interface Rooms {
    [roomName: string]: Character[];
  }