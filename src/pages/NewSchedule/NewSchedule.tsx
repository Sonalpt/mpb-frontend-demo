import React, { useRef} from "react";
import Navbar from "../../components/Navbar";
import MobileNavbar from "../../components/MobileNavBar";
import useNewSchedule from "./Hooks/useNewSchedule";
import axios from "axios";
import InfoBubble from "../../components/InfoBubble"
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { AuthContext } from "../../helpers/AuthContext";
import moment from "moment";

const NewSchedule = () => {

      const { authState, setAuthState } = useContext(AuthContext);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const params = useParams();
      const id = params ? parseInt(params.id) : 0;


      let navigate = useNavigate();

      const [listOfEmployees, setListOfEmployees] = useState([]);
      const [listOfEmployeesSorted, setListOfEmployeesSorted] = useState([]);
      const [listOfPlannings, setListOfPlannings] = useState([]);
      const [isLoaded, setIsLoaded] = useState(false);
      const planningsToFetch: any = [];
      
      const periodeInputRef = useRef<HTMLInputElement>(null);

      const { fetchSchedules, sortSchedulesFunction, createPlanningObject, onSubmit } = useNewSchedule();

      useEffect(() => {
            
            fetchSchedules(setAuthState, setListOfEmployees, setListOfPlannings, setIsLoaded);
    
      }, [!listOfEmployees]);

      useEffect(() => {
            
            sortSchedulesFunction(setListOfEmployeesSorted, listOfEmployees)
           
      }, [listOfEmployees.length < 1]);


      // fonction pour créer un objet "planning" (représentant une ligne du tableau)
      
      return (
            <>
                  <MobileNavbar />
                  <Navbar />
                  <InfoBubble />
                  <div className="newSchedule_container">
                        
                        <table>
                              <caption>
                                    Période du : <input ref={periodeInputRef}></input>
                              </caption>
                              <thead>
                                    <tr className="column_name">
                                          <th>Name</th>
                                          <th>Function</th>
                                          <th>Monday</th>
                                          <th>Tuesday</th>
                                          <th>Wednesday</th>
                                          <th>Thursday</th>
                                          <th>Friday</th>
                                          <th>Saturday</th>
                                          <th>Sunday</th>
                                          <th>TOTAL</th>
                                    </tr>
                              </thead>
                              <tbody>

                              
                              
                              {listOfEmployeesSorted.map((employee, key) => {
                                    return (    
                                          <tr className="employee_row" id={`employee_row_${key}`} key={key}>
                                    <td>{employee.nom_employee}</td>
                                          <td>{employee.fonction }</td>
                                    <td>
                                          <input></input>
                                          <br />
                                          <span className="repas">Break</span>{" "}
                                          <br />
                                          <input></input>
                                    </td>
                                    <td>
                                          <input></input>
                                          <br />
                                          <span className="repas">Break</span>{" "}
                                          <br />
                                          <input></input>
                                    </td>
                                    <td>
                                          <input></input>
                                          <br />
                                          <span className="repas">Break</span>{" "}
                                          <br />
                                          <input></input>
                                    </td>
                                    <td>
                                          <input></input>
                                          <br />
                                          <span className="repas">Break</span>{" "}
                                          <br />
                                          <input></input>
                                    </td>
                                    <td>
                                          <input></input>
                                          <br />
                                          <span className="repas">Break</span>{" "}
                                          <br />
                                          <input></input>
                                    </td>
                                    <td>
                                          <input></input>
                                          <br />
                                          <span className="repas">Break</span>{" "}
                                          <br />
                                          <input></input>
                                    </td>
                                    <td>
                                          <input></input>
                                          <br />
                                          <span className="repas">Break</span>{" "}
                                          <br />
                                          <input></input>
                                    </td>
                                                <td>00</td>
                                                <td onClick={(event) => createPlanningObject(employee, key, listOfPlannings)}>Validation</td>

                              </tr>
                                    )
                              })}
                                    </tbody>
                        </table>
                  </div>
                  <div className="mobile__global__container">
                        <div className="mobile__global__container__unavailable">
                        The creation of schedules is only available on a large screen format!
                        </div>
                  </div>
                  <div className="button buttonPDF" onClick={() => onSubmit(listOfPlannings)}>SEND</div>
                  
            </>
      );
};

export default NewSchedule;
