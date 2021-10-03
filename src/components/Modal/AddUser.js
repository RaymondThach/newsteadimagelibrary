import React, { useState, useEffect } from 'react';
import "./AddUser.css";
import "../pages/UserManagement.css"



export default function AddUser() {



    return (
        <div class="background">
            <div class="container">
                <h1>Create a New User</h1>
                <p>Please enter credentials for new user and set their permissions below.</p>
                <p>These will be able to be edited later.</p>
                <label>Username:&nbsp;<input type="text" /></label><br /><br />
                <label>Password:&nbsp;<input type="password" /></label>
                <br /><br /><br />
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
                    <br/>
                    <br/>
                    <br/>
                </div>
                <br/><br/><br/>
                <button>Submit</button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button>Cancel</button>
            </div>
        </div>
    )
}