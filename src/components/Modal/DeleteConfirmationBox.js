import React from 'react';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { deleteMediaFile } from '../../graphql/mutations';
import './DeleteConfirmationBox.css';

export default function DeleteConfirmationBox({delItem, setDelConfirmation, fetchMediaFiles}) {
    
    //Delete the item from the S3 bucket and the DynamoDB, fetch media files again for dynamic refresh.
    async function deleteItem(itemName, itemID) {
        try {
            await API.graphql(graphqlOperation(deleteMediaFile, {input: {id: itemID}}));
            await Storage.remove(itemName);
            fetchMediaFiles();
            setDelConfirmation(false);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <div class='background'>
                <div class='delConfirmContainer'>
                    <label>
                        Are you sure you want to delete {delItem.name}?
                    </label>
                    <div>
                        <button class='confirmDelBtn' onClick={() => {deleteItem(delItem.name, delItem.id);}}>Confirm</button>
                        <button class='cancelDelBtn' onClick={() => {setDelConfirmation(false);}}>Cancel</button>
                    </div>
                </div>
            </div>
        </>
    );
  }      