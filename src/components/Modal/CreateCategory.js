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
        console.log('reached');
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
        if (window.location.pathname.includes('categories/') === false) {
            pagination(); 
        } 
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
            <form onSubmit={ handleSubmit } class='createCatForm'>
                <label class='newCatLabel'>
                New Category Name:
                </label>
                <input type="text" value={ inputValue } onChange={ myChangeHandler }/>
                <input type="submit" value="Submit" class='submitBtn'/>
                <button class='cancelBtn' onClick={() => {handleClose();}}>Cancel</button>
            </form>
          </div>
        </div>
      </>
    );
  }      