import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminHeader from "./layouts/AdminHeader";
import AdminSideBar from "./layouts/AdminSideBar";
import AdminFooter from "./layouts/AdminFooter";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddStaffMember() {
  const navigate = useNavigate();

  const categoryCollectionRef = collection(db, "staff_members");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [catName, setCatName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const handleAddStaffMember = async () => {
    if (catName && phoneNo) {
      //Ensure phone matches the format of 07XXXXXXXX or 011xxxxxxx i.e 0114122162
      const phoneRegex = /^(07\d{8}|011\d{7})$/;
      if (!phoneRegex.test(phoneNo)) {
        setErrorMsg("Invalid phone number format. Please use 07XXXXXXXX or 011xxxxxxx format.");
        return;
      }
      setErrorMsg("");
      await addDoc(categoryCollectionRef, { name: catName, phoneNo: phoneNo });
      setSuccessMsg("Staff Member added successfully!");
      setTimeout(() => {
        setSuccessMsg("");
        navigate("/staff");
      }, 1000);
    } else {
      setErrorMsg("Staff Member name or Phone Number required!");
    }
  };
  return (
    <>
      <AdminHeader />
      <AdminSideBar />
      <div className="main-panel">
        <div className="content">
          <div className="container-fluid">
            <h4 className="page-title">Create Staff Member</h4>
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">
                      New Staff Member Details
                      <Link to="/staff" className="btn btn-danger btn-sm float-right">
                        Go BACK
                      </Link>{" "}
                    </div>
                  </div>
                  <div className="card-body px-4">
                    <div className="form-group">
                      <label htmlFor="name">Staff Member Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={catName}
                        id="name"
                        onChange={(event) => {
                          setCatName(event.target.value);
                        }}
                        placeholder="Enter Staff Member Name"
                      />
                    </div>
                  </div>
                  <div className="card-body px-4">
                    <div className="form-group">
                      <label htmlFor="phone">Staff Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={phoneNo}
                        id="phone"
                        onChange={(event) => {
                          setPhoneNo(event.target.value);
                        }}
                        placeholder="Enter Staff Phone Number"
                      />
                    </div>
                  </div>
                  <div className="form-group px-4 mb-3">
                    <div className="text-center text-danger">{errorMsg}</div>
                    <div className="text-center text-success">{successMsg}</div>
                    <button className="btn btn-primary mx-3" onClick={handleAddStaffMember}>
                      Add Staff Member
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AdminFooter />
      </div>
    </>
  );
}
