import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { MdClose } from 'react-icons/md';
import { listMediaFiles } from '../../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import Gallery from '../Modal/Gallery';
import { AmplifyS3Image } from '@aws-amplify/ui-react';
import { useAppContext } from '../services/context.js';
import DeleteConfirmationBox from '../Modal/DeleteConfirmationBox.js';
import './CategoryItem.css';
import { BsCameraVideo } from "react-icons/bs";

export default function CategoryItem() {
    //Get the URL parameter to set the unformatted category name
    const { categoryName } = useParams();
    //State variable to store formatted category name
    const [catName, setCatName] = useState('');
    //State array of media files of selected category
    const [items, setItems] = useState([]);
    //State variable of selected item
    const [item, setItem] = useState();
    //State variable for showing the gallery
    const [showGallery, setShowGallery] = useState(false);
    //Use declared context variables to track delete mode
    const { deleteMode } = useAppContext();
    // Accepted video extensions
    const videoFormat = ['mp4', 'mov', 'wmv', 'avi', 'avchd', 'flv', 'f4v', 'swf', 'mkv']
    //State variable for showing a delete confirmation box when delete button is clicked
    const [delConfirmation, setDelConfirmation] = useState(false);
    //State variable of selected item for deletion
    const [delItem, setDelItem] = useState();
    
    //Show gallery on click of an item
    const openGallery = () => {
        setShowGallery(true);
    }

    //Fetch all media files of the selected category accounting for uncategorised items in uncategorised page
    async function fetchMediaFiles() {
        if (categoryName === 'Uncategorised') {
            const uncategorised = [];
            const results = await API.graphql(graphqlOperation(listMediaFiles));
            if (results.data.listMediaFiles.items.length > 0){
                results.data.listMediaFiles.items.map((item) => {
                    if (item.tags.length === 0){
                        uncategorised.push(item);
                    }
                })
                setItems(uncategorised);
            }
        }
        else {
            const results = await API.graphql(graphqlOperation(listMediaFiles, { filter: { tags: { contains: (categoryName.replace(/-/g, ' ')) } } }));
            setItems(results.data.listMediaFiles.items);
        }
    };

    //Handler for showing delete cofirmation and setting the selected item to pass to confirmation box.
    function showDelConfirmation(selectedItem) {
        setDelItem(selectedItem);
        setDelConfirmation(true);
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
                                        (deleteMode ? <MdClose id='deleteCatItem' onClick={() => { showDelConfirmation(item); }} /> : null)
                                    }
                                    <div class='item' onClick={() => { openGallery(); setItem(item); }}>
                                        <div class='catItem_tn' >
                                            {
                                                videoFormat.indexOf(item.name.split('.').pop()) > -1
                                                    ? <BsCameraVideo id="video-thumbnail" />
                                                    : <AmplifyS3Image imgKey={item.name} />
                                            }
                                        </div>
                                        <label class='catItem_name'>{item.name}</label>
                                    </div>
                                </a>
                            ))
                        }
                    </div>
                    {
                        (delConfirmation ? <DeleteConfirmationBox delItem={delItem} setDelConfirmation={setDelConfirmation} fetchMediaFiles={fetchMediaFiles} /> : null)
                    }
                </div>
            </div>
            <div class='modal-overlay'>
                {
                    (showGallery ? <Gallery showGallery={showGallery} setShowGallery={setShowGallery} item={item} fetchMediaFiles={fetchMediaFiles} /> : null)
                }
            </div>
        </div>

    );
}
