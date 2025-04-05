import React, { useState, useEffect } from "react";
import AdminHeader from "./layouts/AdminHeader";
import AdminSideBar from "./layouts/AdminSideBar";
import AdminFooter from "./layouts/AdminFooter";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

export default function Inventory() {
  var counter = 1;
  const [bassmartInventory, setbassmartInventory] = useState([]);
  const productsCollectionRef = collection(db, "customer_database");
  const getTypes = async () => {
    const data = await getDocs(productsCollectionRef);
    setbassmartInventory(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
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
            <h4 className="page-title">Bassmart Inventory Management</h4>
            <div className="row">
              <div className="col-md-12">
                <div className="card card-tasks">
                  <div className="card-header ">
                    <h4 className="card-title">
                      Inventory List{" "}
                      <Link to="/addInventory" className="btn btn-primary btn-sm float-right">
                        Add new Product
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
                              Product Name<sup>Rating</sup>
                            </th>
                            <th>Product Category</th>
                            <th>Product Price</th>
                            <th>Product Available stock</th>
                            <th>Product Image</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bassmartInventory.map((product) => {
                            return (
                              <tr>
                                <td>{counter++}</td>
                                <td>
                                  {product.name} <sup>{product.power}</sup>
                                </td>
                                <td>{product.category}</td>
                                <td>Ksh{product.price}</td>
                                <td>{product.stock}</td>
                                <td>
                                  <img
                                    src={product.imgUrl}
                                    alt={product.name}
                                    style={{ width: "50px", height: "50px" }}
                                  />
                                </td>
                                <td className="td-actions">
                                  <div className="form-button-action">
                                    <Link to="/updateInventory">
                                      <button
                                        type="button"
                                        className="btn btn-link btn-success"
                                        onClick={() => {
                                          sessionStorage.setItem(
                                            "inventory_obj",
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
