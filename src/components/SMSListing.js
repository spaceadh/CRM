import React, { useState, useEffect } from "react";
import AdminHeader from "./layouts/AdminHeader";
import AdminSideBar from "./layouts/AdminSideBar";
import AdminFooter from "./layouts/AdminFooter";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

export default function SMSListing() {
  const [smsListing, setSmsListing] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30); // Adjust as needed
  const [filters, setFilters] = useState({
    assignedto: "",
    location: "",
    dayofWeek: "",
    smsDeliveryStatus: "",
  });

  const productsCollectionRef = collection(db, "test_crm_sms");

  // Get data from Firestore
  const getTypes = async () => {
    const data = await getDocs(productsCollectionRef);
    const customers = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setSmsListing(customers);
    setFilteredData(customers);
  };

  // Apply filters and search
  useEffect(() => {
    let result = smsListing;

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
    if (filters.smsDeliveryStatus) {
      result = result.filter(customer => 
        customer.dayofWeek === filters.smsDeliveryStatus
      );
    }

    setFilteredData(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, filters, smsListing]);

  // Get unique values for filter dropdowns
  const getUniqueValues = (key) => {
    return [...new Set(smsListing.map(item => item[key]))].filter(Boolean);
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
                      SMS List{" "}
                      <Link to="/createSMSCampaign" className="btn btn-primary btn-sm float-right">
                        Create SMS Campaign
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
                          value={filters.smsDeliveryStatus}
                          onChange={(e) => setFilters({...filters, smsDeliveryStatus: e.target.value})}
                        >
                          <option value="">Filter by Delivery Status</option>
                          {getUniqueValues('smsDeliveryStatus').map((person) => (
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
                            <th>Client Name</th>
                            <th>Client Assigned To</th>
                            <th>Client Business Name</th>
                            <th>Client Location</th>
                            <th>Client Phone Number</th>
                            <th>Date</th>
                            <th>SMS Delivery Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.map((sms, index) => (
                            <tr key={sms.id}>
                              <td>{indexOfFirstItem + index + 1}</td>
                              <td>
                                {sms.clientname}
                              </td>
                              <td>{sms.assignedto}</td>
                              <td>{sms.businessname}</td>
                              <td>{sms.location}</td>
                              <td>{sms.phoneNumber}</td>
                              <td>{sms.dayofWeek}</td>
                              <td>{sms.date}</td>
                              <th>{sms.smsDeliveryStatus}</th>
                              {/* View */}
                              <td>
                                <Link to={`/sms/${sms.id}`}></Link>
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