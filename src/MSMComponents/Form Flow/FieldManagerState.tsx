import { StateCreator } from 'zustand';
import { FieldState } from '../../lib/Constants/Types'; 

// Constant to append to end of fieldKeys, signifying fields are complete
export const SECTION_DONE = "SECTION_DONE";

export interface FieldManagerState {
    fieldKeys: string[];
    fieldValidationStates: Record<string, FieldState>;
    activeFieldIndex: number;
    activeFieldKey: string;
    initFocusManager: (keys: string[]) => void;
    resetFocusManager: () => void;
    nextField: () => void;
    setFieldValidationState: (formKey: string, state: FieldState) => void;

}

export const createFocusManagerState: StateCreator<FieldManagerState> = (set) => ({
    fieldKeys: [],
    fieldValidationStates: {},
    activeFieldIndex: 0,
    activeFieldKey: "",
    initFocusManager: (keys) => set((prevState) => ({ 
        fieldKeys: [...keys, SECTION_DONE], 
        activeFieldIndex: -1,
        activeFieldKey: "",
        fieldValidationStates: {
            ...prevState.fieldValidationStates,
            ...Object.fromEntries(keys.map((key) => [key, FieldState.VALID])),
        },
    })),
    nextField: () => set((state) => ({ activeFieldIndex: state.activeFieldIndex + 1, 
                                       activeFieldKey:   state.fieldKeys[state.activeFieldIndex + 1] })),
    resetFocusManager: () => set((prevState) => ({
        activeFieldIndex: -1,
        activeFieldKey: "",
        fieldValidationStates: {}
        })),

    setFieldValidationState: (formKey: string, state: FieldState) =>
        set((prevState) => ({
            fieldValidationStates: {
            ...prevState.fieldValidationStates, 
            [formKey]: state, // Update the specific key
            },
        })),
        
})
