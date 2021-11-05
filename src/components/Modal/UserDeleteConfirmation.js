
import React from "react";
import "./UserDeleteConfirmation.css";

const { CognitoIdentityServiceProvider } = require('aws-sdk');
const userPoolId = process.env.REACT_APP_USERPOOL_ID;
const region = process.env.REACT_APP_REGION;
const accessKey = process.env.REACT_APP_ACCESS_KEY;
const secret = process.env.REACT_APP_SECRET;
const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({ region: region, accessKeyId: accessKey, secretAccessKey: secret });


export default function UserDeleteConfirmation ({setShowUserDelete, user, listUsers, userOptions}){

//Delete user

async function deleteUser() {
    const params = {
      UserPoolId: userPoolId,
      Username: user,


    };

    try {
      const result = await cognitoIdentityServiceProvider.adminDeleteUser(params).promise();
      console.log(`Removed ${user}`);
      userOptions.map((e,i)=>{
         if(e.value === user){
             userOptions.splice(i,1)
         }
      })
      setShowUserDelete(false)
      return {
        message: `Removed ${user}`,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  return (
      <>
          <div class='delUserBg'>
              <div class='delUserContainer'>
                <label>Are you sure you want to delete <b>{user}</b></label>
                <div>
                    <button class='confirmDelUserBtn' onClick={() => {deleteUser();}}>Confirm</button>
                    <button class='cancelDelUserBtn' onClick={() => {setShowUserDelete(false);}}>Cancel</button>
                </div>
              </div>
          </div>
      </>
    );
  }      
