import { Storage } from "aws-amplify";
import { listMediaFiles } from "../../graphql/queries";
import { API, graphqlOperation } from "aws-amplify";
import { AmplifyS3Image } from "@aws-amplify/ui-react";
import Gallery from '../Modal/Gallery';
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import './CollectionItem.css';
import { MdClose } from 'react-icons/md';
import { deleteMediaFile } from '../../graphql/mutations';
import { useAppContext } from '../services/context.js';
import { BsCameraVideo } from "react-icons/bs";

export default function CollectionItem() {
    //Get the URL parameter to set the unformatted category name
    const { name } = useParams();
    //State variable to store formatted Collection name
    const [collectionName, setCollectionName] = useState('');
    //State array of media files of selected collection
    const [items, setItems] = useState([]);
    //State variable of selected item
    const [item, setItem] = useState();
    //State variable for showing the gallery
    const [showGallery, setShowGallery] = useState(false);
    //Use declared context variables to track delete mode
    const { deleteMode } = useAppContext();
    // Accepted video extensions
    const videoFormat = ['mp4', 'mov', 'wmv', 'avi', 'avchd', 'flv', 'f4v', 'swf', 'mkv']

    //Show gallery on click of an item
    const openGallery = () => {
        setShowGallery(true);
    }

    //Fetch all media files of the selected collection
    async function fetchMediaFiles() {
        const results = await API.graphql(graphqlOperation(listMediaFiles, { filter: { collection: { contains: (name.replace(/-/g, ' ')) } } }));
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

    //componentDidMount() for functional component
    useEffect(() => {
        
        setCollectionName(name.replace(/-/g, ' '));
        fetchMediaFiles();
    }, []);

    return (
        <div class="page">
            <div class="header">
                <h1>
                    {collectionName}
                </h1>
            </div>
            <div class="main-content">
                <div class='itemGrid'></div>
                <div class="collectionItems">
                    {
                        items.map((item, i) => (
                            <a class='items' key={item.name} >
                                {
                                    (deleteMode ? <MdClose id='deleteCollectionItem' onClick={() => { deleteItem(item.name, item.id); }} /> : null)
                                }
                                <div class='item' onClick={() => { openGallery(); setItem(item); }}>
                                    <div class='item_tn' >
                                        {
                                             videoFormat.indexOf(item.name.split('.').pop()) > -1
                                             ? <BsCameraVideo id="video-thumbnail"/>
                                             :<AmplifyS3Image imgKey={item.name} />
                                        }
                                        
                                    </div>
                                    <label class='collectionItem_name'>{item.name}</label>
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
  );
}
