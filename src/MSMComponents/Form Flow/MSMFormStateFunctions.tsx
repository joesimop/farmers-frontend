import { truncate } from "fs/promises";
import { FieldState } from "../../lib/Constants/Types";
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

export function initSectionState(sectionKeys: string[]) {
  useMSMFormStore.getState().initSectionManger(sectionKeys);
  useMSMFormStore.getState().nextSection();
}

// Intended to be used by programmers to reset a form without completely reloading
export function resetMSMFormSections() {
    useMSMFormStore.getState().resetSectionManager();
}

// Completely resets form states.
export function resetMSMForm() {
  useMSMFormStore.getState().resetSectionManager();
  useMSMFormStore.getState().resetFocusManager()
}

//Used once Section States is initialized.
export function initFieldState(fieldKeys: string[]) {
  useMSMFormStore.getState().initFocusManager(fieldKeys);
  useMSMFormStore.getState().nextField();
}

//Sets the validation state of a field
//NOTE: It is up to the field components themselves to let the state know thier state.
export function setFieldValidationState(formKey: string, isValid: boolean){
  useMSMFormStore.getState().setFieldValidationState(formKey, 
    isValid ? FieldState.VALID : FieldState.INVALILD)
}

//Returns true if every field in form is of state VALID
// and we are on the last section
export function isFormValid() {
  const validationStates = getValidationStates();
  const sectionKeysLength = useMSMFormStore.getState().sectionKeys.length
  const activeSectionIndex = useMSMFormStore.getState().activeSectionIndex
  return Object.values(validationStates).every( (state) => state === FieldState.VALID ) && 
         activeSectionIndex == sectionKeysLength - 1 
}

export function getValidationStates() {
  return useMSMFormStore.getState().fieldValidationStates
}

export function addToFieldValidationStates(keys: string[]) {
  keys.forEach((key) => {
    useMSMFormStore.getState().setFieldValidationState(key, FieldState.VALID)
  });
}