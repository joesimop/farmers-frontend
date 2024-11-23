import './Home.css'; // External CSS for styling and animations
import { useNavigate } from 'react-router-dom';
import LandingButton from '../../Components/Buttons/LandingButton';
import { IconSrcs } from '../../Components/MSMIcon/Icon';
import Icon from '../../Components/MSMIcon/Icon';
const Home = () => {

  const navigate = useNavigate();

  return (
    <div className = "HomePageContainer" >

        <h1>Main Street Market</h1>

    <div className="HomePageButtonContainer">

        <LandingButton 
            imageSrc={IconSrcs.Checkout}
            text="Checkout" 
            onClick={() => {navigate('checkout')}} />

        <LandingButton
            imageSrc={IconSrcs.VendorManagement}
            text="Vendors"
            onClick={() => {navigate("vendormanagement")}} />

        <LandingButton
            imageSrc={IconSrcs.Reporting}
            text="Reporting"
            onClick={() => {navigate("reporting")}} />

      </div>

    </div>

  );
};

export default Home;