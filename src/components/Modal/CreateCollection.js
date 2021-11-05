
import "./CreateCollection.css";
import { createCollection } from "../../graphql/mutations";
import { collectionName } from "../../graphql/queries";
import React, { useState } from "react";
import { API, graphqlOperation } from 'aws-amplify';

export default function CreateCollection({ fetchCollection, setShowing, setCreateCollection, pagination }) {
  //String value of the input field for new category name
  const [inputValue, setInputValue] = useState('');

  //Update inputValue to user's input
  function myChangeHandler(event) {
    setInputValue(event);
  }

  //Create a new category name in the Tag table, refresh the category page.
  async function addToDB(collection) {
    try {
      await API.graphql(graphqlOperation(createCollection, { input: collection }));
      alert('A new collection was created: ' + inputValue);
      fetchCollection();     
    }
    catch (error) {
      console.log(error);
    }
    handleClose();
  }

  //Query DB using input category name to check if it already exists, if not add it to the Tag table
  async function addNewCollection(collection) {
    try {
      const arrResult =  await API.graphql(graphqlOperation(collectionName, collection))
      if (arrResult.data.collectionName.items.length === 0) {
        addToDB(collection);
      } else {
        alert("Collection " + inputValue + " already exists.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Manage the flow of the Submission button
  function handleSubmit(event) {
    const collection = {
      name: inputValue
    }
    addNewCollection(collection);
    if (window.location.pathname.includes('collections/') === false) {
      pagination(); 
    } 

    //Prevent Redirection to Categories Page
    event.preventDefault();
  }

  //Manage the flow of closing the create category modal of two different paths
  function handleClose(){
    if(!setCreateCollection) {
        setShowing(false);
    }
    else {
        setCreateCollection(false);
    }
}

  return (
    <>
      <div class="background">
        <div class="createColContainer">
          <form onSubmit={handleSubmit} class='createColForm'>
            <label class='newColLabel'>
              New Collection Name: 
            </label>
            <input type="text" value={inputValue} onChange={(e)=>myChangeHandler(e.target.value)} />
            <input type="submit" value="Submit" class='submitBtn'/>
            <button class='cancelBtn' onClick={() => {handleClose();} }>Cancel</button>
          </form>
        </div>
      </div>
    </>
  );
}