import { Navigate, useLocation } from "react-router-dom";

export function LoggedInRedirect({ children, redirectPath, user }) {
  let location = useLocation();

  if(user) {
    return <Navigate to={redirectPath} state={{from: location}} replace />
  }

  return children;
}

export function ProtectedRoute({ children, user }) {
  let location = useLocation();

  if(!user) {
    return <Navigate to="/login" state={{from: location}} replace />
  }

  return children;
}