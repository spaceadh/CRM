import React, { useState, useEffect } from "react";
import AdminHeader from "./layouts/AdminHeader";
import AdminSideBar from "./layouts/AdminSideBar";
import AdminFooter from "./layouts/AdminFooter";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

export default function CustomerInventory() {
  var counter = 1;
  const [customerInventory, setcustomerInventory] = useState([]);
  const productsCollectionRef = collection(db, "test_customer_database");
  const getTypes = async () => {
    const data = await getDocs(productsCollectionRef);
    setcustomerInventory(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  const handleDeleteButton = async (id) => {
    const proDoc = doc(productsCollectionRef, id);
    await deleteDoc(proDoc);
    getTypes();
  };
  useEffect(() => {
    getTypes();
  }, []);
  return (
    <>
      <AdminHeader />
      <AdminSideBar />
      <div className="main-panel">
        <div className="content">
          <div className="container-fluid">
            <h4 className="page-title">Somafix CRM</h4>
            <div className="row">
              <div className="col-md-12">
                <div className="card card-tasks">
                  <div className="card-header ">
                    <h4 className="card-title">
                    Customer Inventory List{" "}
                      <Link to="/addClient" className="btn btn-primary btn-sm float-right">
                        Add new Customer
                      </Link>{" "}
                    </h4>
                  </div>
                  <div className="card-body ">
                    <div className="table-full-width px-5 py-4 table-striped">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>
                              Client Name<sup>Rating</sup>
                            </th>
                            <th>Client Added By</th>
                            <th>Client Business Name</th>
                            <th>Client Location</th>
                            <th>Client Phone Number</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customerInventory.map((product) => {
                            return (
                              <tr>
                                <td>{counter++}</td>
                                <td>
                                  {product.clientname} <sup>{product.power}</sup>
                                </td>
                                <td>{product.assignedto}</td>
                                <td>{product.businessname}</td>
                                <td>{product.location}</td>
                                <td>
                                  {/* <img
                                    src={product.phoneNumber}
                                    alt={product.clientname}
                                    style={{ width: "50px", height: "50px" }}
                                  /> */}
                                  <td>{product.phoneNumber}</td>
                                </td>
                                <td className="td-actions">
                                  <div className="form-button-action">
                                    <Link to="/updateclientDetails">
                                      <button
                                        type="button"
                                        className="btn btn-link btn-success"
                                        onClick={() => {
                                          sessionStorage.setItem(
                                            "customer_inventory_obj",
                                            JSON.stringify(product)
                                          );
                                        }}>
                                        <i className="la la-edit"></i>
                                      </button>
                                    </Link>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleDeleteButton(product.id);
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
