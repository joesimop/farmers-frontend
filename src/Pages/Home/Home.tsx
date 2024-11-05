import './Home.css'; // External CSS for styling and animations
import CustomButton from '../../Components/CustomButton/CustomButton';

const Home = () => {

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

    </div>

  );
};

export default Home;