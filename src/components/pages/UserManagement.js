import React, { useState, useEffect } from "react";
import './UserManagement.css';
import "amazon-cognito-identity-js";
import AddUser from '../Modal/AddUser';
import Amplify, { Auth, API } from 'aws-amplify';
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";

export default function UserMangement() {

  // Dropdown box value selection 
  const [selected, setSelected] = useState('');
  // State handler for user creation form
  const [showing, setShowing] = useState(false);
  //State handler for form rendering
  const [renderForm, setRenderForm] = useState(true);
  // User list array for dropdown
  const [userOptions] = useState([]);
  //Selected user current groups
  const [currentGroups, setCurrentGroup] = useState([]);
  //User group status
  const [accessGroup] = useState([false, false, false, false, false, false, false]);
  //User group names
  const [groupNames] = useState(['addItem', 'removeItem', 'addCat', 'removeCat', 'addCollection', 'removeCollection', 'Admin']);

  //Show user creation form
  const openAddUser = () => {
    setShowing(true);
  }

  // Grab all user accounts in current user pool and store in array for dropdown options
  async function listUsers() {
    let apiName = 'AdminQueries';
    let path = '/listUsers';
    let myInit = {

      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      }
    }
    const userList = await API.get(apiName, path, myInit)

    await userList.Users.map((user) => {
      userOptions.push({ value: user.Username, label: user.Username })

    })

    console.log("listing users " +accessGroup)

  }


  // Grab the access groups user is in
  async function listUserGroups(e) {
    setCurrentGroup([])
    let apiName = 'AdminQueries';
    let path = '/listGroupsForUser';
    let myInit = {
      queryStringParameters: {
        "username": e
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      }
    }


    const userGroups = await API.get(apiName, path, myInit)

    console.log("TEST "+currentGroups)

    userGroups.Groups.map((group) => {
      currentGroups.push(group.GroupName)
      
    })

   
    
    setCurrentGroups(currentGroups)
    setRenderForm(false)
    setRenderForm(true)

  }

  //Dropbox handler, set value to state and list user access groups for selected user
  async function dropboxChangerHandler(e) {
    setSelected(e)
    listUserGroups(e)
    console.log(e)



  }

  //Current groups for selected user checkbox handler

  async function setCurrentGroups(groups) {
    
    accessGroup.map((e, i) => {
      
      
      accessGroup[i] = false
     
    })

    console.log(accessGroup)



    groups.map((e) => {
      console.log(e)
      if(groupNames.indexOf(e) !== -1){
        accessGroup[groupNames.indexOf(e)] = true
      }
     
    })
    console.log(accessGroup)



  }



  async function handleCheckbox() {

  }

function userForm() {

    return (<>

      <div class="form-group col-2">
        <label class="">Add Item</label><br />
        <input type="checkbox" defaultChecked={accessGroup[0]} value="addItem" onChange={((e) => { handleCheckbox(e.target.checked, e.target.value) })} />
      </div>
      <div class="form-group col-2">
        <label>Remove Item</label><br />
        <input type="checkbox" defaultChecked={accessGroup[1]} value="removeItem" onChange={((e) => { handleCheckbox(e.target.checked, e.target.value) })} />
      </div>
      <div class="form-group col-2">
        <label>Add Category</label><br />
        <input type="checkbox" defaultChecked={accessGroup[2]} value="addCat" onChange={((e) => { handleCheckbox(e.target.checked, e.target.value) })} />
      </div>
      <div class="form-group col-2">
        <label>Remove Category</label><br />
        <input type="checkbox" defaultChecked={accessGroup[3]} value="removeCat" onChange={((e) => { handleCheckbox(e.target.checked, e.target.value) })} />
      </div>
      <div class="form-group col-2">
        <label>Add Collection</label><br />
        <input type="checkbox" defaultChecked={accessGroup[4]} value="addCollection" onChange={((e) => { handleCheckbox(e.target.checked, e.target.value) })} />
      </div>
      <div class="form-group col-2">
        <label>Remove Collection</label><br />
        <input type="checkbox" defaultChecked={accessGroup[5]} value="removeCollection" onChange={((e) => { handleCheckbox(e.target.checked, e.target.value) })} />
      </div>
      <div class="form-group col-2">
        <label>Admin</label><br />
        <input type="checkbox" defaultChecked={accessGroup[6]} value="Admin" onChange={((e) => { handleCheckbox(e.target.checked, e.target.value) })} />
      </div>

    </>)

  }







  useEffect(() => {
    listUsers();
  }, []);



  return (
    <div className="userManagement">
      <h1>User Account Management</h1>

      <div className="userEditing">
        <p> Please select one of the current users below, then edit their permissions.</p>
        <br />

        <label input="users">Select a user:</label>&nbsp;&nbsp;
        <Select
          id="users"
          name="users"
          options={userOptions}
          onChange={e => dropboxChangerHandler(e.value)}>


        </Select>&nbsp;&nbsp;&nbsp;
        <button onClick={() => { openAddUser(); }}>Add User...</button>
        <p>Selected: {selected}</p>
        <div className="buttons">
          <label id="labelSpacing">Add Item</label>
          <label class="switch">
            <input type="checkbox" id="addItem" />
            <span class="slider round"></span>
          </label>

          <br />
          <br />
          {
            renderForm 
            ? userForm()
            :null

          }


          <br />
          <br />
          <label id="labelSpacing">Edit Users</label>
          <label class="switch">
            <input type="checkbox" />
            <span class="slider round"></span>
          </label>

          <br /><br />
          <div className="passPad">
            <button >Change Password</button>
          </div>
        </div>
        <br /><br /><br />

        <button>Commit Changes</button>
        <br /><br /><br />
        <button onClick={() => console.log(accessGroup)}>Commit Changes</button>
        <br /><br /><br />

      </div>
      <div class="modal-overlay">
        {showing
          ? <AddUser showAddUser={showing} setShowAddUser={setShowing} />
          : null
        }
      </div>

    </div>
  );

}