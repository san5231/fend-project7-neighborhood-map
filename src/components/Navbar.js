import React from "react";
const Navbar = props => {
  return (
    <nav id="navbar">
      <h2 id="header">Bay Area Coffee Maps</h2>
      <h2
        tabIndex="0"
        className="transition menu-text"
        title={props.menuText + " Sidebar"}
        onClick={() => {
          props.toggleSideBar();
        }}
        onKeyPress={() => {
          props.toggleSideBar();
        }}
      >
        {props.sidebarOpen ? (
          <i className="material-icons" style={{ lineHeight: "inherit" }}>
            clear
          </i>
        ) : (
          <i className="material-icons" style={{ lineHeight: "inherit" }}>
            menu
          </i>
        )}
      </h2>
    </nav>
  );
};

export default Navbar;
