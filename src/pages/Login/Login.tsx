import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../helpers/AuthContext";
import {
      BrowserRouter as Router,
      Route,
      Routes,
      Link,
      useNavigate,
} from "react-router-dom";
import useLogin from "./Hooks/useLogin";


const Login = () => {
      useEffect(() => {
            if (localStorage.getItem("accessToken")) {
            navigate("/");
    }
      }, [])

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { setAuthState } = useContext(AuthContext);

      const initialValues = {
            username: "",
            password: "",
      };

      let navigate = useNavigate();

      const validationSchema = Yup.object().shape({
            username: Yup.string()
                  .min(5, "The username must be at least 5 characters.")
                  .max(15, "The username must be a maximum of 15 characters.")
                  .required("This field is required!")
                  .matches(
                        /^(?=[a-zA-Z0-9._]{5,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
                        "The username must not contain any special characters."
                  ),
            password: Yup.string()
                  .min(8, "The password must be at least 8 characters.")
                  .max(20, "The password must be a maximum of 20 characters.")
                  .required("This field is required!")
                  .matches(
                        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
                        "The password must contain at least 8 characters, one uppercase letter, one digit, and one special character."
                  ),
      });

      const { onSubmit } = useLogin();

      return (
            <>
                  <h1>MAISON PLISSON</h1>
                  <h2>STAFF</h2>
                  <div className="login_links">
                        <Link to={"/"}>Login</Link>
                        <Link to={"/inscription"}>Sign Up</Link>
                  </div>
                  <section className="login_container">
                        <Formik
                              initialValues={initialValues}
                              onSubmit={onSubmit}
                              validationSchema={validationSchema}
                        >
                              <Form className="login_container__form">
                                    {/* <div className="authComponent">
                                          <Link to="/register">
                                                S'enregistrer
                                          </Link>
                                          <Link to="/login">Se connecter</Link>
                                    </div> */}
                                    <label>Username: </label>
                                    <ErrorMessage
                                          name="username"
                                          component="span"
                                    />
                                    <Field
                                          autoComplete="off"
                                          name="username"
                                          placeholder="(Ex. John123...)"
                                    />

                                    <label>Password: </label>
                                    <ErrorMessage
                                          name="password"
                                          component="span"
                                    />
                                    <Field
                                          autoComplete="off"
                                          type="password"
                                          name="password"
                                          placeholder="Your password..."
                                    />

                                    <button className="button" type="submit">Login</button>
                              </Form>
                        </Formik>
                  </section>
            </>
      );
};

export default Login;
