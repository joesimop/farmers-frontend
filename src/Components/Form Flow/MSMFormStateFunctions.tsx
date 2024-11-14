import { useMSMFormStore } from "./MSMFormState";

// Focuses to the next field in the state
export function nextMSMFormField() {
  useMSMFormStore.getState().nextField();
}

// Enables next section and sets the focus to the first field
// in that section
export function nextMSMFormSection() {
  useMSMFormStore.getState().nextSection();
}

// Sets sectionIndex and formIndex to 0. 
export function resetMSMForm() {
    useMSMFormStore.getState().resetSectionManager();
}