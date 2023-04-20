import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../helpers/AuthContext";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
    const { setAuthState } = useContext(AuthContext);
    const navigate = useNavigate();
  
    const onSubmit = (data: any) => {
      axios
        .post(
          "https://mpb-backend-demo-production.up.railway.app/auth/login",
          data
        )
        .then((response) => {
          if (response.data.error) {
            alert(response.data.error);
          } else {
            localStorage.setItem("accessToken", response.data.token);
            setAuthState({
              username: response.data.username,
              nom_complet: response.data.complete_name,
              fonction: response.data.function,
              id: response.data.id,
              isDirection: response.data.isDirection,
              status: true,
            });
  
            navigate("/");
          }
        });
    };
  
    return { onSubmit };
  };

  export default useLogin;

