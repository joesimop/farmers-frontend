import { useEffect, RefObject } from 'react';
import { useMSMFormStore } from './MSMFormState';
import { SECTION_DONE } from './FieldManagerState';


// Provides auto functionality for switching focus and section states for an inputRef object.
function useAutoField(isAuto: boolean, inputRef: RefObject<HTMLInputElement>, sectionKey: string, formKey: string, delay = 100) {

    // Subscribe field component to FormStore when it mounts.
    useEffect(() => {

      if (isAuto){
        const unsubscribeFieldChange = useMSMFormStore.subscribe(

          //Subscibe to changes when the acitve field changes.
          (state) => state.activeFieldKey,
          (activeFieldKey, prevFieldKey) => {
            
            // SECTION_DONE is a constant at the end of activeFields, signifying the end of that section.
            // prevFieldKey === formKey ensures that this only fired once
            if(activeFieldKey === SECTION_DONE && prevFieldKey === formKey) {
              useMSMFormStore.getState().nextSection();
              return;
            }
  
  
            //If this form is currently under focus, focus it
            const isCurrentFocus = activeFieldKey === formKey;
            
            if(isCurrentFocus) {
              const timer = setTimeout(() => {
                if(inputRef.current){
                  inputRef.current.focus();
                }
              }, delay);
      
              // Cleanup function to clear the timeout
              return () => clearTimeout(timer);
            }
        });
  
        // Subscribe on section change
        const unsubscribeSectionChange = useMSMFormStore.subscribe(
  
          //When the section key changes
          (state) => state.activeSectionKey,
          (activeSectionKey) => {
  
            const isActiveSection = activeSectionKey === sectionKey;
  
            // Make sure user can't tab into fields that are not in the active section
            if (inputRef.current) {
              if (isActiveSection) {
                inputRef.current.tabIndex = 0;
              } else {
                inputRef.current.tabIndex = -1;
              }
            }
  
        });
  
        // Cleanup subscriptions on unmount
        return () => {
          unsubscribeFieldChange();
          unsubscribeSectionChange();
        };
      }
    }, []);
  }
  
  export default useAutoField;