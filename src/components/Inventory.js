import React, { useState, useEffect } from "react";
import AdminHeader from "./layouts/AdminHeader";
import AdminSideBar from "./layouts/AdminSideBar";
import AdminFooter from "./layouts/AdminFooter";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

export default function CustomerInventory() {
  const [customerInventory, setCustomerInventory] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30); // Adjust as needed
  const [filters, setFilters] = useState({
    assignedto: "",
    location: "",
    dayofWeek: ""
  });

  const productsCollectionRef = collection(db, "test_customer_database");

  // Get data from Firestore
  const getTypes = async () => {
    const data = await getDocs(productsCollectionRef);
    const customers = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setCustomerInventory(customers);
    setFilteredData(customers);
  };

  // Delete a customer
  const handleDeleteButton = async (id) => {
    const proDoc = doc(productsCollectionRef, id);
    await deleteDoc(proDoc);
    getTypes();
  };

  // Apply filters and search
  useEffect(() => {
    let result = customerInventory;

    // Apply search
    if (searchTerm) {
      result = result.filter(customer =>
        Object.values(customer).some(
          val => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply filters
    if (filters.assignedto) {
      result = result.filter(customer => 
        customer.assignedto === filters.assignedto
      );
    }
    if (filters.location) {
      result = result.filter(customer => 
        customer.location === filters.location
      );
    }
    if (filters.dayofWeek) {
      result = result.filter(customer => 
        customer.dayofWeek === filters.dayofWeek
      );
    }

    setFilteredData(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, filters, customerInventory]);

  // Get unique values for filter dropdowns
  const getUniqueValues = (key) => {
    return [...new Set(customerInventory.map(item => item[key]))].filter(Boolean);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
                  <div className="card-header">
                    <h4 className="card-title">
                      Customer List{" "}
                      <Link to="/addClient" className="btn btn-primary btn-sm float-right">
                        Add new Customer
                      </Link>
                    </h4>
                  </div>
                  <div className="card-body">
                    {/* Search and Filter Section */}
                    <div className="row mb-3">
                      <div className="col-md-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search customers..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <select
                          className="form-control"
                          value={filters.assignedto}
                          onChange={(e) => setFilters({...filters, assignedto: e.target.value})}
                        >
                          <option value="">Filter by Sales Person</option>
                          {getUniqueValues('assignedto').map((person) => (
                            <option key={person} value={person}>{person}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <select
                          className="form-control"
                          value={filters.location}
                          onChange={(e) => setFilters({...filters, location: e.target.value})}
                        >
                          <option value="">Filter by Location</option>
                          {getUniqueValues('location').map((location) => (
                            <option key={location} value={location}>{location}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <select
                          className="form-control"
                          value={filters.dayofWeek}
                          onChange={(e) => setFilters({...filters, dayofWeek: e.target.value})}
                        >
                          <option value="">Filter by Day</option>
                          {getUniqueValues('dayofWeek').map((day) => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Customer Table */}
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Client Name<sup>Rating</sup></th>
                            <th>Client Added By</th>
                            <th>Client Business Name</th>
                            <th>Client Location</th>
                            <th>Client Phone Number</th>
                            <th>Day of the week</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.map((product, index) => (
                            <tr key={product.id}>
                              <td>{indexOfFirstItem + index + 1}</td>
                              <td>
                                {product.clientname} <sup>{product.rating}</sup>
                              </td>
                              <td>{product.assignedto}</td>
                              <td>{product.businessname}</td>
                              <td>{product.location}</td>
                              <td>{product.phoneNumber}</td>
                              <td>{product.dayofWeek}</td>
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
                                      }}
                                    >
                                      <i className="la la-edit"></i>
                                    </button>
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteButton(product.id)}
                                    className="btn btn-link btn-danger"
                                  >
                                    <i className="la la-times"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {filteredData.length > itemsPerPage && (
                      <nav className="mt-4">
                        <ul className="pagination justify-content-center">
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(currentPage - 1)}
                            >
                              Previous
                            </button>
                          </li>
                          {Array.from({ length: totalPages }, (_, i) => (
                            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(i + 1)}
                              >
                                {i + 1}
                              </button>
                            </li>
                          ))}
                          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(currentPage + 1)}
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </nav>
                    )}

                    {/* Results Count */}
                    <div className="text-muted mt-2">
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
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