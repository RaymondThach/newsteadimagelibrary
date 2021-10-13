import React from 'react';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { deleteMediaFile, deleteTag, updateMediaFile } from '../../graphql/mutations';
import { listMediaFiles } from '../../graphql/queries';
import './DeleteConfirmationBox.css';

export default function DeleteConfirmationBox({ delItem, delCategory, setDelConfirmation, fetchMediaFiles, fetchCategories, pagination }) {
    
    //Delete the item from the S3 bucket and the DynamoDB, fetch media files again for dynamic refresh.
    async function deleteItem(item) {
        try {
            await API.graphql(graphqlOperation(deleteMediaFile, {input: {id: item.id}}));
            await Storage.remove(item.name);
            fetchMediaFiles();
            setDelConfirmation(false);
            pagination();
        } catch (e) {
            console.log(e);
        }
    }

    //Delete the category from DynamoDB then dynamically refresh
    async function deleteCategory(category) {
        try {
            await API.graphql(graphqlOperation(deleteTag, {input: {id: category.id}}));
            const taggedItems = await API.graphql(graphqlOperation(listMediaFiles, { filter: { tags: { contains: (category.categoryName.replace(/-/g, ' ')) } } }));
            taggedItems.data.listMediaFiles.items.map((item) => {
                const tagsArr = item.tags;
                const index = tagsArr.indexOf(category.categoryName.replace(/-/g, ' '));
                if (index !== -1) { 
                    tagsArr.splice(index, 1);
                    API.graphql(graphqlOperation(updateMediaFile, { input: { id: item.id, tags: tagsArr } }));
                } 
            });
            fetchCategories();
            setDelConfirmation(false);
            pagination();
        } catch (e) {
            console.log(e);
        }
    }

    //Deletion handler
    function deletion() {
        if (delCategory) {
            deleteCategory(delCategory);
        }
        else {
            deleteItem(delItem);
        }
    }

    return (
        <>
            <div class='background'>
                <div class='delConfirmContainer'>
                    {
                        (delCategory ? <label>Are you sure you want to delete {delCategory.categoryName}?</label> : <label>Are you sure you want to delete {delItem.name}?</label>)
                    }
                    <div>
                        <button class='confirmDelBtn' onClick={() => {deletion();}}>Confirm</button>
                        <button class='cancelDelBtn' onClick={() => {setDelConfirmation(false);}}>Cancel</button>
                    </div>
                </div>
            </div>
        </>
    );
  }      