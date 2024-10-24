import './App.css';
import Home from './Pages/Home/Home';
import Checkout from './Pages/Checkout/Checkout'
import Reporting from './Pages/Reports/Reporting';
import VendorManagement from './Pages/Vendor Management/VendorManagement';
import { BrowserRouter, Route, Routes, } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <BrowserRouter>
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
