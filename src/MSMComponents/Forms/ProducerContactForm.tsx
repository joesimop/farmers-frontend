import React, { useState } from 'react';
import { ProducerContact } from '../../lib/Constants/Types';
import MSMFormField from '@MSMComponents/Form Flow/MSMFormField';
import MSMTextInput from '@MSMComponents/Inputs/MSMTextInput';
import MSMForm from '@MSMComponents/Form Flow/MSMForm';
import { z } from "zod";


// Props for ProducerContactForm
interface ProducerContactFormProps {
  onAddProducer: (contact: ProducerContact) => void;
}

const ProducerContactForm: React.FC<ProducerContactFormProps> = ({ onAddProducer }) => {

  const addProducer = (data: any) => {
    onAddProducer({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.producer_email
    })
  }

  const ProducerContactSchema = z.object({
    "first_name": z.string()
      .min(1, "First Name is required.")
      .max(50, "First Name must not exceed 50 characters."),
    "last_name": z.string()
      .min(1, "Last Name is required.")
      .max(50, "Last Name must not exceed 50 characters."),
    "producer_email": z.string()
      .email("Must be a valid email address.")
      .min(1, "Email is required."),
  });

  return (
    <MSMForm
      schema={ProducerContactSchema}
      submitButtonText="Add Producer"
      onSubmit={addProducer}
      row
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', justifyContent: 'space-between' }}>

        {/* First Name */}
        <MSMFormField name="first_name" label="First Name">
          {({ field }) =>
            <MSMTextInput
              value={field.value}
              onChange={field.onChange}
              ref={field.ref}
            />
          }
        </MSMFormField>

        {/* Last Name */}
        <MSMFormField name="last_name" label="Last Name">
          {({ field }) =>
            <MSMTextInput
              value={field.value}
              onChange={field.onChange}
              ref={field.ref}
            />
          }
        </MSMFormField>

        {/* Email */}
        <MSMFormField name="producer_email" label="Email">
          {({ field }) =>
            <MSMTextInput
              value={field.value}
              onChange={field.onChange}
              ref={field.ref}
            />
          }
        </MSMFormField>
      </div>
    </MSMForm>
  );
};

export default ProducerContactForm;
