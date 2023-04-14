import React, { useRef, Dispatch, SetStateAction } from "react";
import axios from "axios";
import moment from "moment";
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { AuthContext } from "../../../helpers/AuthContext";


const useDisplayedSchedule = () => {

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

    const fetchSchedule = (
        setAuthState: Dispatch<SetStateAction<{ username: string; nom_complet: string; fonction: string; id: number; isDirection: boolean; status: boolean }>>,
        setListOfEmployees: Dispatch<SetStateAction<Array<{}>>>,
        setListOfPlannings: Dispatch<SetStateAction<Array<{}>>>,
        setIsLoaded: Dispatch<SetStateAction<boolean>>
      ) => {
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
    }

    const sortSchedulesFunction = (
        setListOfPlanningsSorted: Dispatch<SetStateAction<Array<{}>>>,
        listOfPlannings: Array<{ fonction: string }>
      ) => {
        const sortByFunction = (a: { fonction: string }, b: { fonction: string }) => {
          const order = [
            "Direction",
            "Boucherie",
            "Responsable Service Clientèle",
            "Caisse",
            "Charcuterie",
            "Epicerie",
            "F & L",
            "Fromagerie",
          ];
          return order.indexOf(a.fonction) - order.indexOf(b.fonction);
        };
      
        setListOfPlanningsSorted([...listOfPlannings].sort(sortByFunction));
    };

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

    const planningModificationStart = (idKey: number, setTdModificationState: Dispatch<SetStateAction<number>>) => {
        const employeeRow = document.querySelector(`#employee_row_${idKey}`)
        const spans = employeeRow.querySelectorAll(`td .spanInput`);
        spans.forEach(span => {
              const input = document.createElement('input');
              input.value = span.textContent;
              span.replaceWith(input);
        });
        setTdModificationState(2)
    };

    type Planning = {
        id: number;
        planning_id: number;
        periode: string;
        nom_employe: string;
        fonction: string;
        lundi: string[];
        mardi: string[];
        mercredi: string[];
        jeudi: string[];
        vendredi: string[];
        samedi: string[];
        dimanche: string[];
        total_horaires: number;
      }

    function modifyPlanningObject(key: number, listOfPlanningsSorted: any[], setTdModificationState: Dispatch<SetStateAction<number>>) {
        
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
              console.log(planningsToFetch);
              setTdModificationState(1);
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

    return { fetchSchedule, sortSchedulesFunction, displayHoraires, planningModificationStart, modifyPlanningObject, onSubmit };


}

export default useDisplayedSchedule;