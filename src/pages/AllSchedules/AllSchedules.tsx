import React from "react";
import Navbar from "../../components/Navbar";
import MobileNavbar from "../../components/MobileNavBar";
import useGetAllSchedules from "./Hooks/useGetAllSchedules";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../helpers/AuthContext";

const AllSchedules = () => {

      const { authState, setAuthState } = useContext(AuthContext);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const params = useParams();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const id = params ? parseInt(params.id) : 0

      let navigate = useNavigate();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [listOfEmployees, setListOfEmployees] = useState([]);
      const [listOfPlannings, setListOfPlannings] = useState([]);
      const [isLoaded, setIsLoaded] = useState(false);

      const { getSchedules } = useGetAllSchedules();

      useEffect(() => {
            getSchedules(setAuthState, setListOfEmployees, setListOfPlannings, setIsLoaded);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [!listOfPlannings]);

      const filteredListDirection = listOfPlannings.filter((planning, index, self) => 
  index === self.findIndex(t => (
    t.planning_id === planning.planning_id
  ))
);

      if (!isLoaded) {
            return <div>chargement en cours</div>
      } else {
            return (
                  <>
                        <MobileNavbar />
                        <Navbar />
                        <div className="oldSchedule_container">
                              <h1 className="oldSchedule_container__title">LIST OF SCHEDULES</h1>
                              <div className="oldSchedule_container__list">
                                    {authState.isDirection ? filteredListDirection.map((value, key) => {
                                          return (
                                                <div key={key} className="planningContainer"
                                                      onClick={() => { navigate(`/planning/${value.planning_id}`); }}
                                                >Période du {value.periode}</div>
                                          )
                                    // eslint-disable-next-line array-callback-return
                                    }) : listOfPlannings.map((value, key) => {
                                          // eslint-disable-next-line no-cond-assign
                                          if (value.nom_employe === authState.nom_complet) {
                                                return (
                                                      <div key={key} className="planningContainer"
                                                            onClick={() => { navigate(`/planning/${value.planning_id}`); }}
                                                      >Période du {value.periode}</div>
                                                )
                                          } else {
                                                (

                                                      <>
                                                      <div className="mobile__global__container">Pas d'emploi du temps pour le moment</div>
                                                      <div className="newSchedule_container">Pas d'emploi du temps pour le moment</div>
                                                      </>
                                                                              
                                                )
                                                }
                                    })}
                                    </div>
                              
                        </div>
                        
                  
                  </>
            )
      }

}

export default AllSchedules;
