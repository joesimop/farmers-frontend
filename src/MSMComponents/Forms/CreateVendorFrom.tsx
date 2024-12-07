import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import MSMForm, { MSMFormRef } from '../Form Flow/MSMForm';
import MSMDatePicker from "@MSMComponents/Inputs/MSMDatePicker";
import { VendorType, ProducerContact, CreateVendor } from '../../lib/Constants/Types';
import ProducerContactForm from './ProducerContactForm';
import TypedDataGrid from '../TypedDataGrid/TypedDataGrid';
import MSMTextInput from '@MSMComponents/Inputs/MSMTextInput';
import MSMFormField from '@MSMComponents/Form Flow/MSMFormField';
import MSMEnumDropdown from '@MSMComponents/Inputs/MSMEnumDropdown';
import MSMNumericalInput from '@MSMComponents/Inputs/MSMNumericalInput';

import { z } from "zod";
import MSMHorizontalDivideLine from '@MSMComponents/Layout/MSMHorizontalDivideLine';
import { DisplayErrorAlert, DisplayModal, DisplaySuccessAlert } from '@MSMComponents/Popups/PopupHelpers';
import { Vendor } from '@lib/Constants/DataModels';
import { MarketVendor } from '@Pages/Vendor Management/VendorManagmentAPICalls';
import { axiosInstance, callEndpoint } from '@lib/API/APIDefinitions';
import { AxiosResponse } from 'axios';
import MSMFlexGrid from '@MSMComponents/Layout/MSMFlexGrid';



interface CreateVendorResponse {
  id: number;
  detail: string;
}

interface CreateVendorFormProps {
  onVendorCreated?: (vendorId: number, newVendor: CreateVendor) => void; // Callback when a vendor is created
}


const createVendorEndpoint = async (MarketManagerId: number, NewVendor: CreateVendor): Promise<AxiosResponse> => {

  let urlString = `/vendor/create`;
  return axiosInstance.post<CreateVendorResponse>(urlString, NewVendor);

}

const CreateVendorForm = forwardRef<MSMFormRef, CreateVendorFormProps>(
  ({ onVendorCreated }, ref) => {

    const [producerContacts, setProducerContacts] = useState<ProducerContact[]>([]);
    const formRef = useRef<MSMFormRef>(null);

    // Expose the formRef to the parent
    useImperativeHandle(ref, () => ({
      submit: async () => {
        if (formRef.current?.submit) {
          return await formRef.current.submit();
        }
        return false;
      },
      resetForm: () => {
        formRef.current?.resetForm?.(); // Call resetForm if available
      },
      isSubmitDisabled: formRef.current?.isSubmitDisabled ?? true, // Return the disabled state
    }));

    const addProducerContact = (contact: ProducerContact) => {
      const emailExists = producerContacts.some(
        (existingContact) => existingContact.email === contact.email
      );

      if (emailExists) {
        DisplayErrorAlert("Email already exists for vendor.");
        return;
      }

      setProducerContacts((prev) => [...prev, contact]);
    };


    const createVendor = (data: any) => {

      const newVendor = {
        business_name: data.business_name,
        current_cpc: data.cpc_input.toString(),
        cpc_expr: data.cpc_expr,
        type: data.vendor_type,
        ...(producerContacts.length > 0 && { producer_contacts: producerContacts }),
      };

      callEndpoint({
        endpointCall: createVendorEndpoint(1, newVendor),
        onSuccess: (data) => {
          DisplaySuccessAlert("Vendor Created");
          onVendorCreated?.(data.id, newVendor);
          
        },
        onError: (error) => DisplayErrorAlert("Could not create vendor", error),
      });
    }
      

    // Define the zod schema for the form
    const CreateVendorFormSchema = z.object({
      "business_name": z.string()
        .min(1, "Business Name is required")
        .max(255, "Business Name must be less than 255 characters"),
      "vendor_type": z.nativeEnum(VendorType, {
        errorMap: () => ({ message: "Vendor Type is required" }),
      }),
      "cpc_input": z.number(),
      "cpc_expr": z.date()
        .nullable()
        .refine((val) => val !== null, {
          message: "Expiration Date is required",
        }),
    });

    return (
      <>
        <MSMForm schema={CreateVendorFormSchema} onSubmit={createVendor} ref={formRef} hideSubmit>
          <MSMFlexGrid maxColumns={2}>

            {/* BUSINESS NAME */}
            <MSMFormField name="business_name" label="Business Name">
              {({ field }) =>
                <MSMTextInput
                  value={field.value}
                  onChange={field.onChange}
                  ref={field.ref}
                />
              }
            </MSMFormField>

            {/* VENDOR TYPE */}
            <MSMFormField name="vendor_type" label="Vendor Type">
              {({ field }) =>
                <MSMEnumDropdown
                  enumObject={VendorType}
                  value={field.value}
                  onChange={field.onChange}
                  ref={field.ref}
                />
              }
            </MSMFormField>

            {/* CURRENT CPC */}
            <MSMFormField name="cpc_input" label="CPC Number">
              {({ field }) =>
                <MSMNumericalInput
                  value={field.value}
                  onChange={field.onChange}
                  ref={field.ref}
                />
              }
            </MSMFormField>

            {/* CPC EXPIRATION DATE */}
            <MSMFormField name="cpc_expr" label="Date">
              {({ field }) => (
                <div className="flex justify-center">
                  <MSMDatePicker
                    value={field.value}
                    onChange={field.onChange}
                    ref={field.ref}
                  />
                </div>
              )}
            </MSMFormField>
          </MSMFlexGrid>
        </MSMForm>

        <ProducerContactForm onAddProducer={addProducerContact} />

        {/* Display added producer contacts */}
        {producerContacts.length > 0 && (
          <div>
            <TypedDataGrid data={producerContacts} hiddenFields={[]} />
          </div>
        )}
      </>
    );
  });

CreateVendorForm.displayName = "CreateVendorForm";

export default CreateVendorForm;
