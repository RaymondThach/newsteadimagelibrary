import React, { useState, useEffect } from "react";
import './CreateCategory.css'
import { API, graphqlOperation } from 'aws-amplify';
import { createTag } from '../../graphql/mutations';
import { tagByCatName } from '../../graphql/queries';
import { useAppContext } from '../services/context.js';

export default function CreateCategory({ setCreateCategory, setShowing, fetchCategories, tagOptions }) {
    //String value of the input field for new category name
    const [ inputValue, setInputValue] = useState('');

    //Update inputValue to user's input
    function myChangeHandler(event) {
        setInputValue(event.target.value);
    }

    //Context object to keep track of whether gallery modal is open from App.js
    const { galleryIsOpen } = useAppContext();

    //Create a new category name in the Tag table, refresh the category page.
    async function addToDB(tag){
        try {
            await API.graphql(graphqlOperation(createTag, {input:tag}));
            alert('A new category was created: ' + inputValue);
            if (galleryIsOpen === false) {
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

    useEffect(() => {
        console.log(galleryIsOpen);
    }, []);

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
                class="filebutton"
                value="Select Local File "
              ></input>
            </div>
            <input type="submit" value="Create" />
            <button class='cancelBtn' onClick={() => {handleClose();}}>Cancel</button>
            </form>
          </div>
        </div>
      </>
    );
  }      