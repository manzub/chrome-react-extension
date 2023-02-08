import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as ROUTES from '../constants/routes';

export default function Login() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if(user.isAuthenticated) {
      navigate(ROUTES.HOME);
    }
  }, [user, navigate]);

  return(<div>login</div>)
}