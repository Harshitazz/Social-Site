import React ,{useContext}from "react";
import { NavLink } from "react-router-dom";
import "./NavLinks.css";
import { AuthContext } from "../hooks/context/auth-context";

const NavLinks =()=>{
const auth= useContext(AuthContext)

    return <ul className="nav-links">
        <li>
            <NavLink  exact to="/"> ALL USERS</NavLink>
        </li>
        {auth.isLoggedIn&& <li>
            <NavLink  exact to={`/${auth.userId}/places`}> MY PLACES</NavLink>
        </li>}
        { auth.isLoggedIn && <li>
            <NavLink  to="/place/new"> ADD PLACE</NavLink>
        </li>}
        {!auth.isLoggedIn &&<li>
            <NavLink  to="/auth"> AUTHENTICATE</NavLink>
        </li>}
        { auth.isLoggedIn && <li>
            <button onClick={auth.logout}> LOGOUT</button>
        </li>}
    </ul>
}
export default NavLinks;
