import React, { useState, useEffect } from "react";
import "./AddUser.css";
import "../pages/UserManagement.css";
import { Auth, API } from "aws-amplify";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function AddUser({ user, showUserDetails, setShowUserDetails }) {
 

  const { CognitoIdentityServiceProvider } = require('aws-sdk');
    
    const userPoolId = process.env.REACT_APP_USERPOOL_ID;
    const region = process.env.REACT_APP_REGION;
    const accessKey = process.env.REACT_APP_ACCESS_KEY;
    const secret = process.env.REACT_APP_SECRET;
    const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({ region: region, accessKeyId: accessKey, secretAccessKey: secret });

  // Handles user input for user accounts
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [email, setEmail] = useState("");
  const [userDetails, setUserDetails] = useState([])

  

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

   setUserDetails(userList)

   // filter through details
   await userList.UserAttributes.map((info, i) => {
     if ( info.Name === "custom:jobRole"){
       setJobRole(info.Value)
     }
     if ( info.Name === "custom:firstname"){
      setFirstname(info.Value)
    }
    if ( info.Name === "custom:lastname"){
      setLastname(info.Value)
    }
    if ( info.Name === "email"){
      setEmail(info.Value)
    }
   });

 }


  // Handle submission to coginito for user account creation
  async function handleSubmit(event) {
    event.preventDefault();
   

    try {
      //Check if confirmation password matches
      updateUser()
      alert(user+ ' has been updated')
      setShowUserDetails(false);
    } catch (e) {
      alert(e.message)
    }
  }

  async function updateUser(){

    var params = {
      UserAttributes: [ /* required */
        {
          Name: "custom:jobRole", /* required */
          Value: jobRole
        },
        {
          Name: "custom:firstname", /* required */
          Value: firstname
        },
        {
          Name: "custom:lastname", /* required */
          Value: lastname
        },
        {
          Name: "email", /* required */
          Value: email
        },
        /* more items */
      ],
      UserPoolId: userPoolId, /* required */
      Username: user, /* required */
    };
    try {
      const result = await cognitoIdentityServiceProvider.adminUpdateUserAttributes(params).promise();
      console.log(`Update ${user}`);
      return {
        message: `Updated ${user}`,
      };
    } catch (err) {
      console.log(err);
      throw err;
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
                onChange={(e) => setFirstname(e.target.value)}
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
                onChange={(e) => setLastname(e.target.value)}
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
        </div>
        <Button
          block
          size="lg"
          type="submit"
          style={{
            fontSize: 20,
          }}
        >
          Update Account{" "}
        </Button>{" "}

        <Button
          block
          size="lg"
          type="reset"
          onClick={() => { setShowUserDetails(false); }}
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
    getUser();
    setUsername(user)
  }, []);


  return (
    <>
    { showUserDetails?
        <div class= "background" >
          <div id="add-user">
            <h1> Edit User </h1>{" "}
            <p>
              User details for {user}
            </p>{" "}
            {renderForm()}
          </div>{ " " }
    </div >
    : null
    
}
</>
  );
    
    
}
