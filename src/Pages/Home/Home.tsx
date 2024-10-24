import React from 'react';
import './Home.css'; // External CSS for styling and animations
import { useNavigate } from 'react-router-dom'; // For navigation
import CustomButton from '../../Components/CustomButton/CustomButton';
import Alert from '@mui/material/Alert';
import { APIResponseHandlingFunctions } from '../../Components/API Definitions/APICalls';
import axios from 'axios';
import { log } from 'console';

const Home = () => {
    const navigate = useNavigate();
    const GetFromDataBase = async () => {
        
        let mFunctions: APIResponseHandlingFunctions =
        {

        };
        // GetCheckoutInitInfo(1, 1,  "", mFunctions);

    };
  return (
    <div>
        <CustomButton
            text="Go to Checkout"
            color="#1E90FF"
            textColor="#fff"
            to = 'checkout'
            animate={false} />

        <CustomButton
            text="Vendor Management"
            color="#1E90FF"
            textColor="#fff"
            to = 'vendormanagement'
            animate={false} />

        <CustomButton
            text="Reporting"
            color="#1E90FF"
            textColor="#fff"
            to = 'reporting'
            animate={false} />
        <CustomButton
            text="Get dat ish"
            color="#1E90FF"
            textColor="#fff"
            onClick = {GetFromDataBase}
            animate={false} />

            
        <Alert severity="success">This is a success Alert.</Alert>

    </div>

  );
};

export default Home;