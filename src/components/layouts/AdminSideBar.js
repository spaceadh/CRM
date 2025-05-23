import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

export default function AdminSideBar(props) {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName);
      }
    });
  }, []);
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login", { replace: true });
      })
      .then((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <div className="sidebar">
        <div className="scrollbar-inner sidebar-wrapper">
          <div className="user">
            <div className="photo">
              <img src={`assets/img/profile5.png`} />
            </div>
            <div className="info">
              <a>
                <span>
                  {userName !== "" ? userName : "Username"}
                  <span className="user-level">Administrator</span>
                </span>
              </a>
            </div>
          </div>
          <ul className="nav">
            <li className="nav-item">
              <Link to="/dashboard">
                <i className="la la-dashboard"></i>
                <p>Dashboard</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/clients">
                <i className="la la-ambulance"></i>
                <p>Customer Management</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/upload">
                <i className="la la-align-justify"></i>
                <p>Upload</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/staff">
                <i className="la la-align-justify"></i>
                <p>Staff Members</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/sms">
                <i className="la la-align-justify"></i>
                <p>SMS`s</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/profile">
                <i className="la la-user"></i>
                <p>Profile</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link onClick={handleLogout}>
                <i className="la la-power-off"></i>
                <p>Logout</p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
