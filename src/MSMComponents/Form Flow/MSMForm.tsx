import React, { forwardRef, useEffect, useImperativeHandle, useMemo } from "react";
import { FormProvider, useForm, useWatch, useFormContext, UseFormReturn, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ShadcnComponents/ui/button";
import { z } from "zod";

// Extend the UseFormReturn type to include the custom function
interface MSMUseFormReturn<T> extends UseFormReturn<FieldValues> {
    focusNextField: () => void;
}

// Create the custom hook
export const useMSMFormContext = <TFieldValues extends FieldValues = FieldValues>(): MSMUseFormReturn<TFieldValues> => {
    const context = useFormContext<TFieldValues>();

    // Ensure the context contains the `focusNextField` function
    if (!("focusNextField" in context)) {
        throw new Error("useMSMFormContext must be used within an MSMForm.");
    }

    return context as MSMUseFormReturn<TFieldValues>;
};

interface MSMFormProps {
    schema?: any;                     // Zod schema for validation
    children: React.ReactNode;        // List of MSMFormField components
    onSubmit?: (data: any) => void;   // Callback for form submission
    autoFocusField?: string;          // Field to autofocus on mount
    submitButtonText?: string;        // Overrides submit button text
    hasClearButton?: boolean;         // Adds clear form button if true
    centerSubmitButton?: boolean;     // Centers button and makes full width
    isAuto?: boolean;                 // Automatically set focus
    row?: boolean;                    // Display form fields in a row layout
    clearOnSubmit?: boolean;          // Clears form on a successful submit
    hideSubmit?: boolean;             // Indefinitely hids submit button, used when alternative button is used.
}

// Expose form methods and button interactions through the ref
export interface MSMFormRef {
    submit: () => Promise<boolean>; // Programmatically trigger the submit button
    resetForm: () => void; // Programmatically reset the form
    isSubmitDisabled: boolean; // Check if the submit button is disabled
}

const MSMForm = forwardRef<MSMFormRef, MSMFormProps>(
    (
        {
            schema = z.object({}),
            children,
            onSubmit,
            autoFocusField,
            submitButtonText = "Submit",
            hasClearButton = false,
            centerSubmitButton = false,
            isAuto = false,
            row = false,
            clearOnSubmit = false,
            hideSubmit = false
        },
        ref
    ) => {
        const fieldOrder = useMemo(() => Object.keys(schema.shape), [schema]);

        const form = useForm({
            resolver: zodResolver(schema),
        });

        const { setFocus, reset, formState } = form;
        const values = useWatch({ control: form.control });

        const areAllFieldsFilled = useMemo(() => {
            return fieldOrder.every((field) => {
                const fieldValue = values[field];
                return fieldValue !== undefined && fieldValue !== null && fieldValue !== "";
            });
        }, [fieldOrder, values]);

        const setFocusWithDelay = (name: string, options?: { shouldSelect: boolean }) => {
            setTimeout(() => {
                setFocus(name, options);
            }, 100);
        };

        // This function is passed to children via context
        // so they can signal when to move on.
        const focusNextField = () => {
            if (isAuto) {
                for (const field of fieldOrder) {
                    if (!values[field]) {
                        setFocusWithDelay(field);
                        break;
                    }
                }
            }
        };

        const handleReset = () => {
            reset();
            if (autoFocusField) {
                setFocusWithDelay(autoFocusField);
            } else if (isAuto) {
                setFocusWithDelay(fieldOrder[0]);
            }
        };

        const onFormSubmit = (data: any) => {
            console.log("fweakya")
            onSubmit?.(data);
            if (clearOnSubmit) {
                handleReset();
            }
        };

        // Add the custom method to the form context
        const MSMFormContext: MSMUseFormReturn<any> = {
            ...form,
            focusNextField,
        };

        useImperativeHandle(ref, () => ({
            submit: async (): Promise<boolean> => {
                let isSuccessful = false;

                await form.handleSubmit(
                    async (data) => {
                        try {
                            await onFormSubmit(data);
                            isSuccessful = true;
                        } catch (error) {
                            console.error("Form submission failed:", error);
                            isSuccessful = false;
                        }
                    },
                    (errors) => {
                        console.error("Validation errors:", errors);
                        isSuccessful = false;
                    }
                )();

                return isSuccessful;
            },
            resetForm: handleReset,
            isSubmitDisabled: !areAllFieldsFilled,
        }));

        return (
            <FormProvider {...MSMFormContext}>
                <form
                    onSubmit={form.handleSubmit(onFormSubmit)}
                    className={`${row ? "flex flex-row items-end gap-4" : ""}`}
                >
                    <div className={row ? "flex flex-row gap-4 flex-grow" : ""}>
                        {children}
                    </div>
                    <div>
                        {!hideSubmit && onSubmit && (
                            <Button
                                type="submit"
                                disabled={!areAllFieldsFilled}
                                className={`${centerSubmitButton ? "self-center w-full" : ""}`}>
                                {submitButtonText}
                            </Button>
                        )}
                        {hasClearButton && (
                            <Button type="button" variant="outline" onClick={handleReset}>
                                Clear
                            </Button>
                        )}
                    </div>
                </form>
            </FormProvider>
        );
    }
);

MSMForm.displayName = "MSMForm";

export default MSMForm;
