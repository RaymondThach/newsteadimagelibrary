import React, { useState } from "react";
import './CreateCategory.css'
import { API, graphqlOperation } from 'aws-amplify';
import { createTag } from '../../graphql/mutations';
import { tagByCatName } from '../../graphql/queries';

export default function CreateCategory({ setCreateCategory, setShowing, fetchCategories, tagOptions, pagination }) {
    //String value of the input field for new category name
    const [ inputValue, setInputValue] = useState('');

    //Update inputValue to user's input
    function myChangeHandler(event) {
        setInputValue(event.target.value);
    }

    //Create a new category name in the Tag table, refresh the category page.
    async function addToDB(tag){
        try {
            await API.graphql(graphqlOperation(createTag, {input:tag}));
            alert('A new category was created: ' + inputValue);
            if (window.location.pathname.includes('categories/') === false) {
                fetchCategories();     
            } 
            else {
                tagOptions.push({ value: tag.categoryName, label: tag.categoryName });
            }
        }
        catch (error) {
            console.log(error);
        }
        handleClose();
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

    //Manage the flow of the Submission button
    function handleSubmit(event) {
        const tag = { 
            categoryName: inputValue 
        }
        addNewCat(tag);
        pagination();

        //Prevent Redirection to Categories Page
        event.preventDefault();
    }

    //Manage the flow of closing the create category modal of two different paths
    function handleClose(){
        if(!setCreateCategory) {
            setShowing(false);
        }
        else {
            setCreateCategory(false);
        }
    }

    return (
        <>
        <div class="background">
          <div class="createCatContainer">
          <h1>
              Create Category<br></br>
            </h1>
            <form onSubmit={ handleSubmit }>
                <label class="categoryName">
             Category Name:
                <input type="text" value={ inputValue } onChange={ myChangeHandler } />
                </label>
            <div class="heading">Select Category Thumbnail</div>
            <div class="border2">
              <img
                class="thumbnail"
                src="https://cdn1.iconfinder.com/data/icons/hawcons/32/698394-icon-130-cloud-upload-512.png"
              ></img>
              <div class="text">Drag and Drop to Upload Files</div>
              <div class="text">OR</div>
              <input
                type="button"
                class='categoryfileButton'
                value="Select Local File"
              ></input>
            </div>
            <input class="submit" value="Create" />
            <button class='cancelBtn' onClick={() => {handleClose();}}>Cancel</button>
            </form>
          </div>
        </div>
      </>
    );
  }      