import './App.css';
import Home from '../Home/Home';
import Checkout from '../Checkout/Checkout'
import Reporting from '../Reports/Reporting';
import VendorManagement from '../Vendor Management/VendorManagement';
import { BrowserRouter, Route, Routes, } from "react-router-dom";
import { AlertBanner } from '../../Components/Popups/Alerts';
import { PopupModal } from '../../Components/Popups/Modals';
import { usePopupStore } from '../../Components/Popups/PopupDefnitions';

function App() {

  const { modal } = usePopupStore();

  return (
    <div className={`app-container ${modal ? 'blurred' : 'App'}`}>
      <header className="App-header">
        <AlertBanner />
          <BrowserRouter>
            <PopupModal />
            <Routes>
              <Route path="/"  element={<Home />}/>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/reporting" element={<Reporting/>} />
              <Route path="/vendormanagement" element={<VendorManagement/>} />
            </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
