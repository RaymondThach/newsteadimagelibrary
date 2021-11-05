import React, { useState } from "react";
import "./ResetPassword.css";
import "../pages/UserManagement.css";
import Form from "react-bootstrap/Form";

export default function ResetPassword({ user, showResetPassword, setShowResetPassword }) {

    const { CognitoIdentityServiceProvider } = require('aws-sdk');
    
    const userPoolId = process.env.REACT_APP_USERPOOL_ID;
    const region = process.env.REACT_APP_REGION;
    const accessKey = process.env.REACT_APP_ACCESS_KEY;
    const secret = process.env.REACT_APP_SECRET;
    const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({ region: region, accessKeyId: accessKey, secretAccessKey: secret });
    
  
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    
  /**
   *
   *   Update User Password
   * 
   * */
  /**
   *
   *   Update User Password
   * 
   * */
   async function resetPassword() {
    const params = {
      UserPoolId: userPoolId,
      Username: user,
      Password: password,
      Permanent: true



    };

    try {
      const result = await cognitoIdentityServiceProvider.adminSetUserPassword(params).promise();
      console.log(`Password has been reset for  ${user}`);
      return {
        message: `Password has been reset for ${user}`,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }


    // Handle submission to coginito for user account creation
    async function handleSubmit(event) {
        event.preventDefault();

        try {
            //Check if confirmation password matches
            if (confirmPassword !== password) {
                alert("Password does not match");
            } else {
                resetPassword();
                
            }
        } catch (e) {
            alert(e.message)
        }
    }



    //Renders user sign up form 
    function renderForm() {
        return (
            <Form onSubmit={handleSubmit}>
                <div class="form-group row">

                    <div class="form-group col-md-6-passwordReset">
                        <Form.Group controlId="password" size="lg">
                            <Form.Label> Password </Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                    </div>
                    <div class="form-group col-md-6-passwordReset">
                        <Form.Group controlId="confirmPassword" size="lg">
                            <Form.Label> Confirm Password </Form.Label>
                            <Form.Control
                                type="password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                value={confirmPassword}
                            />
                        </Form.Group>
                    </div>

                </div>
                <button class='resetPassBtn'
                    block
                    size="lg"
                    type="submit"
                    style={{
                        fontSize: 20,
                    }}
                >
                    Reset Password
                </button>

                <button class='cancelResetPassBtn'
                    block
                    size="lg"
                    type="reset"
                    onClick={() => { setShowResetPassword(false); }}
                    style={{
                        fontSize: 20,
                    }
                    }

                >
                    Cancel
                </button>
            </Form>
        );
    }


    return (
        <>
            {showResetPassword ?
                <div class="resetPasswordBg" >
                    <div class='resetPassContainer'>
                        <div id="add-user">
                            <h2> Password Reset for <b>{user}</b> </h2>
                            <p>
                                Please enter new password
                            </p>
                            {renderForm()}
                        </div>
                    </div>
                </div >
                : null
            }
        </>
    );


}
