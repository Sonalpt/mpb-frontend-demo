import axios from "axios";
import { Dispatch, SetStateAction } from 'react';
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../helpers/AuthContext";

const useGetAllSchedules = () => {

// const { authState, setAuthState } = useContext(AuthContext);
// eslint-disable-next-line react-hooks/rules-of-hooks
const params = useParams();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const id = params ? parseInt(params.id) : 0

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const [listOfEmployees, setListOfEmployees] = useState([]);
// const [listOfPlannings, setListOfPlannings] = useState([]);
// const [isLoaded, setIsLoaded] = useState(false);

let navigate = useNavigate();

const getSchedules = (
    setAuthState: Dispatch<SetStateAction<{ username: string; nom_complet: string; fonction: string; id: number; isDirection: boolean; status: boolean }>>,
    setListOfEmployees: Dispatch<SetStateAction<Array<{}>>>,
    setListOfPlannings: Dispatch<SetStateAction<Array<{}>>>,
    setIsLoaded: Dispatch<SetStateAction<boolean>>
  ) => {
    if (!localStorage.getItem("accessToken")) {
        navigate("/login");
  } else {
        axios
              .get(
                    "https://mpb-backend-demo-production.up.railway.app/auth/verifyToken",
                    {
                          headers: { accessToken: localStorage.getItem("accessToken") },
                    }
              )
              .then((response) => {
                    if (response.data.error) {
                          alert("Session expirée, veuillez vous reconnecter !");
                          localStorage.removeItem("accessToken");
                          navigate("/login");
                    } else {
                        setAuthState({
                                username: response.data.username,
                                nom_complet: response.data.complete_name,
                                fonction: response.data.function,
                                id: response.data.id,
                                isDirection: response.data.isDirection,
                                status: true,
                          });
                          axios
                                .get("https://mpb-backend-demo-production.up.railway.app/employee", {
                                      headers: { accessToken: localStorage.getItem("accessToken") },
                                })
                                .then((response) => {
                                      setListOfEmployees(response.data.listOfEmployees);
                                })
                          axios
                                .get("https://mpb-backend-demo-production.up.railway.app/planning", {
                                      headers: { accessToken: localStorage.getItem("accessToken") },
                                })
                                .then((response) => {
                                      setListOfPlannings(response.data.listOfPlannings);
                                      setIsLoaded(true);
                                });
                    }
              })
  }
}

return { getSchedules } ;
}


export default useGetAllSchedules;