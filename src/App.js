import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import { auth } from "./firebase";

import Dashboard from "./components/Dashboard";
import AdminLogin from "./components/AdminLogin";
import AdminRegister from "./components/AdminRegister";
import AdminProfile from "./components/AdminProfile";
import StaffMember from "./components/StaffMember";
import SMSListing from './components/SMSListing';
import AddStaffMember from "./components/AddStaffMember";
import UpdateStaffMember from "./components/UpdateStaffMember";
import UploadData from "./components/UploadData";
// import MedicineTypes from "./components/MedicineTypes";
// import AddType from "./components/AddType";
// import UpdateType from "./components/UpdateType";
import Inventory from "./components/Inventory";
import AddProduct from "./components/AddProduct";
import CreateSMSCampaign from "./components/CreateSMSCampaign";
import UpdateProduct from "./components/UpdateProduct";

function App() {
  return (
    <BrowserRouter>
      {/* <AuthListener /> */}
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/register" element={<AdminRegister />} />
        <Route path="/profile" element={<AdminProfile />} />
        <Route path="/staff" element={<StaffMember />} />
        <Route path="/sms" element={<SMSListing />} />
        <Route path="/addstaffmember" element={<AddStaffMember />} />
        <Route path="/updatestaffmember" element={<UpdateStaffMember />} />
        <Route path="/upload" element={<UploadData />} />
        {/* <Route path="/types" element={<MedicineTypes />} /> */}
        {/* <Route path="/addtype" element={<AddType />} />
        <Route path="/updatetype" element={<UpdateType />} /> */}
        <Route path="/clients" element={<Inventory />} />
        <Route path="/addClient" element={<AddProduct />} />
        <Route path="/createSMSCampaign" element={<CreateSMSCampaign />} />
        <Route path="/updateclientDetails" element={<UpdateProduct />} />
      </Routes>
    </BrowserRouter>
  );
}

function AuthListener() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  return null;
}

export default App;