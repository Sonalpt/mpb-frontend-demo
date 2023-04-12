import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

const Navbar = () => {

      let navigate = useNavigate();
      const { authState, setAuthState } = useContext(AuthContext);

      const onDisconnect = () => {
            localStorage.removeItem("accessToken");
            navigate("/login")
      }
      return (
            <nav className="desktop__navbar">
                  <div className="lmp_logo">
                        <p>MAISON PLISSON</p>{" "}
                  </div>
                  {authState.isDirection ? (<p onClick={() => {navigate("/nouveauplanning")}}>Create a schedule</p>) : null}
                  
                  {/* <p onClick={() => {navigate("/planning/0")}}>Planning actuel</p> */}
                  <p onClick={() => {navigate("/")}}>List of schedules</p>
                  <p onClick={onDisconnect}>Sign out</p>
            </nav>
      );
};

export default Navbar;
