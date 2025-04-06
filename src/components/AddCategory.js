import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminHeader from "./layouts/AdminHeader";
import AdminSideBar from "./layouts/AdminSideBar";
import AdminFooter from "./layouts/AdminFooter";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddCategory() {
  const navigate = useNavigate();

  const categoryCollectionRef = collection(db, "staff_members");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [catName, setCatName] = useState("");
  const handleAddCategory = async () => {
    if (catName) {
      setErrorMsg("");
      await addDoc(categoryCollectionRef, { name: catName });
      setSuccessMsg("Staff Member added successfully!");
      setTimeout(() => {
        setSuccessMsg("");
        navigate("/staff");
      }, 1000);
    } else {
      setErrorMsg("Staff Member name required!");
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
                  <div className="form-group px-4 mb-3">
                    <div className="text-center text-danger">{errorMsg}</div>
                    <div className="text-center text-success">{successMsg}</div>
                    <button className="btn btn-primary mx-3" onClick={handleAddCategory}>
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
