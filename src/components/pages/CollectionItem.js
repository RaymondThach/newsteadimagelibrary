import { listMediaFiles, getCollection, getMediaFile } from "../../graphql/queries";
import { API, graphqlOperation } from "aws-amplify";
import { AmplifyS3Image } from "@aws-amplify/ui-react";
import Gallery from '../Modal/Gallery';
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import './CollectionItem.css';
import { MdClose } from 'react-icons/md';
import { updateMediaFile } from '../../graphql/mutations';
import { useAppContext } from '../services/context.js';
import { BsCameraVideo } from "react-icons/bs";
import { useHistory } from 'react-router-dom';

export default function CollectionItem() {
    //Get the URL parameter to set the unformatted collection name
    const { id } = useParams();
    //State variable to store formatted Collection name
    const [collectionName, setCollectionName] = useState('');
    //Context state array for items of a selected category lifted to App.js
    const { items, setItems } = useAppContext();
    //State variable of selected item
    const [item, setItem] = useState();
    //State variable for showing the gallery
    const [showGallery, setShowGallery] = useState(false);
    //Use declared context variables to track delete mode
    const { deleteMode } = useAppContext();
    // Accepted video extensions
    const videoFormat = ['mp4', 'mov', 'wmv', 'avi', 'avchd', 'flv', 'f4v', 'swf', 'mkv']
    //Track history, used to redirect on error catch
    const history = useHistory();

    //Current page shown in the catalogue
    const [ currentPage, setCurrentPage ] = useState(1);
    //State variable for number of items shown per page
    const [ itemsPerPage ] = useState(15);
    //Last item index of current page
    const lastIndex = currentPage * itemsPerPage;
    //First item index of current page
    const firstIndex = lastIndex - itemsPerPage;
    //Items of the page being shown
    const currentItems = items.slice(firstIndex, lastIndex);
    //State array of the page numbers
    const [ pageNumbers, setPageNumbers ] = useState([]);


    //Show gallery on click of an item
    const openGallery = () => {
        setShowGallery(true);
    }

    //Fetch all media files of the selected collection
    async function fetchMediaFiles() {
        try {
            const collectionObj = await API.graphql(graphqlOperation(getCollection, {id: id}));
            setCollectionName(collectionObj.data.getCollection.name);
            const results = await API.graphql(graphqlOperation(listMediaFiles, { filter: { collection: { contains: collectionObj.data.getCollection.name } } }));
            setItems(results.data.listMediaFiles.items);
        } catch (e) {
            history.push('/collections')
        }
        
    };

    //Delete the collection from the item in DynamoDB, fetch media files again for dynamic refresh.
    async function deleteFromCollection(itemID) {
        try {
            const selectedItem = await API.graphql(graphqlOperation(getMediaFile, {id: itemID}));
            const collectionArr = selectedItem.data.getMediaFile.collection;
            var index = collectionArr.indexOf(collectionName);
            if (index !== -1) {
                collectionArr.splice(index, 1);
                await API.graphql(graphqlOperation(updateMediaFile, { input: { id: itemID, collection: collectionArr } }));
                fetchMediaFiles();
            }
        } catch (e) {
            console.log(e);
        }
    }

    //Add the number of pages required to show all items
    function pagination() {
        const numbers = [];
        for (let i = 1; i <= Math.ceil((items.length)/itemsPerPage); i++) {
            numbers.push(i);
        }
        setPageNumbers(numbers);
    }

    //Change the current page to the one selected
    function changePage(pageNumber) {
        setCurrentPage(pageNumber);
    }

    //componentDidMount() for functional component
    useEffect(() => {
        fetchMediaFiles();
    }, []);

    //Call back to pagination function to re-render the page buttons initially, refresh the pagebar if the maximum item displayed it reached,
    //or if no items are on the page. This accounts for deleting items.
    useEffect(() => {
        if (pageNumbers.length === 0) {
            pagination();
        }
        else if (currentItems.length === 0) {
            if (currentPage !== 1){
                changePage(currentPage - 1);
                pagination();
            }
        }
    }, [items]);

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
                        currentItems.map((item, i) => (
                            <a class='items' key={item.name} >
                                {
                                    (deleteMode ? <MdClose id='deleteCollectionItem' onClick={() => { deleteFromCollection(item.id); }} /> : null)
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
            <div class= 'pageBarContainerColItem'>
            <div class='pageBarColItem'>
                {
                    pageNumbers.map((number, i) => {
                        return (
                        <div class='pageBarBtnsColItem' key={i}>
                            <button class='pageNumberColItem' onClick={() => changePage(number)}>{number}</button>
                        </div>
                        )
                    })
                }
            </div>
        </div>
    </div> 
  );
}
