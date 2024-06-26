import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { MdClose } from 'react-icons/md';
import { listMediaFiles, getTag } from '../../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import Gallery from '../Modal/Gallery';
import { AmplifyS3Image } from '@aws-amplify/ui-react';
import { useAppContext } from '../services/context.js';
import DeleteConfirmationBox from '../Modal/DeleteConfirmationBox.js';
import './CategoryItem.css';
import { BsCameraVideo } from "react-icons/bs";
import { useHistory } from 'react-router-dom';

export default function CategoryItem() {
    //Get the URL parameter to set the original category name
    const { id } = useParams();
    //URL categoryName parameter
    const { categoryName } = useParams();
    //State variable to store category name from DynamoDB or for 'Uncategorised' page
    const [ catName, setCatName ] = useState('');
    //Context state array for items of a selected category lifted to App.js
    const { items, setItems, setCategories, setCollectionNames } = useAppContext();
    //State variable for showing the gallery
    const [ showGallery, setShowGallery ] = useState(false);
    //Use declared context variables to track delete mode
    const { deleteMode, setDeleteMode } = useAppContext();
    // Accepted video extensions
    const videoFormat = ['mp4', 'mov', 'wmv', 'avi', 'avchd', 'flv', 'f4v', 'swf', 'mkv']
    //State variable for showing a delete confirmation box when delete button is clicked
    const [ delConfirmation, setDelConfirmation ] = useState(false);
    //State variable of selected item for deletion
    const [ delItem, setDelItem ] = useState();
    //Track history, used to redirect on error catch
    const history = useHistory();
    //State variable of selected item
    const [ item, setItem ] = useState();

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

    //Fetch all media files without a tag/category
    async function getAllUncat() {
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
    
    //Fetch all media files favourited 
    async function getAllFavourites(){
        const favourites = [];
        const results = await API.graphql(graphqlOperation(listMediaFiles));
        if (results.data.listMediaFiles.items.length > 0) {
            results.data.listMediaFiles.items.map((item) => {
                if (item.favourite === true) {
                    favourites.push(item);
                }
            })
            setItems(favourites);
        }
    }

    //Fetch all photos only outside of array of video extensions
    async function getAllPhotos(){
        const photos = [];
        const results = await API.graphql(graphqlOperation(listMediaFiles));
        if (results.data.listMediaFiles.items.length > 0) {
            results.data.listMediaFiles.items.map((item) => {
                if (videoFormat.indexOf(item.name.split('.').pop()) < 0) {
                    photos.push(item);
                }
            })
            setItems(photos);
        }
    }

    //Fetch all videos only based on array of video extensions
    async function getAllVideos(){
        const videos = [];
        const results = await API.graphql(graphqlOperation(listMediaFiles));
        if (results.data.listMediaFiles.items.length > 0) {
            results.data.listMediaFiles.items.map((item) => {
                if (videoFormat.indexOf(item.name.split('.').pop()) > 0) {
                    videos.push(item);
                }
            })
            setItems(videos);
        }
    }

    //Fetch all media files of the selected category accounting for uncategorised items, favourites, photos only, and videos only pages.
    async function fetchMediaFiles() {
        if (categoryName === 'Uncategorised') {
            setCatName(categoryName);
            getAllUncat();
        }
        else if (categoryName === 'Favourites') {
            setCatName(categoryName);
            getAllFavourites();
        }
        else if (categoryName === 'Photos') {
            setCatName(categoryName);
            getAllPhotos();
        }
        else if (categoryName === 'Videos') {
            setCatName(categoryName);
            getAllVideos();
        }
        else {
            try {
                const categoryObj = await API.graphql(graphqlOperation(getTag, {id: id}));
                setCatName(categoryObj.data.getTag.categoryName);
                const results = await API.graphql(graphqlOperation(listMediaFiles, { filter: { tags: { contains: categoryObj.data.getTag.categoryName } } }));
                setItems(results.data.listMediaFiles.items);
            } catch (e) {
                history.push('/categories');
            }
        }
    };

    //Handler for showing delete cofirmation and setting the selected item to pass to confirmation box.
    function showDelConfirmation(selectedItem) {
        setDelItem(selectedItem);
        setDelConfirmation(true);
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

    //componentDidMount() for functional component, fetch media files on mount and format the category name.
    //Return deleteMode back to default false value.
    useEffect(() => {
        fetchMediaFiles();
        setDeleteMode(false);
        setCategories([]);
        setCollectionNames([]);
    }, []);

    //Call back to pagination function to re-render the page buttons initially, refresh the pagebar if the maximum item displayed it reached,
    //or if no items is on the page. This accounts for deleting items.
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
                            currentItems.map((item, i) => (
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
                    <div class= 'pageBarContainer'>
                        <div class='pageBar'>
                            {
                                pageNumbers.map((number, i) => {
                                    return (
                                        <div class='pageBarBtns' key={i}>
                                            <button class='pageNumber' onClick={() => changePage(number)}>{number}</button>
                                        </div>
                                    )
                                })
                            }
                        </div>
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
