import React, { useState } from 'react';
import MSMForm from '../Form Flow/MSMForm';
import MSMDatePicker from "@MSMComponents/Inputs/MSMDatePicker";
import { VendorType, ProducerContact } from '../../lib/Constants/Types';
import ProducerContactForm from './ProducerContactForm';
import TypedDataGrid from '../TypedDataGrid/TypedDataGrid';
import FlexGrid from '../../FlexGrid/FlexGrid';
import MSMTextInput from '@MSMComponents/Inputs/MSMTextInput';
import MSMFormField from '@MSMComponents/Form Flow/MSMFormField';
import MSMEnumDropdown from '@MSMComponents/Inputs/MSMEnumDropdown';
import MSMNumericalInput from '@MSMComponents/Inputs/MSMNumericalInput';

import { z } from "zod";

// Define the zod schema for the form
const CreateVendorFormSchema = z.object({
  "business-name": z
    .string()
    .min(1, "Business Name is required")
    .max(255, "Business Name must be less than 255 characters"),
  "vendor-type": z.nativeEnum(VendorType, {
    errorMap: () => ({ message: "Vendor Type is required" }),
  }),
  "cpc-input": z
    .number()
    .min(0, "CPC Number must be at least 0")
    .optional()
    .nullable(),
  date: z
    .date()
    .nullable()
    .refine((val) => val !== null, {
      message: "Expiration Date is required",
    }),
});
const CreateVendorForm: React.FC = () => {


  const [producerContacts, setProducerContacts] = useState<ProducerContact[]>([])

  const addProducerContact = (contact: ProducerContact) => {
    console.log(contact)
    setProducerContacts(
      (prev) => {
        return [...prev, contact]
      }
    )
  }

  return (
    <>
      <MSMForm schema={CreateVendorFormSchema}>
        <FlexGrid maxColumns={2}>

          {/* BUSINESS NAME */}
          <MSMFormField name="business-name" label="Business Name">
            {({ field }) =>
              <MSMTextInput
                value={field.value}
                onChange={field.onChange}
                ref={field.ref}
              />
            }
          </MSMFormField>
          
          {/* VENDOR TYPE */}
          <MSMFormField name="vendor-type" label="Vendor Type">
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
          <MSMFormField name="cpc-input" label="CPC Number">
            {({ field }) =>
              <MSMNumericalInput
                value={field.value}
                onChange={field.onChange}
                ref={field.ref}
              />
            }
          </MSMFormField>

          {/* CPC EXPIRATION DATE */}
          <MSMFormField name="date" label="Date">
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
        </FlexGrid>
      </MSMForm>

      <ProducerContactForm onAddProducer={addProducerContact} />

      {/* Display added producer contacts */}
      {producerContacts.length > 0 && (
        <div>
          <TypedDataGrid data={producerContacts} hideFooter hideHeader />
        </div>
      )}

    </>

  );
};

export default CreateVendorForm;
