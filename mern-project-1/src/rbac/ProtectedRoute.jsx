import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

//check if the logged user's role is a part of alllowed roles array coming as prop.
//If Yes, render children, otherwise navigate to unauthorized access page
function ProtectedRoute({ roles, children }) {
  const user = useSelector((state) => state.userDetails);

  // Handle case where user is not loaded yet
  if (!user) {
    return <Navigate to="/" />;
  }

  // Check if user has required role
  if (!roles || !Array.isArray(roles) || !roles.includes(user.role)) {
    return <Navigate to="/unauthorized-access" />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
