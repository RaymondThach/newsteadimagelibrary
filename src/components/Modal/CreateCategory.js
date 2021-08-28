import React, { useState } from "react";
import './CreateCategory.css'
import { API, graphqlOperation } from 'aws-amplify';
import { createTag } from '../../graphql/mutations';
import { tagByCatName} from '../../graphql/queries';

export default function CreateCategory() {
    //String value of the input field for new category name
    const [ inputValue, setInputValue] = useState("");

    //Update inputValue to user's input
    function myChangeHandler(event) {
        setInputValue(event.target.value);
    }

    //Create a new category name in the Tag table
    async function addToDB(tag){
        try {
            await API.graphql(graphqlOperation(createTag, {input:tag}));
            alert('A new category was created: ' + inputValue);
        } 
        catch (error) {
            console.log(error);
        }
    }

    //Query DB using input category name to check if it already exists, if not add it to the Tag table
    async function addNewCat(tag){
        try {
            const arrResult = await API.graphql(graphqlOperation(tagByCatName, tag));
            { arrResult.data.tagByCatName.items.length === 0 ? addToDB(tag) : alert('Category ' + inputValue + ' already exists.') };
        }
        catch(error) {
            console.log(error);
        }
    }

    function handleSubmit(event) {
        const tag = { 
            categoryName: inputValue 
        }
        addNewCat(tag);

        //Prevent Redirection to Categories Page
        event.preventDefault();
    }

    return (
        <>
        <div class="background">
          <div class="container">
            <form onSubmit={ handleSubmit }>
                <label>
                New Category Name:
                <input type="text" value={ inputValue } onChange={ myChangeHandler } />
                </label>
                <input type="submit" value="Submit" />
            </form>
          </div>
        </div>
      </>
    );
  }      