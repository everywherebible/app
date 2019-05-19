import React from "react";
import {NavLink} from "react-router-dom";

import Book from "../img/book";
import Search from "../img/search";
import Settings from "../img/settings";
import "./nav.css";

export const NAV_HEIGHT_REM = 2.5;

export const READ_PATH_RE = /^\/((?!(lookup.*$)|(settings.*$)|(about.*$)).+$)/;

export default ({style}) => (
  <nav
    style={{
      display: "flex",
      position: "fixed",
      right: 0,
      bottom: 0,
      left: 0,
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: "black",
      height: `${NAV_HEIGHT_REM}rem`,
      padding: "0 2rem",
      ...style,
    }}>
    <NavLink
      to="/"
      isActive={(match, location) => READ_PATH_RE.exec(location.pathname)}>
      <Book />
    </NavLink>
    <NavLink to="/lookup">
      <Search />
    </NavLink>
    <NavLink to="/settings">
      <Settings />
    </NavLink>
  </nav>
);
