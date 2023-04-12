/* eslint-disable array-callback-return */
import React, { useRef } from "react";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavBar";
import axios from "axios";
import moment from "moment";
import InfoBubble from "../components/InfoBubble";
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";



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


useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
        navigate("/");
    } else {
        axios
            .get("https://mpb-backend-demo-production.up.railway.app/auth/verifyToken", {
                headers: { accessToken: localStorage.getItem("accessToken") },
            })
            .then((response) => {
                if (response.status === 200 && !response.data.error) {
                    
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
                        });
                    axios
                        .get("https://mpb-backend-demo-production.up.railway.app/planning", {
                            headers: { accessToken: localStorage.getItem("accessToken") },
                        })
                        .then((response) => {
                            setListOfPlannings(response.data.listOfPlannings);
                            if (listOfPlannings) {
                                  setIsLoaded(true);
                            } else {
                                return;
                            } 
                        });

                } else {
                      alert("Session expirée, veuillez vous reconnecter !")
                        localStorage.removeItem("accessToken");
                        navigate("/")
                  }
            })
            }

}, [!listOfPlannings]);
      
      useEffect(() => {
            const sortByFunction = (a: { fonction: string; }, b: { fonction: string; }) => {
                  const order = [
                  "Direction",
                  "Boucherie",
                  "Responsable Service Clientèle",
                  "Caisse",
                  "Charcuterie",
                  "Epicerie",
                  "F & L",
                  "Fromagerie"
                  ];
                  return order.indexOf(a.fonction) - order.indexOf(b.fonction);
                  };

            setListOfPlanningsSorted(listOfPlannings.sort(sortByFunction)) 
           
      }, [listOfPlannings.length < 1]);
      

      function planningModificationStart(idKey: number) {
            const employeeRow = document.querySelector(`#employee_row_${idKey}`)
            const spans = employeeRow.querySelectorAll(`td .spanInput`);
            spans.forEach(span => {
                  const input = document.createElement('input');
                  input.value = span.textContent;
                  span.replaceWith(input);
            });
            setTdModificationState(2)
      }

      const displayHoraires = (horaires: string[]) => {
            const plage1 = horaires[0];
            const plage2 = horaires[1];
            const plage3 = horaires[2];
            const plage4 = horaires[3];
        
            if (plage1.match(/\d+/g) || plage2.match(/\d+/g) || plage3.match(/\d+/g) || plage4.match(/\d+/g)) {
              // au moins une plage horaire contient des chiffres
              return (
                <>
                  <div className="horaire">{plage1} - {plage2}</div>
                  <div className="horaire">{plage3} - {plage4}</div>
                </>
              );
            } else {
              // aucune plage horaire ne contient de chiffres
              return "Day off !";
            }
      };

      function modifyPlanningObject(key: number) {
            let total: number = null;
            let planning: Record<string, any> = {
                  id: listOfPlanningsSorted[key].id,
                  planning_id: listOfPlanningsSorted[key].planning_id,
                  periode: listOfPlanningsSorted[key].periode,
                  nom_employe: listOfPlanningsSorted[key].nom_employe,
                  fonction: listOfPlanningsSorted[key].fonction,
                  lundi: [(document.querySelector(`#employee_row_${key} td:nth-child(3) input:first-child`) as HTMLInputElement).value, (document.querySelector(`#employee_row_${key} td:nth-child(3) input:last-child`) as HTMLInputElement).value],
                  mardi: [(document.querySelector(`#employee_row_${key} td:nth-child(4) input:first-child`)as HTMLInputElement).value, (document.querySelector(`#employee_row_${key} td:nth-child(4) input:last-child`)as HTMLInputElement).value],
                  mercredi: [(document.querySelector(`#employee_row_${key} td:nth-child(5) input:first-child`) as HTMLInputElement).value, (document.querySelector(`#employee_row_${key} td:nth-child(5) input:last-child`) as HTMLInputElement).value],
                  jeudi: [(document.querySelector(`#employee_row_${key} td:nth-child(6) input:first-child`) as HTMLInputElement).value, (document.querySelector(`#employee_row_${key} td:nth-child(6) input:last-child`) as HTMLInputElement).value],
                  vendredi: [(document.querySelector(`#employee_row_${key} td:nth-child(7) input:first-child`) as HTMLInputElement).value, (document.querySelector(`#employee_row_${key} td:nth-child(7) input:last-child`) as HTMLInputElement).value],
                  samedi: [(document.querySelector(`#employee_row_${key} td:nth-child(8) input:first-child`) as HTMLInputElement).value, (document.querySelector(`#employee_row_${key} td:nth-child(8) input:last-child`) as HTMLInputElement).value],
                  dimanche: [(document.querySelector(`#employee_row_${key} td:nth-child(9) input:first-child`) as HTMLInputElement).value, (document.querySelector(`#employee_row_${key} td:nth-child(9) input:last-child`) as HTMLInputElement).value],
                  total_horaires: 0
            };
            if (planning) {
                  const days = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
                  
                  for (let i = 0; i < days.length; i++) {
                        if (planning[days[i]][0] === "" || planning[days[i]][0] === " - " || planning[days[i]][0] === "-" || planning[days[i]][1] === "" || planning[days[i]][1] === " - " || planning[days[i]][1] === "-") {
                              let horaires = planning[days[i]];
                                    for (let j = 0; j < horaires.length; j += 1) {
                                          let timeArray = [];
                                          if (horaires[j] === "" || horaires[j] === " - ") {  
                                                planning[days[i]] = [...planning[days[i]], " - ", " - "]
                                          } else {
                                                let times = horaires[j].split(" - ");
                                                timeArray.push(times[0], times[1]);
                                                planning[days[i]] = [...planning[days[i]], ...timeArray]
                                          }    
                              } 
                        } else {
                                    let horaires = planning[days[i]];
                                    for (let j = 0; j < horaires.length; j += 1) {
                                          let timeArray = [];
                                          let times = horaires[j].split(" - ");
                                          timeArray.push(times[0], times[1]);
                                          planning[days[i]] = [...planning[days[i]], ...timeArray]
                                    }     
                        }
                        if (planning[days[i]].length === 6) {
                              planning[days[i]].splice(0,2)
                              }
                              if (planning[days[i]].length === 0) {
                                    return;
                              }
                        if (planning[days[i]].length === 4) {
                                    const jour = planning[days[i]]; 
                                    for (let k = 0; k < jour.length; k += 2) {
                                          if (jour[k] === "" || jour[k] === " - ") {
                                                let start = moment("00:00", "HH:mm");
                                                let end = moment("00:00", "HH:mm");
                                                let duration = moment.duration(end.diff(start)).asHours();
                                                total += duration;
                                          } else {
                                                let start = moment(jour[k], "HH:mm");
                                                let end = moment(jour[k + 1], "HH:mm");
                                                let duration = moment.duration(end.diff(start)).asHours();
                                                total += duration;
                                          }
                                          
                                    }
                              }
                        
                  }
                  planning.total_horaires = total;
            }
            const employeeRow = document.querySelector(`#employee_row_${key}`)
            const inputs = employeeRow.querySelectorAll(`input`);
            let isInputValidChecker: number = 0;
            inputs.forEach(input => {
                  const horaireValue = input.value;
                  const horaireRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9] - (0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
                  if (horaireValue === "" || horaireValue === "-" || horaireValue === " - " || horaireValue === " -  -  - ") {
                        isInputValidChecker += 0;
                  }
                  else if (!horaireRegex.test(horaireValue)) {
                        isInputValidChecker++;
                        return;
                  }
            })
            if (isInputValidChecker > 0) {
                  alert("Veuillez rentrer vos horaires dans un format valide !");
                  return;
            } else {
                  planning.total_horaires = total;
                  let totalInput = document.querySelector(`#employee_row_${key} td:nth-child(10)`)
                  totalInput.textContent = total.toString();
                  planningsToFetch.push(planning);
                  setTdModificationState(1)
                  onSubmit();
            }     
      }

      const onSubmit = () => {
            axios
                  .put(
                  "https://mpb-backend-demo-production.up.railway.app/planning/editplanning",
                  {
                  planning: planningsToFetch[0]
                  },
                  {
                  headers: {
                        accessToken: localStorage.getItem("accessToken"),
                  },
                  }
                  )
                  .then((response) => {
                  navigate(`/`);
                  });
      };
      
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
                                                                  {tdModificationState === 2 ? null : <td onClick={() => { planningModificationStart(key) }}>Modifier</td>}
                                                                  {tdModificationState === 2 ? (
                                                                        <td onClick={() => {modifyPlanningObject(key)}}>Envoyer</td>
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