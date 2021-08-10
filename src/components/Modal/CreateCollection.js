import React from "react";
import './CreateCollection.css'
import {Storage, API, graphqlOperation } from 'aws-amplify';
import awsExports from '../../aws-exports.js';
import { AmplifyS3Album } from '@aws-amplify/ui-react';



export default class CreateCollection extends React.Component {

  


  s3CreateCollection(){
   
    //File needs to exist in directory, create temp file in no media file is uploaded during creation
        Storage.put(this.state.value + '/temp.tmp',this.state.value)
       
        
    }


  constructor(props) {
    super(props);
    this.state = {value: ''};

    
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    this.s3CreateCollection()
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  myChangeHandler = (event) => {
    this.setState({value: event.target.value});
  }

  


  render() {
    return (
    <>
      <div class="background">
        <div class="container">
          <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input type="text" value={this.state.value} onChange={this.myChangeHandler} />
          </label>
          <input type="submit" value="Submit" />
        </form>
    );

        </div>

      </div>
    
    </>
    )
  }
}