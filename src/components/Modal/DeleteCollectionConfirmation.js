import React, { useEffect } from 'react';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { deleteMediaFile, deleteCollection, updateMediaFile } from '../../graphql/mutations';
import { listMediaFiles } from '../../graphql/queries';
import './DeleteConfirmationBox.css';

export default function DeleteCollectionConfirmation({ delItem, delCollection, setDelConfirmation, fetchMediaFiles, fetchCollection }) {
    
    //Delete the item from the S3 bucket and the DynamoDB, fetch media files again for dynamic refresh.
    async function deleteItem(item) {
        try {
            await API.graphql(graphqlOperation(deleteMediaFile, {input: {id: item.id}}));
            await Storage.remove(item.name);
            fetchMediaFiles();
            setDelConfirmation(false);
        } catch (e) {
            console.log(e);
        }
    }

    async function deleteSelectedCollection(collection) {
        try {
            await API.graphql(graphqlOperation(deleteCollection, {input: {id: collection.id}}));
            const collectionItems = await API.graphql(graphqlOperation(listMediaFiles, { filter: { collection: { contains: (collection.name.replace(/-/g, ' ')) } } }));
            collectionItems.data.listMediaFiles.items.map((item) => {
                const collectionArr = item.collection;
                const index = collectionArr.indexOf(collection.name.replace(/-/g, ' '));
                if (index !== -1) { 
                    collectionArr.splice(index, 1);
                    API.graphql(graphqlOperation(updateMediaFile, { input: { id: item.id, collection: collectionArr } }));
                } 
            });
            fetchCollection();
            setDelConfirmation(false);
        } catch (e) {
            console.log(e);
        }
    }

    function deletion() {
        if (delCollection) {
            deleteSelectedCollection(delCollection);
        }
        else {
            deleteItem(delItem);
        }
    }

    useEffect(() => {
        //console.log(currentPathName);
    }, []);

    return (
        <>
            <div class='background'>
                <div class='delConfirmContainer'>
                    {
                        (delCollection ? <label>Are you sure you want to delete <b>{delCollection.name}</b>?</label> : <label>Are you sure you want to delete <b>{delItem.name}</b>?</label>)
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