import React, { useState } from 'react';
import TextInput from '../Inputs/TextInput';
import ActionButton from '../Buttons/ActionButton';
import { ProducerContact } from '../../lib/Constants/Types';
import SplitView from '../Layout/SplitView';

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



  // Handlers for updating the contact state
  const handleFirstNameChanged = (value: string) => {
    setContact((prev) => ({ ...prev, first_name: value }));
  };

  const handleLastNameChanged = (value: string) => {
    setContact((prev) => ({ ...prev, last_name: value }));
  };

  const handleEmailChanged = (value: string) => {
    setContact((prev) => ({ ...prev, email: value }));
  };

  return (

    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', justifyContent: 'space-between' }}>
      {/* First Name */}
      <TextInput
        label="First Name"
        defaultValue=""
        onChange={handleFirstNameChanged}
        formKey="ProducerFirstName"
      />

      {/* Last Name */}
      <TextInput
        label="Last Name"
        defaultValue=""
        onChange={handleLastNameChanged}
        formKey="ProducerLastName"
      />

      {/* Email */}
      <TextInput
        label="Email"
        defaultValue=""
        onChange={handleEmailChanged}
        formKey="ProducerEmail"
      />

      {/* Add Producer Button */}
      <ActionButton text="Add Producer" onClick={() => onAddProducer(contact)} />
    </div>
  );
};

export default ProducerContactForm;
