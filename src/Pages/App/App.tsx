import './App.css';
import Home from '../Home/Home';
import Checkout from '../Checkout/Checkout'
import Reporting from '../Reports/Reporting';
import VendorManagement from '../Vendor Management/VendorManagement';
import { BrowserRouter, Route, Routes, } from "react-router-dom";
import { AlertProvider } from '../../Components/Alerts/AlertContext';
import AlertBanner from '../../Components/Alerts/AlertBanner';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AlertProvider>
          <BrowserRouter>
          <AlertBanner />
            <Routes>
              <Route path="/"  element={<Home />}/>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/reporting" element={<Reporting/>} />
              <Route path="/vendormanagement" element={<VendorManagement/>} />
            </Routes>
        </BrowserRouter>
    </AlertProvider>
      </header>
    </div>
  );
}

export default App;
