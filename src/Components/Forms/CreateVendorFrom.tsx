import React, { useState } from 'react';
import MSMForm from '../Form Flow/MSMForm'; 
import FormSection from '../Form Flow/FormSection';
import MSMDatePicker from "../../Components/Inputs/DatePicker";
import SearchableDropdownSelector from "../../Components/Inputs/SearchableDropdownSelector";
import TextInput from '../Inputs/TextInput';
import FormData from '../Form Flow/FormData';
import NumberInput from '../Inputs/NumberInput';
import DropdownSelector from "../../Components/Inputs/DropdownSelector";
import EnumDropdownSelector from '../Inputs/EnumDropdownSelector';
import { VendorType, ProducerContact } from '../../lib/Constants/Types';
import ActionButton from '../Buttons/ActionButton';
import dayjs, { Dayjs } from 'dayjs';
// import { usePopupStore } from '../Popups/PopupDefnitions';
import ProducerContactForm from './ProducerContactForm';
import SplitView from '../Layout/SplitView';
import TypedDataGrid from '../TypedDataGrid/TypedDataGrid';
import FlexGrid from '../../FlexGrid/FlexGrid';


// Define types for props and handlers
interface CreateVendorFormProps {

}

const CreateVendorForm: React.FC<CreateVendorFormProps> = ({}) => {

    //const {  } = usePopupStore();
    
    // setConfirmDisabledCallback(() => {
    //     return true;
    // });

    const [producerContacts, setProducerContacts] = useState<ProducerContact[]>([])

    const addProducerContact = (contact: ProducerContact) => {
        console.log(contact)
        setProducerContacts(
            (prev) => {
                return [...prev, contact]
            }
        )
    }
  
  // Handlers for input changes
  const handleBusinessNameChanged = (value: string) => {
    // Update state or form context with business name
  };

  const handleCurrentCpcChanged = (value: string) => {
    // Update state or form context with current CPC
  };

  const handleCpcExprChanged = (date: Dayjs | null) => {
    // Update state or form context with CPC expiration date
  };

  const handleTypeChanged = (value: string) => {
    // Update state or form context with vendor type
  };

  return (
    <div>
        <MSMForm onSubmit={() => console.log("Fields filled out.")}>
            <FormSection sectionKey="VendorCreation" isNested>
                <FlexGrid maxColumns={2}>
                        {/* BUSINESS NAME */}
                    <TextInput
                    label="Business Name"
                    defaultValue=""
                    onEnter={handleBusinessNameChanged}
                    formKey="BuisnessName"
                    validateInput
                    />

                    {/* VENDOR TYPE */}
                    <EnumDropdownSelector
                        enumObject={VendorType}
                        defaultValue={VendorType.ANCILLARY}
                        onChanged={handleTypeChanged}
                        formKey="VendorType"
                    />

                    {/* CURRENT CPC */}
                    <TextInput
                    label="Current CPC"
                    onEnter={handleCurrentCpcChanged}
                    formKey="CPC"
                    validateInput
                    />

                    {/* CPC EXPIRATION DATE */}
                    <MSMDatePicker
                    defaultDate={dayjs()}
                    onDateChanged={handleCpcExprChanged}
                    formKey="CPCExpiration"
                    validateInput
                    />
                </FlexGrid>
            </FormSection>
            <FormData>
                <hr></hr>
            </FormData>

            
            <ProducerContactForm onAddProducer={addProducerContact}/>
            
            <FormData>
            {/* Display added producer contacts */}
            {producerContacts.length > 0 && (
                <div>
                    <TypedDataGrid data={producerContacts} hideFooter hideHeader/>
                </div>
            )}
            </FormData>
                   
        </MSMForm>
    </div>


    
  );
};

export default CreateVendorForm;
