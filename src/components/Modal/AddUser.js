import React, { useState, useEffect } from "react";
import "./AddUser.css";
import "../pages/UserManagement.css";
import { useAppContext } from "../services/context.js";
import { Auth } from "aws-amplify";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function AddUser() {
  // User Creation object to be passed to cognito
  const [newUser, setNewUser] = useState(null);

  // Handles user input for user accounts
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);
  const [jobRole, setJobRole] = useState("");
  const [email, setEmail] = useState("");

  // Handle submission to coginito for user account creation
  async function handleSubmit(event) {
    event.preventDefault();

    try {
      //Check if confirmation password matches
      if (confirmPassword !== password) {
        alert("Password does not match");
      } else {
        const newUser = await Auth.signUp({
          username: username,
          password: password,
          attributes: {
            email: email,
            "custom:firstname": firstname,
            "custom:lastname": lastname,
            "custom:jobRole": jobRole,
          },
        }).then((e) => {
          alert("Account has been created for " + firstname + " " + lastname);
        });
        setNewUser(newUser);
      }
    } catch (e) {
      console.log(e);
    }
  }

  // Handler for firtname userinput
  async function handleFirstname(e) {
    try {
      //Auto populates username to firstname.last
      lastname.length !== 0 ? setUsername(e + "." + lastname) : setUsername(e);

      setFirstname(e);
    } catch (e) {
      console.log(e);
    }
  }

  //Handler for lastname userinput
  async function handleLastname(e) {
    try {
      setLastname(e);
      //Auto populates username to firstname.last
      firstname.length !== 0
        ? setUsername(firstname + "." + e)
        : setUsername(e);
    } catch (e) {
      console.log(e);
    }
  }

  //Renders user sign up form 
  function renderForm() {
    return (
      <Form onSubmit={handleSubmit}>
        <div class="form-group row">
          <div class="form-group col-md-4">
            <Form.Group controlId="firstname" size="sm">
              <Form.Label> First Name </Form.Label>{" "}
              <Form.Control
                autoFocus
                type="firstname"
                value={firstname}
                onChange={(e) => handleFirstname(e.target.value)}
              />{" "}
            </Form.Group>{" "}
          </div>{" "}
          <div class="form-group col-md-4">
            <Form.Group controlId="lastname" size="lg">
              <Form.Label> Last Name </Form.Label>{" "}
              <Form.Control
                autoFocus
                type="lastname"
                value={lastname}
                onChange={(e) => handleLastname(e.target.value)}
              />{" "}
            </Form.Group>{" "}
          </div>{" "}
          <div class="form-group col-md-4">
            <Form.Group controlId="jobRole" size="lg">
              <Form.Label> Job Role </Form.Label>{" "}
              <Form.Control
                autoFocus
                type="jobRole"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
              />{" "}
            </Form.Group>{" "}
          </div>{" "}
          <div class="form-group col-md-6">
            <Form.Group controlId="email" size="lg">
              <Form.Label> Email </Form.Label>{" "}
              <Form.Control
                autoFocus
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />{" "}
            </Form.Group>{" "}
          </div>{" "}
          <div class="form-group col-md-6">
            <Form.Group controlId="username" size="lg">
              <Form.Label> Username </Form.Label>{" "}
              <Form.Control
                autoFocus
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />{" "}
            </Form.Group>{" "}
          </div>{" "}
          <div class="form-group col-md-6">
            <Form.Group controlId="password" size="lg">
              <Form.Label> Password </Form.Label>{" "}
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />{" "}
            </Form.Group>{" "}
          </div>{" "}
          <div class="form-group col-md-6">
            <Form.Group controlId="confirmPassword" size="lg">
              <Form.Label> Confirm Password </Form.Label>{" "}
              <Form.Control
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />{" "}
            </Form.Group>{" "}
          </div>{" "}
        </div>
        <Button
          block
          size="lg"
          type="submit"
          style={{
            fontSize: 20,
          }}
        >
          Create Account{" "}
        </Button>{" "}
      </Form>
    );
  }

  return (
    <div class="background">
      <div class="container">
        <h1> Create a New User </h1>{" "}
        <p>
          Please enter credentials for new user and set their permissions below.{" "}
        </p>{" "}
        <p> These will be able to be edited later. </p> {renderForm()}{" "}
      </div>{" "}
    </div>
  );
}
