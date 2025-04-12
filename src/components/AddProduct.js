import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminHeader from "./layouts/AdminHeader";
import AdminSideBar from "./layouts/AdminSideBar";
import AdminFooter from "./layouts/AdminFooter";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const categoriesCollectionReference = collection(db, "staff_members");

  const getCategories = async () => {
    const data = await getDocs(categoriesCollectionReference);
    setCategories(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const [productTypes, setMedTypes] = useState([]);
  const productTypesCollectionRef = collection(db, "medicine_types");

  const getTypes = async () => {
    const data = await getDocs(productTypesCollectionRef);
    setMedTypes(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getCategories();
    getTypes();
  }, []);
  const productsCollectionRef = collection(db, "test_customer_database");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [product, setInventory] = useState({
    clientname: "",
    rating: "",
    assignedto: "",
    businessname: "",
    location: "",
    phoneNumber: "",
    rating: "",
  });

  const handleClientsDetails = async () => {
    // if (
    //   product.clientname &&
    //   product.rating &&
    //   product.assignedto &&
    //   product.businessname &&
    //   product.location &&
    //   product.phoneNumber
    // ) {
      setErrorMsg("");
      const rating = parseFloat(product.rating) <= 5 ? product.rating.toString() : "5";

      await addDoc(productsCollectionRef, {
        ...product,
        businessname: product.businessname ? product.businessname : "N/A",
        location: product.location ? product.location : "N/A",
        rating: rating ? rating : "N/A",  
        phoneNumber: product.phoneNumber ? product.phoneNumber : "N/A",
        assignedto: product.assignedto ? product.assignedto : "N/A",
        // discount:
        // product.originalPrice && parseFloat(product.originalPrice) !== parseFloat(product.businessname)
        //   ? parseFloat(product.originalPrice) - parseFloat(product.businessname)
        //   : null,
        // discount: product.originalPrice && product.originalPrice !== product.businessname ? product.originalPrice - product.businessname : null
      });
      setSuccessMsg("Customer added successfully!");
      setTimeout(() => {
        setSuccessMsg("");
        navigate("/clients");
      }, 1000);
    // } else {
    //   console.log(product);
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
            <h4 className="page-title">Add Client Details</h4>
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">
                      New Inventory Product Details
                      <Link to="/clients" className="btn btn-danger btn-sm float-right">
                        Go BACK
                      </Link>
                    </div>
                  </div>
                  <div className="card-body px-4">
                    <div className="form-group">
                      <label htmlFor="clientname">Enter Client Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={product.clientname}
                        id="clientname"
                        onChange={(event) =>
                          setInventory((prev) => ({ ...prev, clientname: event.target.value }))
                        }
                        placeholder="Enter Client Name"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="rating">Enter Customer Rating</label>
                      <input
                        type="number"
                        className="form-control"
                        value={product.rating}
                        id="rating"
                        onChange={(event) =>
                          setInventory((prev) => ({ ...prev, rating: event.target.value }))
                        }
                        placeholder="Enter Customer Rating"
                      />
                    </div>
                    {/* <div className="form-group">
                      <label htmlFor="phoneNumber">Inventory Product Description</label>
                      <input
                        type="text"
                        className="form-control"
                        value={product.description}
                        id="phoneNumber"
                        onChange={(event) =>
                          setInventory((prev) => ({ ...prev, description: event.target.value }))
                        }
                        placeholder="Enter Inventory Product Description"
                      />
                    </div> */}
                    <div className="form-group">
                      <label htmlFor="assignedto">Client Assigned to</label>
                      <select
                        className="form-control"
                        value={product.assignedto}
                        onChange={(event) =>
                          setInventory((prev) => ({ ...prev, assignedto: event.target.value }))
                        }
                        id="assignedto"
                      >
                        <option value="">Client Assigned To ...</option>
                        {categories.map((assignedto) => (
                          <option key={assignedto.id} value={assignedto.name}>
                            {assignedto.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="businessname">Client`s Business name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={product.businessname}
                        id="businessname"
                        onChange={(event) =>
                          setInventory((prev) => ({ ...prev, businessname: event.target.value }))
                        }
                        placeholder="Enter Business name"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="location">Customer Location</label>
                      <input
                        className="form-control"
                        value={product.location}
                        id="location"
                        onChange={(event) =>
                          setInventory((prev) => ({ ...prev, location: event.target.value }))
                        }
                        placeholder="Enter Customer Location"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phoneNumber">Customer Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={product.phoneNumber}
                        id="phoneNumber"
                        onChange={(event) =>
                          setInventory((prev) => ({ ...prev, phoneNumber: event.target.value }))
                        }
                        placeholder="Enter Customer Phone Number"
                      />
                    </div>
                  </div>

                  <div className="form-group px-4 mb-3">
                    <div className="text-center text-danger">{errorMsg}</div>
                    <div className="text-center text-success">{successMsg}</div>
                    <button className="btn btn-primary mx-3" onClick={handleClientsDetails}>
                      Add Client Details
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
