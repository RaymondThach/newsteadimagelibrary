import React, { useState, useEffect } from "react";
import "./AddUser.css";
import "../pages/UserManagement.css";
import { Auth, API } from "aws-amplify";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function AddUser({ showAddUser, setShowAddUser }) {
  // User Creation object to be passed to cognito
  const [newUser, setNewUser] = useState(null);

  // Handles user input for user accounts
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [email, setEmail] = useState("");

  // Default group, use to store permission for created user acount
  const group = ['everyone']


  async function addAccess(groupName) {
    let apiName = 'AdminQueries';
    let path = '/addUserToGroup';
    let myInit = {
      body: {
        "username": username,
        "groupname": groupName,

      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      }
    }
    return await API.post(apiName, path, myInit);
  }

  // Handle submission to coginito for user account creation
  async function handleSubmit(event) {
    event.preventDefault();
    console.log(group.toString())
    console.log(group)

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
        })
        setNewUser(newUser);
        // eslint-disable-next-line array-callback-return
        group.map((name) => {
          addAccess((name))
        })
        alert("Account has been created for " + firstname + " " + lastname);
        setShowAddUser(false);
      }
    } catch (e) {
      alert(e.message)
    }
  }

  // Handler for firtname userinput
  async function handleFirstname(e) {
    try {
      setFirstname(e);
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

  //Handler for checkbox value
  async function handleCheckbox(checked, value) {
    try {
      if (checked) {
        group.push(value)
        console.log(group)
      } else {
        group.splice(group.indexOf(value), 1);
        console.log(group)
      }

    } catch (e) {
      console.log(e)
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

          <div class="form-group col-2">
            <label class="">Add Item</label><br />
            <input type="checkbox" value="addItem" onChange={((e) => { handleCheckbox(e.target.checked, e.target.value) })} />
          </div>
          <div class="form-group col-2">
            <label>Remove Item</label><br />
            <input type="checkbox" value="removeItem" onChange={((e) => { handleCheckbox(e.target.checked, e.target.value) })} />
          </div>
          <div class="form-group col-2">
            <label>Add Category</label><br />
            <input type="checkbox" value="addCat" onChange={((e) => { handleCheckbox(e.target.checked, e.target.value) })} />
          </div>
          <div class="form-group col-2">
            <label>Remove Category</label><br />
            <input type="checkbox" value="removeCat" onChange={((e) => { handleCheckbox(e.target.checked, e.target.value) })} />
          </div>
          <div class="form-group col-2">
            <label>Add Collection</label><br />
            <input type="checkbox" value="addCollection" onChange={((e) => { handleCheckbox(e.target.checked, e.target.value) })} />
          </div>
          <div class="form-group col-2">
            <label>Remove Collection</label><br />
            <input type="checkbox" value="removeCollection" onChange={((e) => { handleCheckbox(e.target.checked, e.target.value) })} />
          </div>
          <div class="form-group col-2">
            <label>Admin</label><br />
            <input type="checkbox" value="Admin" onChange={((e) => { handleCheckbox(e.target.checked, e.target.value) })} />
          </div>

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
          onClick={() => { setShowAddUser(false); }}
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


  return (
    <>
    { showAddUser?
        <div class= "background" >
          <div id="add-user">
            <h1> Create a New User </h1>{" "}
            <p>
              Please enter credentials for new user and set their permissions below.{" "}
            </p>{" "}
            <p> These will be able to be edited later. </p> {renderForm()}{" "}
          </div>{ " " }
    </div >
    : null
    
}
</>
  );
    
    
}
