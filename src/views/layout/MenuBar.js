import React, { useContext, Fragment, useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { getMenuForRole } from "./Menus";
import { AppContext } from "../../context/AppContext";
import "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "./NavBar.css";
import { useEffect } from "react";

const ACTIVE_CLASS = "active";

const MenuBar = withRouter(({ history, location }) => {
  const { user } = useContext(AppContext);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  let menus = user ? getMenuForRole(user.roles) : ['RESEARCHER']; 

  const handleNavCollapse = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };
  const [show, setShow] = useState(false)
  useEffect(() =>{
    setIsNavCollapsed(true)
  },[show])

  const handleClickShow = () =>{
    let invShow = !show
    setShow(invShow)
  }

  return (
    
    <nav className="navbar navbar-expand-lg navbar-light navbar-primary custom-navbar">
      <button
        className="navbar-toggler bg-info"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded={!isNavCollapsed}
        aria-label="Toggle navigation"
        onClick={handleNavCollapse}
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className={`${isNavCollapsed ? "collapse" : ""} navbar-collapse custom-navbar-collapse`} id="navbarNav">
        <ul className="navbar-nav">
          {user &&
            menus.map((menu, index) => (
              <li className={`nav-item ${location.pathname === menu.path ? ACTIVE_CLASS : ""}`} key={index}>
                {menu.isDropdown ? (
                  <Dropdown menu={menu} location={location} func={handleClickShow}  />
                ) : (
                  menu.subMenus.map((subMenu, subIndex) => (
                    <NotDropdown menu={subMenu} key={subIndex} location={location} func={handleClickShow} />
                  ))
                )}
              </li>
            ))}
        </ul>
      </div>
    </nav>
  );
});

export default MenuBar;

const NotDropdown = ({ menu, location, func }) => (
  <Link to={menu.path} className={`nav-link ${location.pathname === menu.path ? ACTIVE_CLASS : ""}`}>
    <span className="nav-link-icon">
      <menu.icon />
    </span>
    <span className="nav-link-title" onClick={func}>{menu.title}</span>
  </Link>
);

const Dropdown = ({ menu, location, func }) => (
  <Fragment>
    <a
      className={`nav-link dropdown-toggle-bs ${menu.subMenus.some(subMenu => subMenu.path === location.pathname) ? ACTIVE_CLASS : ""}`}
      href="#navbar-extra"
      data-toggle="dropdown"
      roles="button"
      aria-expanded="false"
      
    >
      <span className="nav-link-icon">
        <menu.icon />
      </span>
      <span className="nav-link-title">{menu.title}</span>
    </a>
    <ul className="dropdown-menu dropdown-menu-arrow ">
      {menu.subMenus.map((subMenu, index) => (
        <li key={index}>
          <Link to={subMenu.path} className="dropdown-item" onClick={func}>
            {subMenu.title}
          </Link>
        </li>
      ))}
    </ul>
  </Fragment>
);


