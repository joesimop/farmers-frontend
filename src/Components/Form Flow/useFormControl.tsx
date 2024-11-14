// useFormControl.ts
import { useRef } from 'react';
import { useFormSectionContext } from '../Form Flow/FormSection';
import useAutoField from '../Form Flow/AutoField';

export const useFormControl = (formKey: string) => {
  // Get `sectionKey` from `FormSectionContext`
  const { sectionKey, isAuto} = useFormSectionContext();

  // Create a reference for the input field
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize the field with `useAutoField`
  useAutoField(isAuto, inputRef, sectionKey, formKey);

  return inputRef;
};