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
  const categoriesCollectionReference = collection(db, "inventory_categories");
  const getCategories = async () => {
    const data = await getDocs(categoriesCollectionReference);
    setCategories(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  useEffect(() => {
    getCategories();
  }, []);
  const productCollectionRef = collection(db, "customer_database");
  const [product, setProduct] = useState(JSON.parse(sessionStorage.getItem("inventory_obj")));

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const handleUpdateMedicine = async () => {
    if (
      product.name &&
      product.id &&
      product.imgUrl &&
      product.category &&
      product.price &&
      product.stock
    ) {
      const medDoc = doc(productCollectionRef, product.id);
      await updateDoc(medDoc, product);
      setErrorMsg("");
      setSuccessMsg("Product updated Successfully!");
      setTimeout(() => {
        setSuccessMsg("");
        navigate("/inventory");
      }, 1000);
    } else {
      setErrorMsg("Please fill out all the required fields!");
    }
  };
  return (
    <>
      <AdminHeader />
      <AdminSideBar />
      <div className="main-panel">
        <div className="content">
          <div className="container-fluid">
            <h4 className="page-title">Change Product</h4>
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">
                      Edit Product Details
                      <Link to="/inventory" className="btn btn-danger btn-sm float-right">
                        Go BACK
                      </Link>{" "}
                    </div>
                  </div>
                  <div className="card-body px-4">
                    <div className="form-group">
                      <label htmlFor="name">Product Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={product.name}
                        id="name"
                        onChange={(event) =>
                          setProduct((prev) => ({ ...prev, name: event.target.value }))
                        }
                        placeholder="Enter Product Name"
                      />
                    </div>

                    <div class="form-group">
                      <label for="exampleFormControlSelect1">Product Category</label>
                      <select
                        class="form-control"
                        onChange={(event) =>
                          setProduct((prev) => ({ ...prev, category: event.target.value }))
                        }
                        id="exampleFormControlSelect1">
                        <option value="">Select a Category...</option>
                        {categories.map((category) => {
                          if (category.name === product.category) {
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
                      <label htmlFor="price">Product Price (in Kshs)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={product.price}
                        id="price"
                        onChange={(event) =>
                          setProduct((prev) => ({ ...prev, price: event.target.value }))
                        }
                        placeholder="Enter Product Price"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="price">Product Image Url (in Kshs)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={product.imgUrl}
                        id="imgUrl"
                        onChange={(event) =>
                          setProduct((prev) => ({ ...prev, imgUrl: event.target.value }))
                        }
                        placeholder="Enter Product Image URL"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="stock">Product Available Stock</label>
                      <input
                        type="text"
                        className="form-control"
                        value={product.stock}
                        id="stock"
                        onChange={(event) =>
                          setProduct((prev) => ({ ...prev, stock: event.target.value }))
                        }
                        placeholder="Enter Product Stock"
                      />
                    </div>
                  </div>

                  <div className="form-group px-4 mb-3">
                    <div className="text-center text-danger">{errorMsg}</div>
                    <div className="text-center text-success">{successMsg}</div>
                    <button className="btn btn-success mx-3" onClick={handleUpdateMedicine}>
                      Update Product
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
