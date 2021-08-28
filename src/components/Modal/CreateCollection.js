import React from "react";
import './CreateCollection.css'
import {Storage, API, graphqlOperation, AWSCloudWatchProvider } from 'aws-amplify';
import awsExports from '../../aws-exports.js';
import { AmplifyS3Album } from '@aws-amplify/ui-react';
import {createCollection } from '../../graphql/mutations';






export default class CreateCollection extends React.Component {

  

// grabs input from text and creates a folder 
  s3CreateCollection(){
   
    //File needs to exist in directory, create temp file in no media file is uploaded during creation
        Storage.put('Collections/'+ this.state.value + '/temp.tmp',this.state.value)
       
        
    }


  constructor(props) {
    super(props);
    this.state = {value: ''};

    
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  //Add Collection name to table

  addToDb = async (collection) => {
    console.log('adding to DB')
    try{
      await API.graphql(graphqlOperation(createCollection, {input:collection}))
    } catch (error){
      console.log(error)
    }
  }

  //sends to s3 after hitting submit
  handleSubmit(event) {
    this.s3CreateCollection()
    alert('A name was submitted: ' + this.state.value);

    
    const collection ={
      name: this.state.value
    }
    console.log(collection)

    //push to db
    this.addToDb(collection)
    console.log('added to database')
    event.preventDefault();
  }

  //grabs user input in textbox
  myChangeHandler = (event) => {
    this.setState({value: event.target.value});
  }


 

 


  
   

  

  


  render() {
    return (
    <>
      <div class="background">
        <div class="container">
        <h1>Create Collection<br></br></h1>
          <form onSubmit={this.handleSubmit}>
          <label class="collectionName">
            <h2>Collection Name:</h2>
            <input type="text" value={this.state.value} onChange={this.myChangeHandler} />
          </label>
        </form>
        <div class="heading">Select Collection Thumbnail</div>
        <div class="border2">
        <img class="thumbnail" src="https://cdn1.iconfinder.com/data/icons/hawcons/32/698394-icon-130-cloud-upload-512.png"></img>
        <div class= "text">Drag and Drop to Upload Files</div>
        <div class= "text">OR</div>
        <input type="button" class="filebutton" value="Select Local File "></input>
        </div>
        <input type="submit" class="submit" value="Create" />
  </div>
  </div>
    </>
    )
  }
}