import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { MdClose } from 'react-icons/md';
import { listMediaFiles } from '../../graphql/queries';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import Gallery from '../Modal/Gallery';
import { AmplifyS3Image } from '@aws-amplify/ui-react';
import { useAppContext } from '../services/context.js';
import { deleteMediaFile } from '../../graphql/mutations';
import './CategoryItem.css';

export default function CategoryItem() {
    //Get the URL parameter to set the unformatted category name
    const { categoryName } = useParams();
    //State variable to store formatted category name
    const [ catName, setCatName] = useState('');
    //State array of media files of selected category
    const [ items, setItems ] = useState([]); 
    //State variable of selected item
    const [ item, setItem ] = useState();
    //State variable for showing the gallery
    const [showGallery, setShowGallery] = useState(false);
    //Use declared context variables to track delete mode
    const { deleteMode } = useAppContext();
    
    //Show gallery on click of an item
    const openGallery = () => {
        setShowGallery(true);
    }

    //Fetch all media files of the selected category
    async function fetchMediaFiles() {
        const results = await API.graphql(graphqlOperation(listMediaFiles, {filter: {tags: {contains: (categoryName.replace(/-/g, ' '))}}}));
        setItems(results.data.listMediaFiles.items);
    };

    //Delete the item from the S3 bucket and the DynamoDB, fetch media files again for dynamic refresh.
    async function deleteItem(itemName, itemID) {
        try {
            await API.graphql(graphqlOperation(deleteMediaFile, {input: {id: itemID}}));
            await Storage.remove(itemName);
            fetchMediaFiles();
        } catch (e) {
            console.log(e);
        }
    }

    //componentDidMount() for functional component, fetch media files on mount and format the category name. 
    useEffect(() => {
        setCatName(categoryName.replace(/-/g, ' '));
        fetchMediaFiles();
    }, []); 

    return (
        <div class='page'>
            <div class='header'>
                <h1>
                    {catName}
                </h1> 
            </div>
            <div class='main-content'>
                    <div class='catItemGrid'>
                        <div class='categoryItems'>
                        {
                            items.map((item, i) => (
                            <a class='items' key={item.name} >
                                {
                                    (deleteMode ? <MdClose id='deleteCatItem' onClick={() => { deleteItem(item.name, item.id); } }/> : null)
                                }
                                <div class='item' onClick={() => { openGallery(); setItem(item); }}>
                                    <div class='catItem_tn' >
                                        <AmplifyS3Image imgKey={item.name}/>
                                    </div>
                                    <label class='catItem_name'>{item.name}</label>
                                </div>
                            </a>
                            ))
                        }   
                        </div>
                    </div>
                    <div class='modal-overlay'>
                    {
                        (showGallery ? <Gallery showGallery={showGallery} setShowGallery={setShowGallery} item={item} fetchMediaFiles={fetchMediaFiles} /> : null)
                    }
                    </div> 
            </div> 
        </div>   
    );
  }      