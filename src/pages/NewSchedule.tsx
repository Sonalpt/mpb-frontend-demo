import React, { useRef} from "react";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavBar";
import axios from "axios";
import InfoBubble from "../components/InfoBubble"
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
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

      useEffect(() => {
            if (!localStorage.getItem("accessToken")) {
                  navigate("/");
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
                                          .get("https://mpb-backend-demo-production.up.railway.app/employee",{
                                    headers: { accessToken: localStorage.getItem("accessToken") },
                              })
                                          .then((response) => {
                                                setListOfEmployees(response.data.listOfEmployees);
                                          })
                                    axios
                                          .get("https://mpb-backend-demo-production.up.railway.app/planning",{
                                    headers: { accessToken: localStorage.getItem("accessToken") },
                              })
                                          .then((response) => {
                                                setListOfPlannings(response.data.listOfPlannings);
                                                setIsLoaded(true);
                                                
                                          });
                              }
                        })
            }

    
    
      }, [!listOfEmployees]);

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

            setListOfEmployeesSorted(listOfEmployees.sort(sortByFunction)) 
           
      }, [listOfEmployees.length < 1]);


      // fonction pour créer un objet "planning" (représentant une ligne du tableau)
      function createPlanningObject(employee: any, key: number) {
            let total:number = null;
            
            let planning: Record <string, any>= {
                  planning_id: listOfPlannings.length,
                  periode: (document.querySelector("caption input:first-child") as HTMLInputElement).value,
                  nom_employe: employee.nom_employee,
                  fonction: employee.fonction,
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
                                          if (jour[k] === "" || jour[k] === " - " || jour[k] === "-") {
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
            let isPeriodValidChecker: boolean = true;
            const periodeRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/[0-9]{2} au (0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/[0-9]{2}$/;
            inputs.forEach(input => {
                  const horaireValue = input.value;
                  const horaireRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9] - (0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
                  if (horaireValue === "" || horaireValue === "-" || horaireValue === " - ") {
                        isInputValidChecker += 0;
                  }
                  else if (!horaireRegex.test(horaireValue)) {
                        isInputValidChecker++;
                        return;
                  }
            })
            if (!periodeRegex.test(planning.periode)) {
                  alert("Please enter the period in a valid format!");
                  isPeriodValidChecker = false;
                  return;
            } else if(periodeRegex.test(planning.periode)) {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  isPeriodValidChecker = true;
            }
            if (isInputValidChecker > 0) {
                  alert("Please enter your schedule in a valid format!");
                  return;
            } else {
                  planning.total_horaires = total;
                  let totalInput = (document.querySelector(`#employee_row_${key} td:nth-child(10)`) as HTMLTableCellElement)
                  totalInput.innerText = total.toString();
                  planningsToFetch.push(planning);
                  const tdToDelete = document.querySelector(`#employee_row_${key} td:nth-child(11)`);
                  tdToDelete.remove();
                  inputs.forEach(input => {
                        const span = document.createElement('span');
                        span.textContent = input.value;
                        input.replaceWith(span);
                  }); 
            }
      }

      const onSubmit = () => {
            let currentPeriode = (document.querySelector('caption input') as HTMLInputElement).value
            let isPeriodValidChecker: boolean = true;
            const periodeRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/[0-9]{2} au (0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/[0-9]{2}$/;
            if (!periodeRegex.test(currentPeriode)) {
                  alert("Please enter the period in a valid format!");
                  isPeriodValidChecker = false;
                  return;
            } else if (periodeRegex.test(currentPeriode)) {
                  // eslint-disable-next-line array-callback-return
                  listOfPlannings.map((existingPlanning) => {
                        if (currentPeriode === existingPlanning.periode) {
                              // eslint-disable-next-line array-callback-return
                              planningsToFetch.map((planning: { planning_id: number; }) => {
                                    planning.planning_id = existingPlanning.planning_id
                              })
                        } else {
                              return false
                        }
                  })
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                   axios
                  .post(
                  "https://mpb-backend-demo-production.up.railway.app/planning",
                  {
                  plannings: planningsToFetch
                  },
                  {
                  headers: {
                        accessToken: localStorage.getItem("accessToken"),
                  },
                  }
                  )
                  .then((response) => {
                  navigate("/");
                  });
            }
      };


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
                                                <td onClick={(event) => createPlanningObject(employee, key)}>Validation</td>

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
                  <div className="button buttonPDF" onClick={onSubmit}>SEND</div>
                  
            </>
      );
};

export default NewSchedule;
