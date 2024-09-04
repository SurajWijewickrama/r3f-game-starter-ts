import { create, StoreApi, UseBoundStore } from "zustand";
import { state } from "./stateTypes";

export const useGameStore: UseBoundStore<StoreApi<state>> = create((set) => ({
  count: 0,
  increaseCount: () => set((state: state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}));
