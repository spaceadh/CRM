import React, { useState, useEffect } from "react";
import AdminHeader from "./layouts/AdminHeader";
import AdminSideBar from "./layouts/AdminSideBar";
import AdminFooter from "./layouts/AdminFooter";
import { db } from "../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";


export default function Dashboard(props) {
  const [customerCount, setcustomerCount] = useState(0);
  const [SMSsent, setSMSsent] = useState(0);

  useEffect(() => {
    const countCustomersAdded = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "test_customer_database"));
        setcustomerCount(querySnapshot.size);
      } catch (error) {
        console.error("Error counting documents: ", error);
      }
    };

    countCustomersAdded();
  }, []);
  useEffect(() => {
    const getSMSSent = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "test_customer_database"));
        let total = 0;
        // querySnapshot.forEach(doc => {
        //   const data = doc.data();
        //   if (data.stock) {
        //     total += parseInt(data.stock, 10); // Ensure stock is treated as an integer
        //   }
        // });
        setSMSsent(total);
      } catch (error) {
        console.error("Error calculating total stock: ", error);
      }
    };

    getSMSSent();
  }, []);
  return (
    <>
      <AdminHeader />
      <AdminSideBar />
      <div className="main-panel">
        <div className="content">
          <div className="container-fluid">
            <h4 className="page-title">Dashboard</h4>
            <div className="row">
              <div className="col-md-5">
                <div className="card card-stats card-warning" style={{ width: "400px", height: "200px" }}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-5">
                        <div className="icon-big text-center">
                          <i className="la la-users"></i>
                        </div>
                      </div>
                      <div className="col-7 d-flex align-items-center">
                        <div className="numbers">
                          <p className="card-category">Customer Count</p>
                          <h4 className="card-title">{customerCount}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-5">
                <div className="card card-stats card-success" style={{ width: "400px", height: "200px" }}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-5">
                        <div className="icon-big text-center">
                          <i className="la la-bar-chart"></i>
                        </div>
                      </div>
                      <div className="col-7 d-flex align-items-center">
                        <div className="numbers">
                          <p className="card-category">Total SMS`s sent.</p>
                          <h4 className="card-title">{SMSsent}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="row row-card-no-pd">
              {/* <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <p className="fw-bold mt-1">Total Payment Via Mpesa</p>
                    <h4>
                      <b>Ksh 3,018</b>
                    </h4>
                  </div>
                </div>
              </div> */}

              {/* <div className="col-md-5">
                <div className="card">
                  <div className="card-body">
                    <div className="progress-card">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-muted">Profit</span>
                        <span className="text-muted fw-bold"> $3K</span>
                      </div>
                      <div className="progress mb-2" style={{ height: "7px" }}>
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "78%" }}
                          aria-valuenow="78"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          data-toggle="tooltip"
                          data-placement="top"
                          title="78%"></div>
                      </div>
                    </div>
                    <div className="progress-card">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-muted">Orders</span>
                        <span className="text-muted fw-bold"> 576</span>
                      </div>
                      <div className="progress mb-2" style={{ height: "7px" }}>
                        <div
                          className="progress-bar bg-info"
                          role="progressbar"
                          style={{ width: "65%" }}
                          aria-valuenow="60"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          data-toggle="tooltip"
                          data-placement="top"
                          title="65%"></div>
                      </div>
                    </div>
                    <div className="progress-card">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-muted">Tasks Complete</span>
                        <span className="text-muted fw-bold"> 70%</span>
                      </div>
                      <div className="progress mb-2" style={{ height: "7px" }}>
                        <div
                          className="progress-bar bg-primary"
                          role="progressbar"
                          style={{ width: "70%" }}
                          aria-valuenow="70"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          data-toggle="tooltip"
                          data-placement="top"
                          title="70%"></div>
                      </div>
                    </div>
                    <div className="progress-card">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-muted">Open Rate</span>
                        <span className="text-muted fw-bold"> 60%</span>
                      </div>
                      <div className="progress mb-2" style={{ height: "7px" }}>
                        <div
                          className="progress-bar bg-warning"
                          role="progressbar"
                          style={{ width: "60%" }}
                          aria-valuenow="60"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          data-toggle="tooltip"
                          data-placement="top"
                          title="60%"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              {/* <div className="col-md-3"> */}
                {/* <div className="card card-stats">
                  <div className="card-body">
                    <p className="fw-bold mt-1">Statistic</p>
                    <div className="row">
                      <div className="col-5">
                        <div className="icon-big text-center icon-warning">
                          <i className="la la-pie-chart text-warning"></i>
                        </div>
                      </div>
                      <div className="col-7 d-flex align-items-center">
                        <div className="numbers">
                          <p className="card-category">Number</p>
                          <h4 className="card-title">150GB</h4>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-5">
                        <div className="icon-big text-center">
                          <i className="la la-heart-o text-primary"></i>
                        </div>
                      </div>
                      <div className="col-7 d-flex align-items-center">
                        <div className="numbers">
                          <p className="card-category">Followers</p>
                          <h4 className="card-title">+45K</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
              {/* </div> */}
            {/* </div> */} 
          </div>
        </div>

        <AdminFooter />
      </div>
    </>
  );
}