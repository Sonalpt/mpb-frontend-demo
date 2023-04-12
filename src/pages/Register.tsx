import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
      BrowserRouter as Router,
      Route,
      Routes,
      Link,
      useNavigate,
      Navigate,
} from "react-router-dom";

function Register() {
        const navigate = useNavigate();
      const initialValues = {
            username: "",
            email: "",
            password: "",
            passwordConfirm: ""
      };

      const validationSchema = Yup.object().shape({
            username: Yup.string()
                  .min(5, "The username must be at least 5 characters.")
                  .max(15, "The username must be a maximum of 15 characters.")
                  .required("This field is required!"
                  )
                  .matches(
                        /^(?=[a-zA-Z0-9._]{5,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
                        "The username must not contain any special characters."

            ),
            email: Yup.string()
                  .required("This field is required!"
                  )
                  .matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  "Your email is not in the correct format, or contains prohibited characters!"),

            password: Yup.string()
                  .min(8, "The password must be at least 8 characters.")
                  .max(20, "The password must be a maximum of 20 characters.")
                  .required("This field is required!"
                  )
                  .matches(
                        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
                        "The password must contain at least 8 characters, one uppercase letter, one digit, and one special character."
            ),
            passwordConfirm: Yup.string()
     .oneOf([Yup.ref('password'), null], "The passwords must match.")
      });

        const onSubmit = (data: any) => {
              axios.post(
                    "https://mpb-backend-demo-production.up.railway.app/auth/register",
                    data
              ).then((response) => {
                    if (response.data === "The user already exists.") {
                          alert(`The user ${data.username} already exists !`);
                    } else if (response.data === "SUCCESS") {
                          alert("You have successfully created a new account.");
                          navigate("/");
                    }
              });
        };

      

      return (
            <>
                  
                  <h1>MAISON PLISSON</h1>
                  <h2>STAFF</h2>
                  <div className="login_links">
                        <Link to={"/"}>Login</Link>
                        <Link to={"/inscription"}>Sign Up</Link>
                  </div>
                  <div className="login_container">
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
                                          id="inputCreatePost"
                                          name="username"
                                          placeholder="(Ex. John123...)"
                                    />
                                    <label>Email: </label>
                                    <ErrorMessage
                                          name="email"
                                          component="span"
                                    />
                                    <Field
                                          autoComplete="off"
                                          id="inputCreatePost"
                                          name="email"
                                          placeholder="(Ex. hello@gmail.com)"
                                    />

                                    <label>Password: </label>
                                    <ErrorMessage
                                          name="password"
                                          component="span"
                                    />
                                    <Field
                                          autoComplete="off"
                                          type="password"
                                          id="inputCreatePost"
                                          name="password"
                                          placeholder="Your password..."
                                    />
                                    <label>Confirm password: </label>
                                    <ErrorMessage
                                          name="passwordConfirm"
                                          component="span"
                                    />
                                    <Field
                                          autoComplete="off"
                                          type="password"
                                          id="inputCreatePost"
                                          name="passwordConfirm"
                                          placeholder="Your password..."
                                    />

                                    <button type="submit" className="button">
                                          {" "}
                                          Sign Up
                                    </button>
                              </Form>
                        </Formik>
                  </div>
            </>
      );
}

export default Register;
