import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import AdminHeader from "./layouts/AdminHeader";
import AdminSideBar from "./layouts/AdminSideBar";
import AdminFooter from "./layouts/AdminFooter";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function ClientExcelUploader() {
  const [previewData, setPreviewData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedSheets, setSelectedSheets] = useState([]);

  // const handleFileUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const reader = new FileReader();

  //   reader.onload = (evt) => {
  //     const bstr = evt.target.result;
  //     const wb = XLSX.read(bstr, { type: "binary" });

  //     // Process all sheets or just the first one
  //     const wsname = wb.SheetNames[0]; // Or loop through all sheets if needed
  //     const ws = wb.Sheets[wsname];

  //     const rawData = XLSX.utils.sheet_to_json(ws, {
  //       header: ["customer", "location", "contact", "salesPersonel"], // Match Excel columns
  //       defval: "",
  //       range: 1, // Skip header row
  //     });

  //     console.log("Raw Excel data:", rawData);

  //     const formatted = rawData
  //       .filter(row => row.customer && row.customer.trim() !== "") // Filter out empty rows
  //       .map((entry) => {
  //         // Split customer name if it contains "&" or "/" for business name
         
  //         // const [clientname = "", businessname = ""] = 
  //         //   (entry.customer || "").split(/[&/]/).map(s => s.trim());
  //         const clientname = entry.customer.trim(); // Use the full customer name as clientname
            
  //         return {
  //           clientname,
  //           // businessname: businessname || clientname, // Fallback to clientname if no businessname
  //           businessname: clientname, // Fallback to clientname if no businessname
  //           location: (entry.location || "").trim(),
  //           phoneNumber: (entry.contact || "").trim(), // Map 'contact' to 'phoneNumber'
  //           assignedto: (entry.salesPersonel || "").trim(), // Map 'salesPersonel' to 'assignedto'
  //         };
  //       });

  //     console.log("Formatted data:", formatted);
  //     setPreviewData(formatted);
  //   };

  //   reader.readAsBinaryString(file);
  // };

  // Rest of the component remains the same...
  const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
  
      reader.onload = (evt) => {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        
        // Get all sheet names
        const sheetNames = wb.SheetNames;
        setSelectedSheets(sheetNames); // Store for UI selection if needed
  
        // Process all sheets by default (or implement sheet selection UI)
        let allData = [];
        
        sheetNames.forEach(sheetName => {
          const ws = wb.Sheets[sheetName];
          console.log(`Processing sheet: ${sheetName}`);
          const rawData = XLSX.utils.sheet_to_json(ws, {
            header: ["customer", "location", "contact", "salesPersonel"],
            defval: "",
            range: 1, // Skip header row
          });
  
          const sheetData = rawData
            .filter(row => row.customer && row.customer.trim() !== "")
            .map((entry) => {
              // Enhanced name splitting for hardware stores
              let [clientname, businessname] = (entry.customer || "").split(/(?:\s+-\s+|,\s+|&\s+|\/|\s+H\/WARE\s*)/i);
              clientname = clientname.trim();
              businessname = (businessname || "").trim();
              
              // If no businessname detected but contains "H/WARE", clean up
              if (!businessname && /H\/WARE/i.test(entry.customer)) {
                clientname = entry.customer.replace(/\s*H\/WARE\s*/i, "").trim();
                businessname = "Hardware";
              }

              // Convert sales personnel name to camelCase
              const toCamelCase = (str) => {
                if (!str) return '';
                return str.trim()
                  .toLowerCase()
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
              };

  
              return {
                dayofWeek :toCamelCase(sheetName),
                clientname : toCamelCase((clientname || "").trim()),
                businessname: toCamelCase((clientname || "").trim()),
                location: toCamelCase((entry.location || "").trim()),
                phoneNumber: (entry.contact || "").trim(),
                assignedto: toCamelCase((entry.salesPersonel || "").trim()),
              };
            });
  
          allData = [...allData, ...sheetData];
        });
  
        console.log("Combined data from all sheets:", allData);
        setPreviewData(allData);
      };
  
      reader.readAsBinaryString(file);
  };

  const handleEdit = (index, field, value) => {
    const updated = [...previewData];
    updated[index][field] = value;
    setPreviewData(updated);
  };

  const handleDelete = (index) => {
    const filtered = previewData.filter((_, i) => i !== index);
    setPreviewData(filtered);
  };

  const handleApprove = async () => {
    if (previewData.length === 0) {
      alert("No data to upload!");
      return;
    }

    const confirmUpload = window.confirm("Are you sure you want to upload this data?");
    if (!confirmUpload) return;

    setUploading(true);
    const collectionRef = collection(db, "test_customer_database");

    try {
      const tasks = previewData.map((row) => addDoc(collectionRef, row));
      await Promise.all(tasks);
      alert("✅ Successfully uploaded!");
      setPreviewData([]);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed. Check console for more info.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    console.log("Preview data updated:", previewData);
  }, [previewData]);

  return (
    <>
      <AdminHeader />
      <AdminSideBar />
      <div className="main-panel">
        <div className="content">
          <div className="container-fluid">
            {!previewData.length && (
              <>
                <h3>📤 Upload Clients Excel Sheet</h3>
                <input 
                  type="file" 
                  accept=".xlsx, .xls" 
                  onChange={handleFileUpload} 
                  className="form-control mb-3" 
                />
              </>
            )}

            {previewData.length > 0 && (
              <>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="thead-dark">
                      <tr>
                        <th>#</th>
                        <th>Client Name</th>
                        <th>Business Name</th>
                        <th>Location</th>
                        <th>Phone Number</th>
                        <th>Assigned To</th>
                        <th>Day of Week</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <input
                              className="form-control"
                              value={row.clientname}
                              onChange={(e) => handleEdit(index, "clientname", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              value={row.businessname}
                              onChange={(e) => handleEdit(index, "businessname", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              value={row.location}
                              onChange={(e) => handleEdit(index, "location", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              value={row.phoneNumber}
                              onChange={(e) => handleEdit(index, "phoneNumber", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              value={row.assignedto}
                              onChange={(e) => handleEdit(index, "assignedto", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              value={row.dayofWeek}
                              onChange={(e) => handleEdit(index, "dayofWeek", e.target.value)}
                            />
                          </td>
                          <td>
                            <button 
                              className="btn btn-danger btn-sm" 
                              onClick={() => handleDelete(index)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button 
                  className="btn btn-success" 
                  onClick={handleApprove} 
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "✅ Approve & Upload"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <AdminFooter />
    </>
  );
}