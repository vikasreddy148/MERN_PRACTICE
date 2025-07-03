
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
//check if the logged user's role is a part of alllowed roles array coming as prop.
//If Yes, render childern, other wise navigate to unauthorized access page
function ProtectedRoute({ roles, childern }) {
  const user = useSelector((state) => state.userDetails);
  return roles.includes(user?.role) ? (
    childern
  ) : (
    <Navigate to="/unauthorized-access" />
  );
}

export default ProtectedRoute;
