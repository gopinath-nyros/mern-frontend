import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../../shared/context/auth-context";
import "./NavLinks.css";

const NavLinks = (props) => {
  const authCtx = useContext(AuthContext);

  return (
    <ul className='nav-links'>
      <li>
        <NavLink to='/' exact>
          ALL USERS
        </NavLink>
      </li>
      {authCtx.isLoggedIn && (
        <li>
          <NavLink to={`/${authCtx.userId}/places`}>MY PLACES</NavLink>
        </li>
      )}
      {authCtx.isLoggedIn && (
        <li>
          <NavLink to='/places/new'>NEW PLACE</NavLink>
        </li>
      )}
      {!authCtx.isLoggedIn && (
        <li>
          <NavLink to='/auth'>LOGIN</NavLink>
        </li>
      )}
      {authCtx.isLoggedIn && (
        <li>
          <button onClick={authCtx.logout} to='/'>
            LOGOUT
          </button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
