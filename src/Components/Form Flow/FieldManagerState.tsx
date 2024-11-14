import { stat } from 'fs';
import { StateCreator } from 'zustand';

// Constant to append to end of fieldKeys, signifying fields are complete
export const SECTION_DONE = "SECTION_DONE";

export interface FieldManagerState {
    fieldKeys: string[];
    fieldCount: number;
    activeFieldIndex: number;
    activeFieldKey: string;
    initFocusManager: (keys: string[]) => void;
    nextField (): void;
}

export const createFocusManagerState: StateCreator<FieldManagerState> = (set) => ({
    fieldKeys: [],
    fieldCount: 0,
    activeFieldIndex: 0,
    activeFieldKey: "",
    initFocusManager: (keys) => set({ 
        fieldKeys: [...keys, SECTION_DONE], 
        fieldCount: keys.length, 
        activeFieldIndex: 0,
        activeFieldKey: keys[0]}),
    nextField: () => set((state) => ({ activeFieldIndex: state.activeFieldIndex + 1, 
                                       activeFieldKey:   state.fieldKeys[state.activeFieldIndex + 1] })),
})
