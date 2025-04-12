import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminHeader from "./layouts/AdminHeader";
import AdminSideBar from "./layouts/AdminSideBar";
import AdminFooter from "./layouts/AdminFooter";
import { db } from "../firebase";
import { collection, doc, updateDoc, getDocs,deleteDoc } from "firebase/firestore";

export default function UpdateProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const categoriesCollectionReference = collection(db, "staff_members");
  const getStaffMembers = async () => {
    const data = await getDocs(categoriesCollectionReference);
    setCategories(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  useEffect(() => {
    getStaffMembers();
  }, []);

  const religions = [
    { name: "Christianity" },
    { name: "Islam" },
    { name: "Hinduism" },
    { name: "Buddhism" },
    { name: "Judaism" },
    { name: "Traditional African Religions" },
    { name: "Atheism" },
    { name: "Other" },
  ];

  const productCollectionRef = collection(db, "test_customer_database");
  const [product, setProduct] = useState(JSON.parse(sessionStorage.getItem("customer_inventory_obj")));

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const handleUpdateClientDetails = async () => {
    // if (
    //   product.clientname &&
    //   product.id &&
    //   product.phoneNumber &&
    //   product.assignedto &&
    //   product.businessname &&
    //   product.location
    // ) {
      const medDoc = doc(productCollectionRef, product.id);
      await updateDoc(medDoc, product);
      setErrorMsg("");
      setSuccessMsg("Client updated Successfully!");
      setTimeout(() => {
        setSuccessMsg("");
        navigate("/clients");
      }, 1000);
    // } else {
    //   setErrorMsg("Please fill out all the required fields!");
    // }
  };
  return (
    <>
      <AdminHeader />
      <AdminSideBar />
      <div className="main-panel">
        <div className="content">
          <div className="container-fluid">
            <h4 className="page-title">Change Client Details</h4>
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">
                      Edit Client Details
                      <Link to="/clients" className="btn btn-danger btn-sm float-right">
                        Go BACK
                      </Link>{" "}
                    </div>
                  </div>
                  <div className="card-body px-4">
                    <div className="form-group">
                      <label htmlFor="clientname">Enter Client Name i.e James</label>
                      <input
                        type="text"
                        className="form-control"
                        value={product.clientname}
                        id="clientname"
                        onChange={(event) =>
                          setProduct((prev) => ({ ...prev, clientname: event.target.value }))
                        }
                        placeholder="Enter Client Name i.e James"
                      />
                    </div>

                    <div class="form-group">
                      <label for="exampleFormControlSelect1">Client Assigned to</label>
                      <select
                        class="form-control"
                        onChange={(event) =>
                          setProduct((prev) => ({ ...prev, category: event.target.value }))
                        }
                        id="exampleFormControlSelect1">
                        <option value="">Client Assigned to...</option>
                        {categories.map((category) => {
                          if (category.name === product.assignedto) {
                            return (
                              <option value={category.name} selected="true">
                                {category.name}
                              </option>
                            );
                          } else {
                            return <option value={category.name}>{category.name}</option>;
                          }
                        })}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="businessname">Enter Business Name i.e Jumbo Hardware</label>
                      <input
                        type="text"
                        className="form-control"
                        value={product.businessname}
                        id="businessname"
                        onChange={(event) =>
                          setProduct((prev) => ({ ...prev, businessname: event.target.value }))
                        }
                        placeholder="Enter Business Name i.e Jumbo Hardware"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phoneNumber">Client Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={product.phoneNumber}
                        id="phoneNumber"
                        onChange={(event) =>
                          setProduct((prev) => ({ ...prev, phoneNumber: event.target.value }))
                        }
                        placeholder="Enter Client Phone Number"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="location">Client`s Location</label>
                      <input
                        type="text"
                        className="form-control"
                        value={product.location}
                        id="location"
                        onChange={(event) =>
                          setProduct((prev) => ({ ...prev, location: event.target.value }))
                        }
                        placeholder="Enter Location"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="dayofWeek">Day of Week</label>
                      <input
                        type="text"
                        className="form-control"
                        value={product.dayofWeek}
                        id="dayofWeek"
                        onChange={(event) =>
                          setProduct((prev) => ({ ...prev, dayofWeek: event.target.value }))
                        }
                        placeholder="Enter dayofWeek"
                      />
                    </div>

                    <div class="form-group">
                      <label for="exampleFormControlSelect1">Client Religion</label>
                      <select
                        class="form-control"
                        onChange={(event) =>
                          setProduct((prev) => ({ ...prev, religion: event.target.value }))
                        }
                        id="exampleFormControlSelect1">
                        <option value="">Client Religion...</option>
                        {religions.map((religion) => {
                          if (religion.name === product.religion) {
                            return (
                              <option value={religion.name} selected="true">
                                {religion.name}
                              </option>
                            );
                          } else {
                            return <option value={religion.name}>{religion.name}</option>;
                          }
                        })}
                      </select>
                    </div>
                  </div>

                  <div className="form-group px-4 mb-3">
                    <div className="text-center text-danger">{errorMsg}</div>
                    <div className="text-center text-success">{successMsg}</div>
                    <button className="btn btn-success mx-3" onClick={handleUpdateClientDetails}>
                      Update Client Details
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
