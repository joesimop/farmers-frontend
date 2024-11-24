import { StateCreator } from 'zustand';

export interface SectionManagerState {
    sectionKeys: string[];
    sectionCount: number;
    activeSectionIndex: number;
    activeSectionKey: string;
    initSectionManger: (keys: string[]) => void;
    nextSection (): void;
    resetSectionManager:() => void;
}

export const createSectionMangerState: StateCreator<SectionManagerState> = (set) => ({
    sectionKeys: [],
    sectionCount: 0,
    activeSectionIndex: -1,
    activeSectionKey: "",
    initSectionManger: (keys) => set({ 
        sectionKeys: keys, 
        sectionCount: keys.length,
        activeSectionIndex: -1, 
        activeSectionKey: ""}),
    nextSection: () => set((state) => ({ activeSectionIndex: state.activeSectionIndex + 1,
                                         activeSectionKey:   state.sectionKeys[state.activeSectionIndex + 1]
     })),
     resetSectionManager: () => set((state) => ({
        activeSectionIndex: 0,
        activeSectionKey: state.sectionKeys[0]
     }))
})
