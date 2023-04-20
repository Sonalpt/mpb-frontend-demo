import axios from "axios";
import { useNavigate } from "react-router-dom";

const useRegister = () => {
    let navigate = useNavigate();

    const onSubmit = (data: any) => {
        axios.post(
              "https://mpb-backend-demo-production.up.railway.app/auth/register",
              data
        ).then((response) => {
              if (response.data === "L'utilisateur existe déjà") {
                    alert(`The user ${data.username} already exists !`);
              } else if (response.data === "SUCCESS") {
                    alert("You have successfully created a new account.");
                    navigate("/");
              }
        });
  };

  return { onSubmit };
}

export default useRegister;