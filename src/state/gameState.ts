import { create, StoreApi, UseBoundStore } from "zustand";
import { Character, state } from "./stateTypes";


export const useGameStore :UseBoundStore<StoreApi<state>> = create((set) => ({
  count: 0,
  characters: [],
  increaseCount: () => set((state:state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
  setCharacter: (charactersArray:Character[]) => {
    set(() => ({
      characters: charactersArray,
    }));
  },
  
}));
