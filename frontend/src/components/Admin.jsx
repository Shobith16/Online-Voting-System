import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import "../styles/Admin.css";


function Admin({children}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const navigate = useNavigate();
  const overview = () => {
    navigate("/Admin");
  };
  const add = () => {
    navigate("/Addcandidate");
  };
  const result = () => {
    navigate("/result");
  };
  const reelection = () => {
    navigate("/reele");
  };
  const logout = () => {
    navigate("/login");
  };

  return (
    <div className="admincontainer">
      <Header />
      <button className="sidebar__toggle-btn" onClick={toggleSidebar}>
          {isSidebarOpen ? "<<" : ">>"} Sidebar
      </button>
      <div className="main">
        
        <div className={`sidebar ${isSidebarOpen ? "sidebar--open" : ""}`}>
          <ul className="sidebar__menu">
            <li className="sidebar__menu-item" onClick={overview}> Overview</li>
            <li className="sidebar__menu-item" onClick={add}>Add Candidate</li>
            <li className="sidebar__menu-item" onClick={result}>Result</li>
            <li className="sidebar__menu-item" onClick={reelection}>Re-Election</li>
            <li className="sidebar__menu-item" onClick={logout}>Logout</li>
          </ul>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Admin;
