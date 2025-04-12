import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminHeader from "./layouts/AdminHeader";
import AdminSideBar from "./layouts/AdminSideBar";
import AdminFooter from "./layouts/AdminFooter";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { triggerSMSCampaign } from "../apis/api"; // Import your API function

export default function CreateSMSCampaign() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [template, setTemplate] = useState("Dear {ClientName}, your business {BusinessName} has been very valuable to us. We'll be visiting your {Location} area soon. Contact {AssignedTo} at {PhoneNo} for inquiries.");
  const [campaignName, setCampaignName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [filters, setFilters] = useState({
    Location: "",
    Rating: "",
    Religion: "",
    AssignedTo: ""
  });
  const [selectedVariables, setSelectedVariables] = useState([
    'ClientName', 'BusinessName', 'Location', 'AssignedTo', 'PhoneNo'
  ]);

  // Available variables with new naming convention
  const [availableVariables] = useState([
    { id: 'ClientName', label: 'Client Name' },
    { id: 'BusinessName', label: 'Business Name' },
    { id: 'Location', label: 'Location' },
    { id: 'AssignedTo', label: 'Sales Person' },
    { id: 'PhoneNo', label: 'Sales Person Phone Number' },
    { id: 'Rating', label: 'Rating' },
    { id: 'Religion', label: 'Religion' }
  ]);

  // Fetch customers from Firestore
  const getCustomerList = async () => {
    const productsCollectionRef = collection(db, "test_customer_database");
    const data = await getDocs(productsCollectionRef);
    const customersData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setCustomers(customersData);
    setFilteredCustomers(customersData);
  };

  useEffect(() => {
    getCustomerList();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = customers;

    if (filters.Location) {
      result = result.filter(customer => 
        customer.location?.toLowerCase() === filters.Location.toLowerCase()
      );
    }
    if (filters.Rating) {
      result = result.filter(customer => 
        customer.rating?.toString() === filters.Rating
      );
    }
    if (filters.Religion) {
      result = result.filter(customer => 
        customer.religion?.toLowerCase() === filters.Religion.toLowerCase()
      );
    }
    if (filters.AssignedTo) {
      result = result.filter(customer => 
        customer.assignedto?.toLowerCase() === filters.AssignedTo.toLowerCase()
      );
    }

    setFilteredCustomers(result);
  }, [filters, customers]);

  // Toggle variable selection
  const toggleVariable = (variableId) => {
    setSelectedVariables(prev =>
      prev.includes(variableId)
        ? prev.filter(id => id !== variableId)
        : [...prev, variableId]
    );
  };

  // Insert variable into template
  const insertVariable = (variable) => {
    const textarea = document.querySelector('textarea[name="template"]');
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const newTemplate = 
      template.substring(0, startPos) + 
      `{${variable}}` + 
      template.substring(endPos);
    
    setTemplate(newTemplate);
    // Set cursor position after inserted variable
    setTimeout(() => {
      textarea.selectionStart = startPos + variable.length + 2;
      textarea.selectionEnd = startPos + variable.length + 2;
      textarea.focus();
    }, 0);
  };

  // Get unique values for filter dropdowns
  const getUniqueValues = (key) => {
    const values = customers.map(item => {
      if (key === 'Location') return item.location;
      if (key === 'Rating') return item.rating;
      if (key === 'Religion') return item.religion;
      if (key === 'AssignedTo') return item.assignedto;
      return null;
    }).filter(Boolean);
    
    return [...new Set(values)];
  };

  // Preview SMS with actual values
  const previewSMS = () => {
    if (filteredCustomers.length === 0) return "No customers match current filters";
    
    const sampleCustomer = filteredCustomers[0];
    let message = template;
    
    availableVariables.forEach(variable => {
      const placeholder = `{${variable.id}}`;
      let value = '';
      
      // Map variable names to customer data fields
      if (variable.id === 'ClientName') value = sampleCustomer.clientname || '';
      if (variable.id === 'BusinessName') value = sampleCustomer.businessname || '';
      if (variable.id === 'Location') value = sampleCustomer.location || '';
      if (variable.id === 'AssignedTo') value = sampleCustomer.assignedto || '';
      if (variable.id === 'PhoneNo') value = sampleCustomer.phoneNumber || '';
      if (variable.id === 'Rating') value = sampleCustomer.rating || '';
      if (variable.id === 'Religion') value = sampleCustomer.religion || '';
      
      message = message.replace(new RegExp(placeholder, 'g'), value);
    });
    
    return message;
  };

  // Format data for SMS API
  const formatSMSData = () => {
    const messages = filteredCustomers
      .filter(customer => customer.phoneNumber) // Skip if no phoneNumber
      .map(customer => {
        let message = template;
  
        availableVariables.forEach(variable => {
          const placeholder = `{${variable.id}}`;
          let value = '';
  
          if (variable.id === 'ClientName') value = customer.clientname || '';
          if (variable.id === 'BusinessName') value = customer.businessname || '';
          if (variable.id === 'Location') value = customer.location || '';
          if (variable.id === 'AssignedTo') value = customer.assignedto || '';
          if (variable.id === 'PhoneNo') value = customer.phoneNumber || '';
          if (variable.id === 'Rating') value = customer.rating || '';
          if (variable.id === 'Religion') value = customer.religion || '';
  
          message = message.replace(new RegExp(placeholder, 'g'), value);
        });
  
        return {
          phone: customer.phoneNumber,
          message: message
        };
      });
  
    return {
      username: process.env.REACT_APP_USERNAME,
      body: {
        messages: messages
      }
    };
  };
  
  // Send SMS campaign
  const sendSMSCampaign = async () => {
    if (!campaignName) {
      setErrorMsg("Please enter a campaign name");
      return;
    }

    if (filteredCustomers.length === 0) {
      setErrorMsg("No customers match current filters");
      return;
    }

    if (!template) {
      setErrorMsg("Please create a message template");
      return;
    }

    setErrorMsg("");
    
    try {
      const smsData = formatSMSData();
      console.log("SMS Data to be sent:", smsData);
      
      // Here you would actually send to your SMS API
      // const response = await triggerSMSCampaign(smsData);
      // console.log("API Response:", response);
      
      setSuccessMsg(`Campaign "${campaignName}" prepared for ${filteredCustomers.length} recipients!`);
      setTimeout(() => navigate("/clients"), 3000);
    } catch (error) {
      setErrorMsg("Failed to prepare campaign: " + error.message);
    }
  };

  return (
    <>
      <AdminHeader />
      <AdminSideBar />
      <div className="main-panel">
        <div className="content">
          <div className="container-fluid">
            <h4 className="page-title">Create SMS Campaign</h4>
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">
                      Create SMS Campaign
                      <Link to="/dashboard" className="btn btn-danger btn-sm float-right">
                        Go BACK
                      </Link>
                    </div>
                  </div>
                  
                  <div className="card-body px-4">
                    {/* Campaign Name */}
                    <div className="form-group">
                      <label>Campaign Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        placeholder="e.g., Summer Promotion 2023"
                      />
                    </div>

                    {/* Filters */}
                    <div className="row mb-4">
                      <div className="col-md-3">
                        <label>Location</label>
                        <select
                          className="form-control"
                          value={filters.Location}
                          onChange={(e) => setFilters({...filters, Location: e.target.value})}
                        >
                          <option value="">All Locations</option>
                          {getUniqueValues('Location').map((location) => (
                            <option key={location} value={location}>{location}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label>Rating</label>
                        <select
                          className="form-control"
                          value={filters.Rating}
                          onChange={(e) => setFilters({...filters, Rating: e.target.value})}
                        >
                          <option value="">All Ratings</option>
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <option key={rating} value={rating}>{rating}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label>Religion</label>
                        <select
                          className="form-control"
                          value={filters.Religion}
                          onChange={(e) => setFilters({...filters, Religion: e.target.value})}
                        >
                          <option value="">All Religions</option>
                          {getUniqueValues('Religion').map((religion) => (
                            <option key={religion} value={religion}>{religion}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label>Assigned To</label>
                        <select
                          className="form-control"
                          value={filters.AssignedTo}
                          onChange={(e) => setFilters({...filters, AssignedTo: e.target.value})}
                        >
                          <option value="">All Staff</option>
                          {getUniqueValues('AssignedTo').map((person) => (
                            <option key={person} value={person}>{person}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Variable Selection Checkboxes */}
                    <div className="form-group mb-4">
                      <label>Select Variables to Include</label>
                      <div className="row">
                        {availableVariables.map(variable => (
                          <div className="col-md-3" key={variable.id}>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`var-${variable.id}`}
                                checked={selectedVariables.includes(variable.id)}
                                onChange={() => toggleVariable(variable.id)}
                              />
                              <label 
                                className="form-check-label" 
                                htmlFor={`var-${variable.id}`}
                              >
                                {variable.label} ({`{${variable.id}}`})
                              </label>
                              <button 
                                className="btn btn-sm btn-link p-0 ml-2"
                                onClick={() => insertVariable(variable.id)}
                                title="Insert into template"
                              >
                                <i className="la la-plus"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Template Editor */}
                    <div className="form-group">
                      <label>Message Template</label>
                      <textarea
                        className="form-control"
                        rows="5"
                        name="template"
                        value={template}
                        onChange={(e) => setTemplate(e.target.value)}
                        placeholder="Enter your message template..."
                      />
                    </div>

                    {/* Preview */}
                    <div className="form-group">
                      <label>Message Preview</label>
                      <div className="card bg-light p-3">
                        <pre>{previewSMS()}</pre>
                      </div>
                      <small className="text-muted">
                        Showing preview for first matching customer. {filteredCustomers.length} customers will receive this campaign.
                      </small>
                    </div>

                    {/* Messages */}
                    {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
                    {successMsg && <div className="alert alert-success">{successMsg}</div>}

                    {/* Submit Button */}
                    <div className="form-group">
                      <button
                        className="btn btn-primary"
                        onClick={sendSMSCampaign}
                      >
                        Prepare Campaign for {filteredCustomers.length} Recipients
                      </button>
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