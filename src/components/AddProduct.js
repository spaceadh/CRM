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
  const categoriesCollectionReference = collection(db, "inventory_categories");

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
  const productsCollectionRef = collection(db, "customer_database");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [product, setInventory] = useState({
    name: "",
    rating: "",
    category: "",
    type: "",
    description: "",
    price: "",
    stock: "",
    imgUrl: "",
    rating: "",
    originalPrice: ""
  });

  const handleAddMedicine = async () => {
    if (
      product.name &&
      product.rating &&
      product.description &&
      product.category &&
      product.price &&
      product.stock &&
      product.imgUrl &&
      product.originalPrice
    ) {
      setErrorMsg("");
      const rating = parseFloat(product.rating) <= 5 ? product.rating.toString() : "5";

      await addDoc(productsCollectionRef, {
        ...product,
        price: parseFloat(product.price),
        stock: parseInt(product.stock, 10),
        rating: rating,
        description: product.description,
        discount:
        product.originalPrice && parseFloat(product.originalPrice) !== parseFloat(product.price)
          ? parseFloat(product.originalPrice) - parseFloat(product.price)
          : null,
        // discount: product.originalPrice && product.originalPrice !== product.price ? product.originalPrice - product.price : null
      });
      setSuccessMsg("Inventory added successfully!");
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
            <h4 className="page-title">Create Inventory Product</h4>
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">
                      New Inventory Product Details
                      <Link to="/inventory" className="btn btn-danger btn-sm float-right">
                        Go BACK
                      </Link>
                    </div>
                  </div>
                  <div className="card-body px-4">
                    <div className="form-group">
                      <label htmlFor="name">Inventory Product Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={product.name}
                        id="name"
                        onChange={(event) =>
                          setInventory((prev) => ({ ...prev, name: event.target.value }))
                        }
                        placeholder="Enter Inventory Product Name"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="rating">Inventory Product Rating</label>
                      <input
                        type="text"
                        className="form-control"
                        value={product.rating}
                        id="rating"
                        onChange={(event) =>
                          setInventory((prev) => ({ ...prev, rating: event.target.value }))
                        }
                        placeholder="Enter Inventory Product Rating"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="imgUrl">Inventory Product Description</label>
                      <input
                        type="text"
                        className="form-control"
                        value={product.description}
                        id="imgUrl"
                        onChange={(event) =>
                          setInventory((prev) => ({ ...prev, description: event.target.value }))
                        }
                        placeholder="Enter Inventory Product Description"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="category">Inventory Product Category</label>
                      <select
                        className="form-control"
                        value={product.category}
                        onChange={(event) =>
                          setInventory((prev) => ({ ...prev, category: event.target.value }))
                        }
                        id="category"
                      >
                        <option value="">Select a Category...</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="price">Inventory Product Price (in Kshs)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={product.price}
                        id="price"
                        onChange={(event) =>
                          setInventory((prev) => ({ ...prev, price: event.target.value }))
                        }
                        placeholder="Enter Inventory Product Price"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="originalPrice">Inventory Product Original Price</label>
                      <input
                        type="number"
                        className="form-control"
                        value={product.originalPrice}
                        id="originalPrice"
                        onChange={(event) =>
                          setInventory((prev) => ({ ...prev, originalPrice: event.target.value }))
                        }
                        placeholder="Enter Inventory Product Original Price (Non Discounted)"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="stock">Inventory Product Stock</label>
                      <input
                        type="number"
                        className="form-control"
                        value={product.stock}
                        id="stock"
                        onChange={(event) =>
                          setInventory((prev) => ({ ...prev, stock: event.target.value }))
                        }
                        placeholder="Enter Inventory Product Stock"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="imgUrl">Inventory Product Image Url</label>
                      <input
                        type="url"
                        className="form-control"
                        value={product.imgUrl}
                        id="imgUrl"
                        onChange={(event) =>
                          setInventory((prev) => ({ ...prev, imgUrl: event.target.value }))
                        }
                        placeholder="Enter Inventory Product Image Url"
                      />
                    </div>
                  </div>

                  <div className="form-group px-4 mb-3">
                    <div className="text-center text-danger">{errorMsg}</div>
                    <div className="text-center text-success">{successMsg}</div>
                    <button className="btn btn-primary mx-3" onClick={handleAddMedicine}>
                      Add Inventory Product
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
