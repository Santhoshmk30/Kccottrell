import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import RequestForm from './Components/Trip Forms/Requestform';
import Certification from './Components/Certification';
import Approval from './Components/Approval';
import Register from './Components/Register';
import Login from './Components/Login';
import Admin from './Components/Admin';
import Dashboard from './Components/Dashboard';
import Form from './Components/form';
import InternationalTrip from './Components/Trip Forms/InternationalTrip';
import SightAllowance from './Components/Trip Forms/SightAllowance';
import LocalTravel from './Components/Trip Forms/LocalTravel';
import VendorForm from './Components/Purchases/Vendors';
import PaymentAdvicePage from './Components/Purchases/Purchaseorder';
import CertifyPurchaseOrder from './Components/Purchases/CertifyPurchaseorder';
import VerifyPurchaseOrder from './Components/Purchases/VerifyPurchaseorder';
import AdminPurchaseOrder from './Components/Purchases/AdminPurchaseorder';
import VendorData from './Components/Purchases/Vendors History';
import VendorOverview from './Components/Purchases/VendorsDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/request" element={<RequestForm />} />
        <Route path="/certification" element={<Certification />} />
        <Route path="/approval" element={<Approval />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/form" element={<Form />} />
   <Route path="/international-trip" element={<InternationalTrip/>} />
   <Route path="/site-allowance" element={<SightAllowance/>} />
   <Route path="/local-trip" element={<LocalTravel/>}/>
    <Route path="/vendors" element={<VendorForm/>}/>
     <Route path="/paymentadvice" element={<PaymentAdvicePage/>}/>
     <Route path="/certifypurchaseorder" element={<CertifyPurchaseOrder/>}/>
      <Route path="/verifypurchaseorder" element={<VerifyPurchaseOrder/>}/>
      <Route path="/adminpurchaseorder" element={<AdminPurchaseOrder/>}/>
      <Route path="/vendordata" element={<VendorData/>}/>
      <Route path="/vendor/:vendorId" element={<VendorOverview />} />
      </Routes>
    </Router>
  );
}

export default App;