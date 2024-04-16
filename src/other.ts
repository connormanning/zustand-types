// From https://github.com/pmndrs/zustand/discussions/1796#discussioncomment-6907468
import { create } from "zustand";
import type { StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";

type Slice = {
  count: number;
  increment: (qty: number) => void;
  decrement: (qty: number) => void;
};

type ImmerStateCreator<T> = StateCreator<
  T,
  [["zustand/immer", never], never],
  [],
  T
>;

const createSlice: ImmerStateCreator<Slice> = (set, get, store) => {
  return {
    count: 0,
    increment: (qty: number) => {
      set((state) => {
        state.count += qty;
      })
    },
    decrement: (qty: number) => {
      set((state) => {
        state.BADKEY = 42 // No error with zustand 4.5.2.
        state.count -= qty;
      })
    },
  };
};
