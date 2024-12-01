import React, { useEffect, useMemo } from "react";
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
}

const MSMForm: React.FC<MSMFormProps> = ({
    schema = z.object({}),
    children,
    onSubmit,
    autoFocusField,
    submitButtonText = "Submit",
    hasClearButton = false,
    centerSubmitButton = false,
    isAuto = false,
    row = false,
    clearOnSubmit = false
}) => {
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

    const handleSubmit = (data: any) => {
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

    return (
        <FormProvider {...MSMFormContext}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className={`${row ? "flex flex-row items-end gap-4" : ""}`}
            >
                <div className={row ? "flex flex-row gap-4 flex-grow" : ""}>
                    {children}
                </div>
                <div>
                    {onSubmit && (
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
};

export default MSMForm;
