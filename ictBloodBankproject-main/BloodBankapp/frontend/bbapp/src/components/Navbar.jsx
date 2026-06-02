import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar" data-path={location.pathname}>
      <div className="navbar-brand">
        <div className="navbar-logo-circle">🩸</div>
        <div>
          <h2 className="navbar-title">Blood Bank</h2>
          {isLoggedIn && (
            <div className="nav-user-name">Hello, {currentUser.name || "Member"}</div>
          )}
        </div>
      </div>

      <div className="navbar-links">
        {isLoggedIn ? (
          <button className="nav-button nav-logout-button" type="button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link className="nav-link" to="/login">
              Login
            </Link>
            <Link className="nav-link nav-primary" to="/signup">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
