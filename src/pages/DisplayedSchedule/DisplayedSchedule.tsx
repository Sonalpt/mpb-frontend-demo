/* eslint-disable array-callback-return */
import React, { useRef } from "react";
import Navbar from "../../components/Navbar";
import MobileNavbar from "../../components/MobileNavBar";
import useDisplayedSchedule from "./Hooks/useDisplayedSchedule";
import axios from "axios";
import moment from "moment";
import InfoBubble from "../../components/InfoBubble";
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { AuthContext } from "../../helpers/AuthContext";



const DisplayedSchedule = () => {

      const { authState, setAuthState } = useContext(AuthContext);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const params = useParams();
      var id = params ? parseInt(params.id) : 0;
      
      let navigate = useNavigate();

      const [listOfEmployees, setListOfEmployees] = useState([]);
      const [listOfPlannings, setListOfPlannings] = useState([]);
      const [isLoaded, setIsLoaded] = useState(false);
      const [listOfPlanningsSorted, setListOfPlanningsSorted] = useState([]);
      
      var isPeriodeFound = false;
      var isPlanningFound = false;
      var planningsToFetch: any = [];

      const [tdModificationState, setTdModificationState] = useState(1);

      const componentRef = useRef();

      const { fetchSchedule, sortSchedulesFunction, displayHoraires, planningModificationStart, modifyPlanningObject, onSubmit } = useDisplayedSchedule();


useEffect(() => {
      
    fetchSchedule(setAuthState, setListOfEmployees, setListOfPlannings, setIsLoaded);

}, [!listOfPlannings]);
      
      useEffect(() => {

            sortSchedulesFunction(setListOfPlanningsSorted, listOfPlannings);
           
      }, [listOfPlannings.length < 1]);
      
      
      if (!isLoaded) {
            return  <div>Chargement en cours !</div>
      } else if (listOfPlannings.length < 1) {
            return (
                  <>
                        <MobileNavbar />
                        <Navbar />
                        <div className="mobile__global__container">Pas d'emploi du temps pour le moment</div>
                        <div className="newSchedule_container">Pas d'emploi du temps pour le moment</div>
                  </>
            )
      } else {
            
            return (
                  <>
                        <MobileNavbar />
                        <Navbar />
                        {tdModificationState === 2 ? (<InfoBubble />) : null}
                  <div className="newSchedule_container">
                              <table ref={componentRef}>
                                    <>
                                          {authState.isDirection && listOfPlanningsSorted.some((planning: { planning_id: number; }) => planning.planning_id === id) ? listOfPlanningsSorted.map((value: { planning_id: number; periode: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal; }, key: any) => {
                                                if (value.planning_id === id) { 
                                                      if (isPeriodeFound) {
                                                            return
                                                      } else {
                                                            isPeriodeFound = true
                                                            return (
                                                      <>
                                                            <caption>Période du {value.periode}</caption>
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

                                                      </>
                                                )    
                                                      }
                                                
                                          }
                                          
                                    }) : listOfPlanningsSorted.some((planning: { planning_id: number; }) => planning.planning_id === id) ? listOfPlanningsSorted.map((value: { nom_employe: string; planning_id: number; periode: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal; }, key: any) => {
                                          if (value.nom_employe === authState.nom_complet && value.planning_id === id) {
                                                if (isPeriodeFound) {
                                                            return
                                                } else {
                                                      
                                                      return (
                                                      <>
                                                            <caption>Période du {value.periode}</caption>
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
                                                      </>
                                                )
                                                      }
                                               
                                          }
                                    }) : <div>Pas d'emploi du temps à afficher !</div>}
                                          
                                          
                              
                              
                              <tbody>
                                         
                                          {authState.isDirection && listOfPlanningsSorted.some((planning: { planning_id: number; }) => planning.planning_id === id) ? listOfPlanningsSorted.map((value: { planning_id: number; nom_employe: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal; fonction: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal; lundi: (string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal)[]; mardi: (string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal)[]; mercredi: (string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal)[]; jeudi: (string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal)[]; vendredi: (string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal)[]; samedi: (string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal)[]; dimanche: (string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal)[]; total_horaires: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal; }, key: number) => {
                                                if (value.planning_id === id) {

                                                      let keyString = "employee_row_" + key.toString();
                                                      return (
                                                            
                                                            <tr className="employee_row" id={keyString} key={key}>
                                                                  <td>{value.nom_employe}</td>
                                                                  <td>{value.fonction}</td>
                                                                  <td>
                                                                        <span className="spanInput">{value.lundi[0]} - {value.lundi[1]}</span>
                                                                        {/* <br /> */}
                                                                        <br />
                                                                        <span className="repas">
                                                                              Break
                                                                        </span>{" "}
                                                                        <br />
                                                                        <span className="spanInput">{value.lundi[2]} - {value.lundi[3]}</span>
                                                                  </td>
                                                                  <td>
                                                                        <span className="spanInput">{value.mardi[0]} - {value.mardi[1]}</span>
                                                                        {/* <br /> */}
                                                                        <br />
                                                                        <span className="repas">
                                                                        Break
                                                                        </span>{" "}
                                                                        <br />
                                                                        <span className="spanInput">{value.mardi[2]} - {value.mardi[3]}</span>
                                                                  </td>
                                                                  <td>
                                                                        <span className="spanInput">{value.mercredi[0]} - {value.mercredi[1]}</span>
                                                                        {/* <br /> */}
                                                                        <br />
                                                                        <span className="repas">
                                                                        Break
                                                                        </span>{" "}
                                                                        <br />
                                                                        <span className="spanInput">{value.mercredi[2]} - {value.mercredi[3]}</span>
                                                                  </td>
                                                                  <td>
                                                                        <span className="spanInput">{value.jeudi[0]} - {value.jeudi[1]}</span>
                                                                        {/* <br /> */}
                                                                        <br />
                                                                        <span className="repas">
                                                                        Break
                                                                        </span>{" "}
                                                                        <br />
                                                                        <span className="spanInput">{value.jeudi[2]} - {value.jeudi[3]}</span>
                                                                  </td>
                                                                  <td>
                                                                        <span className="spanInput">{value.vendredi[0]} - {value.vendredi[1]}</span>
                                                                        {/* <br /> */}
                                                                        <br />
                                                                        <span className="repas">
                                                                        Break
                                                                        </span>{" "}
                                                                        <br />
                                                                        <span className="spanInput">{value.vendredi[2]} - {value.vendredi[3]}</span>
                                                                  </td>
                                                                  <td>
                                                                        <span className="spanInput">{value.samedi[0]} - {value.samedi[1]}</span>
                                                                        {/* <br /> */}
                                                                        <br />
                                                                        <span className="repas">
                                                                        Break
                                                                        </span>{" "}
                                                                        <br />
                                                                        <span className="spanInput">{value.samedi[2]} - {value.samedi[3]}</span>
                                                                  </td>
                                                                  <td>
                                                                        <span className="spanInput">{value.dimanche[0]} - {value.dimanche[1]}</span>
                                                                        {/* <br /> */}
                                                                        <br />
                                                                        <span className="repas">
                                                                        Break
                                                                        </span>{" "}
                                                                        <br />
                                                                        <span className="spanInput">{value.dimanche[2]} - {value.dimanche[3]}</span>
                                                                  </td>
                                                                  <td>{value.total_horaires}</td>
                                                                  {tdModificationState === 2 ? null : <td onClick={() => { planningModificationStart(key, setTdModificationState) }}>Edit</td>}
                                                                  {tdModificationState === 2 ? (
                                                                        <td onClick={() => {modifyPlanningObject(key, listOfPlanningsSorted, setTdModificationState); onSubmit() }}>Send</td>
                                                                  ) : null}
                                                            </tr>
                                                      )
                                                     
                                                };
                                    // eslint-disable-next-line array-callback-return
                                    }) : authState.nom_complet && listOfPlanningsSorted.some((employee: { nom_employe: string; }) => employee.nom_employe === authState.nom_complet) ? listOfPlanningsSorted.map((value: { nom_employe: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment; planning_id: number; fonction: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal; lundi: (string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal)[]; mardi: (string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal)[]; mercredi: (string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal)[]; jeudi: (string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal)[]; vendredi: (string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal)[]; samedi: (string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal)[]; dimanche: (string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal)[]; total_horaires: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal; }, key: React.Key) => {
                                          if (value.nom_employe === authState.nom_complet && value.planning_id === id) {
                                                if (isPlanningFound) {
                                                            return
                                                } else {
                                                      isPlanningFound = true
                                                      return (
                                          /* Code pour rendre la table de l'employé */
                                          (<tr className="employee_row" key={key}>
                                                      <td>{value.nom_employe}</td>
                                                <td>{value.fonction}</td>
                                                      <td>
                                                            <span>{value.lundi[0]} - {value.lundi[1]}</span>
                                                            {/* <br /> */}
                                                            <br />
                                                            <span className="repas">
                                                            Break
                                                            </span>{" "}
                                                            <br />
                                                            <span>{value.lundi[2]} - {value.lundi[3]}</span>
                                                      </td>
                                                      <td>
                                                            <span>{value.mardi[0]} - {value.mardi[1]}</span>
                                                            {/* <br /> */}
                                                            <br />
                                                            <span className="repas">
                                                            Break
                                                            </span>{" "}
                                                            <br />
                                                            <span>{value.mardi[2]} - {value.mardi[3]}</span>
                                                      </td>
                                                      <td>
                                                            <span>{value.mercredi[0]} - {value.mercredi[1]}</span>
                                                            {/* <br /> */}
                                                            <br />
                                                            <span className="repas">
                                                            Break
                                                            </span>{" "}
                                                            <br />
                                                            <span>{value.mercredi[2]} - {value.mercredi[3]}</span>
                                                      </td>
                                                      <td>
                                                            <span>{value.jeudi[0]} - {value.jeudi[1]}</span>
                                                            {/* <br /> */}
                                                            <br />
                                                            <span className="repas">
                                                            Break
                                                            </span>{" "}
                                                            <br />
                                                            <span>{value.jeudi[2]} - {value.jeudi[3]}</span>
                                                      </td>
                                                      <td>
                                                            <span>{value.vendredi[0]} - {value.vendredi[1]}</span>
                                                            {/* <br /> */}
                                                            <br />
                                                            <span className="repas">
                                                            Break
                                                            </span>{" "}
                                                            <br />
                                                            <span>{value.vendredi[2]} - {value.vendredi[3]}</span>
                                                      </td>
                                                      <td>
                                                            <span>{value.samedi[0]} - {value.samedi[1]}</span>
                                                            {/* <br /> */}
                                                            <br />
                                                            <span className="repas">
                                                            Break
                                                            </span>{" "}
                                                            <br />
                                                            <span>{value.samedi[2]} - {value.samedi[3]}</span>
                                                      </td>
                                                      <td>
                                                            <span>{value.dimanche[0]} - {value.dimanche[1]}</span>
                                                            {/* <br /> */}
                                                            <br />
                                                            <span className="repas">
                                                            Break
                                                            </span>{" "}
                                                            <br />
                                                            <span>{value.dimanche[2]} - {value.dimanche[3]}</span>
                                                      </td>
                                                      <td>{value.total_horaires}</td>
                                                </tr>)
                                                );
                                                }
                                          }
                                          }) : <div>Pas d'emploi du temps pour le moment !</div>}
                              </tbody>
                              
                              </>
                              </table>
                              
                              
                        </div>
                        <div className="mobile__global__container">
                              {authState.nom_complet && !authState.isDirection && listOfPlanningsSorted.some((employee: { nom_employe: string; }) => employee.nom_employe === authState.nom_complet) ? listOfPlanningsSorted.map((value: { nom_employe: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment; planning_id: number; periode: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal; lundi: (string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal)[]; mardi: (string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal)[]; mercredi: (string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal)[]; jeudi: (string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal)[]; vendredi: (string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal)[]; samedi: (string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal)[]; dimanche: (string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal)[]; total_horaires: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal; }, key: any) => {
                                    if (value.nom_employe === authState.nom_complet && value.planning_id === id) {
                                          return (
                                                /* Code pour rendre la table de l'employé */
                                                <>
                                                      <div className="mobile__global__container__welcome">
                                                            <p>Hello {value.nom_employe} !</p>
                                                            <p>Here is your schedule for the week of {value.periode} :</p>
                                                      </div>
                                                      <div className="mobile__global__container__schedule">
                                                            <div className="mobile__global__container__schedule__day">
                                                            <p>Monday:</p>
                                                            {displayHoraires(value.lundi as string[])}
                                                            </div>
                                                            <div className="mobile__global__container__schedule__day">
                                                            <p>Tuesday:</p>
                                                            {displayHoraires(value.mardi as string[])}
                                                            </div>
                                                            <div className="mobile__global__container__schedule__day">
                                                            <p>Wednesday:</p>
                                                            {displayHoraires(value.mercredi as string[])}
                                                            </div>
                                                            <div className="mobile__global__container__schedule__day">
                                                            <p>Thursday:</p>
                                                            {displayHoraires(value.jeudi as string[])}
                                                            </div>
                                                            <div className="mobile__global__container__schedule__day">
                                                            <p>Friday:</p>
                                                            {displayHoraires(value.vendredi as string[])}
                                                            </div>
                                                            <div className="mobile__global__container__schedule__day">
                                                            <p>Saturday:</p>
                                                            {displayHoraires(value.samedi as string[])}
                                                            </div>
                                                            <div className="mobile__global__container__schedule__day">
                                                            <p>Sunday:</p>
                                                            {displayHoraires(value.dimanche as string[])}
                                                            </div>
                                                            <div className="mobile__global__container__schedule__day">
                                                            <p>Total hours:</p>
                                                            <div className="horaire">{value.total_horaires}</div>
                                                            </div>
                                                      </div>
                                                </>)
                                    } else { return null }
                              }) : authState.isDirection ? (<div className="mobile__global__container__unavailable">On mobile, team schedule management is unavailable.</div>)
                                                      
                                          
                                : <div>No schedule for the moment!</div>}
                              
                        </div>
                        <button className="button buttonPDF" onClick={() => {window.print()}}>Export to PDF</button>
            </>
            
      );
      }
};

export default DisplayedSchedule;