import { NavLink } from "react-router-dom";
import "./index.css";

interface NavbarProps {
  isLoggedIn: boolean;
}

function Navbar({ isLoggedIn }: NavbarProps) {
  return (
    <nav className="main-navbar">
      <NavLink to={isLoggedIn ? "/services" : "/signup"} className="brand">
        <span className="brand-icon">🎉</span>

        <span className="brand-text">
          <strong>Home Events</strong>
          <small>MAKE EVERY MOMENT SPECIAL</small>
        </span>
      </NavLink>

      <div className="nav-links">
        {!isLoggedIn ? (
          <>
            <NavLink to="/signup" className="auth-nav-link">
              Signup
            </NavLink>

            <NavLink to="/login" className="auth-nav-link">
              Login
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/services" className="nav-link">
              Home
            </NavLink>

            <NavLink to="/services" className="nav-link">
              Services
            </NavLink>

            <NavLink to="/citizen" className="nav-link">
              Citizen Form
            </NavLink>

            <NavLink to="/vendor" className="nav-link">
              Register Vendor
            </NavLink>

            <NavLink to="/search-vendors" className="nav-link">
              Search Vendors
            </NavLink>

            <NavLink to="/favs" className="nav-link">
              ♥ My Favs
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
