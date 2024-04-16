import { create, StateCreator } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface BearSlice {
  bears: number
  addBear: () => void
  eatFish: () => void
}

interface FishSlice {
  fishes: number
  addFish: () => void
}

interface SharedSlice {
  addBoth: () => void
  getBoth: () => void
}

const createBearSlice: StateCreator<
  BearSlice & FishSlice,
  [],
  [],
  BearSlice
> = (set) => ({
  bears: 0,
  // BADKEY is accepted
  addBear: () => set((state) => ({ bears: state.bears + 1, BADKEY: 42 })),
  eatFish: () => set((state) => ({ fishes: state.fishes - 1 })),
})

const createFishSlice: StateCreator<
  BearSlice & FishSlice,
  [['zustand/immer', never]],
  [],
  FishSlice
> = (set) => ({
  fishes: 0,
  // Because of the immer declaration, "state" is interpreted as Draft<T>, rather
  // than Draft<BearSlice & FishSlice>, so "state.bears" is inferred as "any".
  addFish: () => set((state) => { state.fishes = 'NOW I AM A STRING' }),
})

const createSharedSlice: StateCreator<
  BearSlice & FishSlice,
  [],
  [],
  SharedSlice
> = (set, get) => ({
  addBoth: () => {
    // you can reuse previous methods
    get().addBear()
    get().addFish()
    // or do them from scratch
    // set((state) => ({ bears: state.bears + 1, fishes: state.fishes + 1 })
  },
  getBoth: () => get().bears + get().fishes,
})

type WithValue = { value: number }
function doubleit({ value }: WithValue) {
  return value * 2
}
const fromVariable = { value: 2, BADKEY: 42 }
// Succeeds, fromVariable matches WithValue.
doubleit(fromVariable) 

// ERROR, in the object literal form, we cannot pass additional keys.
doubleit({ value: 2, BADKEY: 42 })

export const useBoundStore = create<BearSlice & FishSlice & SharedSlice>()(
  immer((...a) => ({
    ...createBearSlice(...a),
    ...createFishSlice(...a),
    ...createSharedSlice(...a),
  }))
)
