import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import { auth } from "./firebase";

import Dashboard from "./components/Dashboard";
import AdminLogin from "./components/AdminLogin";
import AdminRegister from "./components/AdminRegister";
import AdminProfile from "./components/AdminProfile";
import ProductCategory from "./components/ProductCategory";
import OrdersCategory from './components/OrdersCategory';
import AddCategory from "./components/AddCategory";
import UpdateCategory from "./components/UpdateCategory";
// import MedicineTypes from "./components/MedicineTypes";
// import AddType from "./components/AddType";
// import UpdateType from "./components/UpdateType";
import Inventory from "./components/Inventory";
import AddProduct from "./components/AddProduct";
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
        <Route path="/categories" element={<ProductCategory />} />
        <Route path="/orders" element={<OrdersCategory />} />
        <Route path="/addcategory" element={<AddCategory />} />
        <Route path="/updatecategory" element={<UpdateCategory />} />
        {/* <Route path="/types" element={<MedicineTypes />} /> */}
        {/* <Route path="/addtype" element={<AddType />} />
        <Route path="/updatetype" element={<UpdateType />} /> */}
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/addInventory" element={<AddProduct />} />
        <Route path="/updateInventory" element={<UpdateProduct />} />
      </Routes>
    </BrowserRouter>
  );
}

// function AuthListener() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         navigate("/dashboard");
//       } else {
//         navigate("/login");
//       }
//     });

//     // Cleanup subscription on unmount
//     return () => unsubscribe();
//   }, [navigate]);

//   return null;
// }

export default App;