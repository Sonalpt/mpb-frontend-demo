import React from 'react'
import "./styles/global.css";
import {
      BrowserRouter as Router,
      Route,
      Routes,
      Link,
      useNavigate,
} from "react-router-dom";
import { AuthContext } from "./helpers/AuthContext";
import { PlanningContext} from './helpers/PlanningContext';
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import NewSchedule from "./pages/NewSchedule/NewSchedule";
import DisplayedSchedule from "./pages/DisplayedSchedule/DisplayedSchedule";
import AllSchedules from "./pages/AllSchedules/AllSchedules";

function App() {
      const [authState, setAuthState] = useState({
            username: "",
            nom_complet: "",
            fonction:"",
            id: 0,
            isDirection: false,
            status: false,
      });

      const [planningState, setPlanningState] = useState({
            id: 0,
      });
      // const baseURL= "https://mlp-planning-backend.herokuapp.com/";

      return (
            <>
                  <link rel="stylesheet" media='all' href="./styles/global.css" />
                  <AuthContext.Provider
                              value={{ authState, setAuthState }}
                  >
                        <PlanningContext.Provider value={{ planningState, setPlanningState }}>
                  <div className="app_container">
                        
                              <Router>
                                    <Routes>
                                          <Route
                                                path="/login"
                                                
                                                      element={<Login />}
                                          />
                                          <Route
                                                path="/inscription"
                                                
                                                element={<Register />}
                                          />
                                          <Route
                                                path="/nouveauplanning"
                                                
                                                element={<NewSchedule />}
                                          />
                                          <Route
                                                path="/planning/:id"
                                                
                                                element={<DisplayedSchedule />}
                                          />
                                          <Route
                                                path="/"
                                                
                                                element={<AllSchedules />}
                                          />
                                    </Routes>
                              </Router>
                        
                              </div>
                              </PlanningContext.Provider>
                        </AuthContext.Provider>
            </>
      );
}

export default App;
