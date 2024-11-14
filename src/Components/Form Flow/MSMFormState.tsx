import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { SectionManagerState, createSectionMangerState } from './SectionManagerState';
import { FieldManagerState, createFocusManagerState } from './FieldManagerState';

type MSMFormState = SectionManagerState & FieldManagerState;

//Stores both the state for both the section and field
export const useMSMFormStore = create<MSMFormState, [["zustand/subscribeWithSelector", never]]>(
    subscribeWithSelector((...args) => ({
      ...createSectionMangerState(...args),
      ...createFocusManagerState(...args),
    }))
  );