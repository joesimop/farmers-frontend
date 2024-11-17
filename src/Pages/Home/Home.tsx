import './Home.css'; // External CSS for styling and animations
import { DisplayAlert, DisplayModal } from '../../Components/Popups/PopupHelpers';
import PrimaryButton from '../../Components/Buttons/PrimaryButton';
import { useNavigate } from 'react-router-dom';
import CreateVendorForm from '../../Components/Forms/CreateVendorFrom';

const Home = () => {

  const navigate = useNavigate();

  return (
    <div>
        <PrimaryButton
            text="Go to Checkout"
            onClick={() => {navigate('checkout')}} />

        <PrimaryButton
            text="Vendor Management"
            onClick={() => {navigate("vendormanagement")}} />

        <PrimaryButton
            text="Reporting"
            onClick={() => {navigate("reporting")}} />

        <PrimaryButton
            text="Test Alert"
            onClick={ () => DisplayAlert('info', "This is a Warning.")} />

    </div>

  );
};

export default Home;