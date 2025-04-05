import React, { useState, useEffect } from "react";
import AdminHeader from "./layouts/AdminHeader";
import AdminSideBar from "./layouts/AdminSideBar";
import AdminFooter from "./layouts/AdminFooter";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

export default function OrdersCategory(props) {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const ordersCollectionReference = collection(db, "bassmart_orders");

  const getOrders = async () => {
    const data = await getDocs(ordersCollectionReference);
    const ordersData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    ordersData.sort((a, b) => b.created - a.created); // Sort by newest
    setOrders(ordersData);
  };

  const handleStatusChange = async (userId,id, orderId, newStatus) => {
    const userOrderDoc = doc(db, "users", userId, "bassmart_orders", orderId);
    const mainOrderDoc = doc(db, "bassmart_orders", orderId);
    
    await Promise.all([
      updateDoc(userOrderDoc, { delivery: newStatus }),
      updateDoc(mainOrderDoc, { delivery: newStatus })
    ]);
    getOrders();
  };

  useEffect(() => {
    getOrders();
  }, []);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <AdminHeader />
      <AdminSideBar />
      <div className="main-panel">
        <div className="content">
          <div className="container-fluid">
            <h4 className="page-title">Bassmart Orders</h4>
            <div className="row">
              <div className="col-md-12">
                <div className="card card-tasks">
                  <div className="card-header">
                    <h4 className="card-title">Orders List</h4>
                  </div>
                  <div className="card-body">
                    <div className="table-full-width px-5 py-4 table-striped">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                            <th>Date</th>
                            <th>Delivery Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentOrders.map((order, index) => {
                            const { id, user, items, amount, created,orderId, delivery } = order;
                            return (
                              <tr key={id}>
                                <td>{indexOfFirstOrder + index + 1}</td>
                                <td>{items.map(item => item.name).join(", ")}</td>
                                <td>{items.map(item => item.category).join(", ")}</td>
                                <td>{items.map(item => item.quantity).join(", ")}</td>
                                <td>{amount}</td>
                                <td>{new Date(created * 1000).toLocaleDateString()}</td>
                                <td>{delivery}</td>
                                <td className="td-actions">
                                  <select
                                    value={delivery}
                                    onChange={(e) =>
                                      handleStatusChange(user, id,orderId, e.target.value)
                                    }
                                    className="form-control"
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Dispatched">Dispatched</option>
                                    <option value="Delivered">Delivered</option>
                                  </select>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <Pagination
                        ordersPerPage={ordersPerPage}
                        totalOrders={orders.length}
                        paginate={paginate}
                        currentPage={currentPage}
                      />
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

const Pagination = ({ ordersPerPage, totalOrders, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalOrders / ordersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
            <a onClick={() => paginate(number)} href="#!" className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};