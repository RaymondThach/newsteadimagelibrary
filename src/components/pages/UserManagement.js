import React, { useState } from "react";
import './UserManagement.css';
import "amazon-cognito-identity-js";
import AddUser from '../Modal/AddUser';
import {listUsers} from '../../../amplify/backend/function/AdminQueries10f5143c/src/cognitoActions';



var AWS = require('aws-sdk/dist/aws-sdk-react-native');


var authParams =
{
  region: "ap-southeast-2",
  accessKeyId: "AKIA6BQ24HHUGMT6TRNP",
  secretAccessKey: `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`
};


var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(authParams);
//secretAccessKey
//accessKeyId

var params = {
  UserPoolId: 'ap-southeast-2_x4sXqw918"',
  AttributesToGet: [
    'Username',

  ],
};



export default function UserMangement() {
  console.log("inside function");
  const [selected, setSelected] = useState('');
  const [showing, setShowing] = useState(false);

  cognitoidentityserviceprovider.listUsers(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data);           // successful response
  });

  return (
    <div className="userManagement">
      <h1>User Account Management</h1>

      <div className="userEditing">
        <p> Please select one of the current users below, then edit their permissions.</p>
        <br />

        <label input="users">Select a user:</label>&nbsp;&nbsp;
        <select
          id="users"
          name="users"
          value={selected}
          onChange={e => setSelected(e.currentTarget.value)}>
          <option value="" selected="selected">Please select a user from the list</option>
          <option value="user 1">user 1</option>
          <option value="user 2">user 2</option>
          <option value="user 3">user 3</option>
          <option value="user 4">user 4</option>
          <option value="user 5">user 5</option>
          <option value="user 6">user 6</option>
        </select>&nbsp;&nbsp;&nbsp;
        <button onClick={() => { setShowing(!showing); }}>Add User...</button>
        <p>Selected: {selected}</p>
        <div className="buttons">
          <label id="labelSpacing">Add Item</label>
          <label class="switch">
            <input type="checkbox" id="addItem" />
            <span class="slider round"></span>
          </label>

          <br />
          <br />

          <label id="labelSpacing">Remove Item</label>
          <label class="switch">
            <input type="checkbox" id="removeItem" />
            <span class="slider round"></span>
          </label>

          <br />
          <br />
          <label id="labelSpacing">Add Category</label>
          <label class="switch">
            <input type="checkbox" id="addCategory" />
            <span class="slider round"></span>
          </label>

          <br />
          <br />
          <label id="labelSpacing">Remove Category</label>
          <label class="switch">
            <input type="checkbox" id="removeCategory" />
            <span class="slider round"></span>
          </label>

        </div>
        <div className="buttons2">
          <label id="labelSpacing">Add Category</label>
          <label class="switch">
            <input type="checkbox" id="addCollection" />
            <span class="slider round"></span>
          </label>

          <br />
          <br />
          <label id="labelSpacing">Remove Collection</label>
          <label class="switch">
            <input type="checkbox" id="removeCollectiom" />
            <span class="slider round"></span>
          </label>

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

      </div>
      <div class="modal-overlay">
        {showing
          ? <AddUser/>
          : null
        }
      </div>

    </div>
  );

}