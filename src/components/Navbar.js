import React from "react";
const Navbar = props => {
  return (
    <nav id="navbar">
      <h2 id="header">Neighborhood Maps</h2>
      <h2
        className="transition menu-text"
        title={props.menuText + "Sidebar"}
        onClick={() => {
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
