import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminHeader from "./layouts/AdminHeader";
import AdminSideBar from "./layouts/AdminSideBar";
import AdminFooter from "./layouts/AdminFooter";
import { db } from "../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

export default function StaffMember(props) {
  var counter = 1;
  const [staffmembers, setCategories] = useState([]);
  const categoriesCollectionReference = collection(db, "staff_members");
  const getCategories = async () => {
    const data = await getDocs(categoriesCollectionReference);
    setCategories(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  const handleDeleteButton = async (id) => {
    const categoryDoc = doc(categoriesCollectionReference, id);
    await deleteDoc(categoryDoc);
    getCategories();
  };
  useEffect(() => {
    getCategories();
  }, []);
  return (
    <>
      <AdminHeader />
      <AdminSideBar />
      <div className="main-panel">
        <div className="content">
          <div className="container-fluid">
            <h4 className="page-title">Staff Names</h4>
            <div className="row">
              <div className="col-md-12">
                <div className="card card-tasks">
                  <div className="card-header ">
                    <h4 className="card-title">
                      Staff List{" "}
                      <Link to="/addstaffmember" className="btn btn-primary btn-sm float-right">
                        Add new Staff Member
                      </Link>{" "}
                    </h4>
                  </div>
                  <div className="card-body ">
                    <div className="table-full-width px-5 py-4 table-striped">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Staff Member Name</th>
                            <th>Staff Member Phone Number</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {staffmembers.map((staff) => {
                            return (
                              <tr>
                                <td>{counter++}</td>
                                <td>{staff.name}</td>
                                <td>{staff.phoneNo}</td>
                                <td className="td-actions">
                                  <div className="form-button-action">
                                    <Link to="/updatestaffmember">
                                      <button
                                        type="button"
                                        className="btn btn-link btn-success"
                                        onClick={() => {
                                          sessionStorage.setItem(
                                            "staff_members_obj",
                                            JSON.stringify(staff)
                                          );
                                        }}>
                                        <i className="la la-edit"></i>
                                      </button>
                                    </Link>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleDeleteButton(staff.id);
                                      }}
                                      className="btn btn-link btn-danger">
                                      <i className="la la-times"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
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
