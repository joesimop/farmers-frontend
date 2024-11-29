import React, { useEffect, useRef } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ShadcnComponents/ui/button";
import { z } from "zod";

interface MSMFormProps {
    schema?: any;                     // Zod schema for validation
    children: React.ReactNode;       // List of MSMFormField components
    onSubmit?: (data: any) => void;   // Callback for form submission
    autoFocusField?: string;         // Field to autofocus on mount
    submitButtonText?: string;       // Overrides submit button text
    hasClearButton?: boolean;        // Adds clear form button if true
    centerSubmitButton?: boolean;    // Centers button and makes full width
    isAuto?: boolean;                // Automatically set focus
    row?: boolean;                   // Display form fields in a row layout
    clearOnSubmit?: boolean          // Clears form on a successful submit
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

    // Wrapper for `setFocus` with 100ms delay
    const setFocusWithDelay = (name: string, options?: { shouldSelect: boolean }) => {
        setTimeout(() => {
            setFocus(name, options);
        }, 100);
    };

    // Initialize form methods with schema resolver
    const form = useForm({
        resolver: zodResolver(schema),
    });

    const { setFocus, reset, formState } = form;

    // Store field order based on schema
    const fieldOrder = useRef(Object.keys(schema.shape));

    // Watch for changes in form values
    const values = useWatch({ control: form.control });

    // Determine if all fields have values
    const areAllFieldsFilled = fieldOrder.current.every((field) => {
        const fieldValue = values[field];
        return fieldValue !== undefined && fieldValue !== null && fieldValue !== "";
    });

    // Sequential Autofocus Logic
    useEffect(() => {
        if (isAuto) {
            for (const field of fieldOrder.current) {
                if (!values[field]) {
                    setFocusWithDelay(field);
                    break;
                }
            }
        }
    }, [values, setFocus, isAuto]);

    useEffect(() => {
        fieldOrder.current = Object.keys(schema.shape);
    }, [schema]);

    // Handle form reset to restart focus order
    const handleReset = () => {
        reset();
        if (autoFocusField) {
            setFocusWithDelay(autoFocusField);
        } else if (isAuto) {
            setFocusWithDelay(fieldOrder.current[0]);
        }
    };

    // Handle form submission
    const handleSubmit = (data: any) => onSubmit?.(data);

    return (
        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className={`${row ? "flex flex-row items-end gap-4" : ""}`}
            >
                <div className={row ? "flex flex-row gap-4 flex-grow" : ""}>{children}</div>
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
