import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.user);
  let location = useLocation();

  if(!user.isAuthenticated) {
    return <Navigate to="/login" state={{from: location}} replace />
  }

  return children;
}