import React from "react";
import { Link } from "react-router-dom";

//Creates a Navigation bar for use in header
export default function Nav() {
  return (
    <nav>
      <ul>
        <li><Link to="/" Home> Home </Link> </li>
        <li><Link to="/page1"> Page 1</Link> </li>
        <li><Link to="/page2"> Page 2</Link> </li>
        <li><Link to="/login"> Login</Link> </li>
      </ul>
    </nav>
  );
}