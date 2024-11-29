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

  const [contact, setContact] = useState<ProducerContact>({
    first_name: '',
    last_name: '',
    email: '',
  });

  const addProducer = (data: any) => {

    onAddProducer(contact)
  }

  const ProducerContactSchema = z.object({
    "first-name": z
      .string()
      .min(1, "First Name is required.")
      .max(50, "First Name must not exceed 50 characters."),
    "last-name": z
      .string()
      .min(1, "Last Name is required.")
      .max(50, "Last Name must not exceed 50 characters."),
    "producer-email": z
      .string()
      .email("Must be a valid email address.")
      .min(1, "Email is required."),
  });

  return (
    <MSMForm
      schema={ProducerContactSchema}
      submitButtonText="Add Producer"
      onSubmit={(data) => console.log(data)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', justifyContent: 'space-between' }}>

        {/* First Name */}
        <MSMFormField name="first-name" label="First Name">
          {({ field }) =>
            <MSMTextInput
              value={field.value}
              onChange={field.onChange}
              ref={field.ref}
            />
          }
        </MSMFormField>

        {/* Last Name */}
        <MSMFormField name="last-name" label="Last Name">
          {({ field }) =>
            <MSMTextInput
              value={field.value}
              onChange={field.onChange}
              ref={field.ref}
            />
          }
        </MSMFormField>

        {/* Email */}
        <MSMFormField name="producer-email" label="Email">
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
