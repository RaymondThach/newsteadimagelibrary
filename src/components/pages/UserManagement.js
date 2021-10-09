import React, { useState, useEffect } from "react";
import "./UserManagement.css";
import "amazon-cognito-identity-js";
import AddUser from "../Modal/AddUser";
import Amplify, { Auth, API } from "aws-amplify";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import aws from "aws-sdk";
const { CognitoIdentityServiceProvider } = require('aws-sdk');

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({region: 'ap-southeast-2'});
const userPoolId = process.env.USERPOOL;


export default function UserMangement() {
  // Dropdown box value selection
  const [selected, setSelected] = useState("");
  // State handler for user creation form
  const [showing, setShowing] = useState(false);
  //State handler for form rendering
  const [renderForm, setRenderForm] = useState(true);
  // User list array for dropdown
  const [userOptions] = useState([]);
  //Selected user current groups
  const [currentGroups, setCurrentGroups] = useState([]);
  //User group status
  const [accessGroup] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  //User group names
  const [groupNames] = useState([
    "addItem",
    "removeItem",
    "addCat",
    "removeCat",
    "addCollection",
    "removeCollection",
    "Admin",
  ]);

  //Current user selected
  const[user, setUser] =useState("")

  //Store group to add user too
  const [addGroup, setAddGroup] = useState([]);
  //Store group to add user too
  const [removeGroup, setRemoveGroup] = useState([]);

  //Show user creation form
  const openAddUser = () => {
    setShowing(true);
  };

  /**
   *
   * Grab all user accounts in current user pool and store in array for dropdown options
   *
   * */
  async function listUsers() {
    let apiName = "AdminQueries";
    let path = "/listUsers";
    let myInit = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`,
      },
    };
    const userList = await API.get(apiName, path, myInit);

    await userList.Users.map((user) => {
      userOptions.push({ value: user.Username, label: user.Username });
    });

    console.log("listing users " + accessGroup);
  }

  /**
   *
   * Grab the access groups user is in
   *
   **/
  async function listUserGroups(e) {
    const groupArr = [];
    let apiName = "AdminQueries";
    let path = "/listGroupsForUser";
    let myInit = {
      queryStringParameters: {
        username: e,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`,
      },
    };

    //Admin query to grab groups of a user account
    const userGroups = await API.get(apiName, path, myInit);
    userGroups.Groups.map((group) => {
      groupArr.push(group.GroupName);
    });

    // Set current user groups into state array
    setCurrentGroups(groupArr);
    // Pass current user groups for checkbox handling functionality
    currentUserGroups(groupArr);

    //reset form
    setRenderForm(false);
    setRenderForm(true);
  }

  /**
   *
   *  Dropbox handler, set value to state and list user access groups for selected user
   *
   */
  async function dropboxChangerHandler(e) {
    //reinitalize currentGroups
    setCurrentGroups([]);
    //Pass checkbox values to selected state
    setSelected(e);
    //pass values to listUserGroups functionality to grab groups of current user
    listUserGroups(e);

    setUser(e)
  }

  /**
   *
   *Current groups for selected user checkbox handler
   *
   */

  async function currentUserGroups(groups) {
    //Reinitizlies access group status
    accessGroup.map((e, i) => {
      accessGroup[i] = false;
    });
    //Handle checkbox selection for current access groups of user
    groups.map((e) => {
      console.log(e);
      if (groupNames.indexOf(e) !== -1) {
        accessGroup[groupNames.indexOf(e)] = true;
      }
    });
  }

  // Add User to Group
  async function addToGroup(user, group){
    let apiName = 'AdminQueries';
    let path = '/addUserToGroup';
    let myInit = {
      body: {
        "username": user,
        "groupname": group,

      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      }
    }
    return await API.post(apiName, path, myInit);
  
  }

  //Remove user from group
  async function removeFromGroup(user, group){

    let apiName = 'AdminQueries';
    let path = '/removeUserFromGroup';
    let myInit = {
      body: {
        "username": user,
        "groupname": group,

      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      }
    }
    return await API.post(apiName, path, myInit);
  
  }

  //Delete user

  async function deleteUser() {
    console.log(userPoolId)
    const params = {
      UserPoolId: userPoolId,
      Username: user,
     
      
    };
  
    try {
      const result = await cognitoIdentityServiceProvider.adminDeleteUser(params).promise();
      console.log(`Removed ${user}`);
      return {
        message: `Removed ${user}`,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }


  /**
   *
   *Checkbox selection handler to give or remove access
   *
   */
  async function handleCheckbox(check, value) {
    try {
      //Check if checkbox is selected
      if (check) {
        // Check if access already exists for user and if already selected before adding to group
        if (
          currentGroups.indexOf(value) === -1 &&
          addGroup.indexOf(value) === -1
        ) {
          addGroup.push(value);
        }
        //Check if access doesnt currently exist for user and not already selected
        if (
          currentGroups.indexOf(value) !== -1 &&
          removeGroup.indexOf(value) !== -1
        ) {
          removeGroup.splice(removeGroup.indexOf(value), 1);
        }
        //Check if checkbox is not selected
      } else {
        // On deselection remove from addGroup array
        addGroup.splice(addGroup.indexOf(value), 1);
        //Check if access exists for current user and not in removeGroup array
        if (
          currentGroups.indexOf(value) !== -1 &&
          removeGroup.indexOf(value) === -1
        ) {
          removeGroup.push(value);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  /**
   *
   *  User access form
   *
   */
  function userForm() {
    return (
      <Form onSubmit={handleSubmit}>
        <div class="form-group col-2">
          <label class="">Add Item</label>
          <br />
          <input
            type="checkbox"
            defaultChecked={accessGroup[0]}
            value="addItem"
            onChange={(e) => {
              handleCheckbox(e.target.checked, e.target.value);
            }}
          />
        </div>
        <div class="form-group col-2">
          <label>Remove Item</label>
          <br />
          <input
            type="checkbox"
            defaultChecked={accessGroup[1]}
            value="removeItem"
            onChange={(e) => {
              handleCheckbox(e.target.checked, e.target.value);
            }}
          />
        </div>
        <div class="form-group col-2">
          <label>Add Category</label>
          <br />
          <input
            type="checkbox"
            defaultChecked={accessGroup[2]}
            value="addCat"
            onChange={(e) => {
              handleCheckbox(e.target.checked, e.target.value);
            }}
          />
        </div>
        <div class="form-group col-2">
          <label>Remove Category</label>
          <br />
          <input
            type="checkbox"
            defaultChecked={accessGroup[3]}
            value="removeCat"
            onChange={(e) => {
              handleCheckbox(e.target.checked, e.target.value);
            }}
          />
        </div>
        <div class="form-group col-2">
          <label>Add Collection</label>
          <br />
          <input
            type="checkbox"
            defaultChecked={accessGroup[4]}
            value="addCollection"
            onChange={(e) => {
              handleCheckbox(e.target.checked, e.target.value);
            }}
          />
        </div>
        <div class="form-group col-2">
          <label>Remove Collection</label>
          <br />
          <input
            type="checkbox"
            defaultChecked={accessGroup[5]}
            value="removeCollection"
            onChange={(e) => {
              handleCheckbox(e.target.checked, e.target.value);
            }}
          />
        </div>
        <div class="form-group col-2">
          <label>Admin</label>
          <br />
          <input
            type="checkbox"
            defaultChecked={accessGroup[6]}
            value="Admin"
            onChange={(e) => {
              handleCheckbox(e.target.checked, e.target.value);
            }}
          />
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

  /**
   *
   *  Submission button handler
   *
   */

  async function handleSubmit(e) {
    e.preventDefault();

    if(addGroup.length > 0 ){

      addGroup.map((e)=>{
        addToGroup(user, e)
      })

    }
    if(removeGroup.length > 0){

      removeGroup.map((e)=>{
        removeFromGroup(user, e)
      })

    }
    if(addGroup.length < 1 && removeGroup.length < 1){
      alert("You have not made any changes")
    }
    if(user.length < 1){
      alert("No user has been selected")
    }

  }

  /**
   * Delete user
   */

  async function removeUser(){

      let apiName = 'AdminQueries';
      let path = '/deleteUser';
      let myInit = {
        body: {
          "username": user,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
        }
      }
      return await API.post( path, myInit);
    
    
  }

  useEffect(() => {
    listUsers();
  }, []);

  return (
    <div className="userManagement">
      <h1>User Account Management</h1>

      <div className="userEditing">
        <p>
          {" "}
          Please select one of the current users below, then edit their
          permissions.
        </p>
        <br />
        <label input="users">Select a user:</label>&nbsp;&nbsp;
        <Select
          id="users"
          name="users"
          options={userOptions}
          onChange={(e) => dropboxChangerHandler(e.value)}
        ></Select>
        &nbsp;&nbsp;&nbsp;
        <button
          onClick={() => {
            openAddUser();
          }}
        >
          Add User...
        </button>
        <p>Selected: {selected}</p>
        <div className="buttons">
          {renderForm ? userForm() : null}
        </div>
        <button
          onClick={() => {
            deleteUser();
          }}
        >
          Delete User
        </button>
      </div>
      <div class="modal-overlay">
        {showing ? (
          <AddUser showAddUser={showing} setShowAddUser={setShowing} />
        ) : null}
      </div>
    </div>
  );
}
