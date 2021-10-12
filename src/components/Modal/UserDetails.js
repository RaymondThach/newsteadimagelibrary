import React, { useState, useEffect } from "react";
import "./AddUser.css";
import "../pages/UserManagement.css";
import { Auth, API } from "aws-amplify";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function AddUser({ user, showUser, setShowUser }) {
 

  const { CognitoIdentityServiceProvider } = require('aws-sdk');
    
    const userPoolId = process.env.REACT_APP_USERPOOL_ID;
    const region = process.env.REACT_APP_REGION;
    const accessKey = process.env.REACT_APP_ACCESS_KEY;
    const secret = process.env.REACT_APP_SECRET;
    const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider

  // Handles user input for user accounts
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [email, setEmail] = useState("");




  /**
  *
  * Grab all user accounts in current user pool and store in array for dropdown options
  *
  * */
 async function getUser() {
   let apiName = "AdminQueries";
   let path = "/getUser";
   let myInit = {
    queryStringParameters: {
        username: user,
      },
     headers: {
       "Content-Type": "application/json",
       Authorization: `${(await Auth.currentSession())
         .getAccessToken()
         .getJwtToken()}`,
     },
   };
   const userList = await API.get(apiName, path, myInit);

   await userList.map((user) => {
     console.log(user)
   });

 }


  // Handle submission to coginito for user account creation
  async function handleSubmit(event) {
    event.preventDefault();
   

    try {
      //Check if confirmation password matches
      if (confirmPassword !== password) {
        alert("Password does not match");
      } else {
    
      }
    } catch (e) {
      alert(e.message)
    }
  }

  // Handler for firtname userinput
  async function handleFirstname(e) {
    try {
      setFirstname(e);

    } catch (e) {
      console.log(e);
    }
  }

  //Handler for lastname userinput
  async function handleLastname(e) {
    try {
      setLastname(e);
      
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

        <Button
          block
          size="lg"
          type="reset"
          onClick={() => { setShowUser(false); }}
          style={{
            fontSize: 20,
          }
          }

        >
          Cancel{" "}
        </Button>{" "}
      </Form>
    );
  }

  useEffect(() => {
    getUser(user);
  }, []);


  return (
    <>
    { showUser?
        <div class= "background" >
          <div id="add-user">
            <h1> Create a New User </h1>{" "}
            <p>
              User details for.{" "}
            </p>{" "}
          </div>{ " " }
    </div >
    : null
    
}
</>
  );
    
    
}
