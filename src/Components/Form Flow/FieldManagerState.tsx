import { stat } from 'fs';
import { StateCreator } from 'zustand';

// Constant to append to end of fieldKeys, signifying fields are complete
export const SECTION_DONE = "SECTION_DONE";

export interface FieldManagerState {
    fieldKeys: string[];
    activeFieldIndex: number;
    activeFieldKey: string;
    initFocusManager: (keys: string[]) => void;
    resetFocusManager: () => void;
    nextField: () => void;
}

export const createFocusManagerState: StateCreator<FieldManagerState> = (set) => ({
    fieldKeys: [],
    activeFieldIndex: 0,
    activeFieldKey: "",
    initFocusManager: (keys) => set({ 
        fieldKeys: [...keys, SECTION_DONE], 
        activeFieldIndex: -1,
        activeFieldKey: ""}),
    nextField: () => set((state) => ({ activeFieldIndex: state.activeFieldIndex + 1, 
                                       activeFieldKey:   state.fieldKeys[state.activeFieldIndex + 1] })),
    resetFocusManager: () => set(() => ({
        activeFieldIndex: -1,
        activeFieldKey: ""
        }))
})
