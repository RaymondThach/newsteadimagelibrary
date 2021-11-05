import "./Collections.css";
import React, { useState, useEffect } from 'react';
import CreateCollection from "../Modal/CreateCollection";
import { API, graphqlOperation } from "aws-amplify";
import { FcFolder } from "react-icons/fc";
import { listCollections } from '../../graphql/queries';
import { listMediaFiles } from '../../graphql/queries';
import { useAppContext } from '../services/context.js';
import { AmplifyS3Image } from '@aws-amplify/ui-react';
import { MdClose } from 'react-icons/md';
import DeleteCollectionConfirmation from "../Modal/DeleteCollectionConfirmation";

export default function Collections() {
  //State variable for showing or hiding the modal for creating collection
  const [showing, setShowing] = useState(false);

  //Context state array for all collections
  const { collectionNames, setCollectionNames, setCategories, setItems } = useAppContext();
  
  //Use declared context variables to track delete mode
  const { deleteMode, setDeleteMode } = useAppContext();

  //Array of accepted video formats
  const videoFormat = ['mp4', 'mov', 'wmv', 'avi', 'avchd', 'flv', 'f4v', 'swf', 'mkv']

  //State variable for showing a delete confirmation box when delete button is clicked
  const [ delConfirmation, setDelConfirmation ] = useState(false);

  //State variable for choosing which collection to delete
  const [ delCollection, setDelCollection ] = useState();

  //Current page shown in the catalogue
  const [ currentPage, setCurrentPage ] = useState(1);
  //State variable for number of items shown per page
  const [ itemsPerPage ] = useState(15);
  //Last item index of current page
  const lastIndex = currentPage * itemsPerPage;
  //First item index of current page
  const firstIndex = lastIndex - itemsPerPage;
  //Items of the page being shown
  const currentCollections = collectionNames.slice(firstIndex, lastIndex);
  //State array of the page numbers
  const [ pageNumbers, setPageNumbers ] = useState([]);
  
 
  //Populate the collections array 'collectionNames'
  async function fetchCollection(){
    const collectionsArr = [];
    const results = await API.graphql(graphqlOperation(listCollections));
    const randPhotos = fetchRandPhoto(results);
    Promise.all(randPhotos).then(values => {
      values.map(value => {
        collectionsArr.push(value);
      });
      setCollectionNames(collectionsArr);
    });
  }

  //Fetch photos for each collection and select a random one to represent that collection
  //Return the modified object with the random photo's name attached. Return null for randPhoto if video is randomly chosen.
  function fetchRandPhoto(results){
    const array = results.data.listCollections.items.map(async (collectionObj) => {
      const collectionObjects = await API.graphql(graphqlOperation(listMediaFiles, { filter: { collection: { contains: (collectionObj.name) } } }));
      const randCollectionObject = collectionObjects.data.listMediaFiles.items[Math.floor(Math.random()*collectionObjects.data.listMediaFiles.items.length)];
      if (randCollectionObject && videoFormat.indexOf(randCollectionObject.name.split('.').pop()) < 0) {
        return {
          id: collectionObj.id,
          name: collectionObj.name,
          createdAt: collectionObj.createdAt,
          updatedAt: collectionObj.updatedAt,
          randPhoto: randCollectionObject.name
        }
      }
      else {
        return {
          id: collectionObj.id,
          name: collectionObj.name,
          createdAt: collectionObj.createdAt,
          updatedAt: collectionObj.updatedAt,
          randPhoto: null
        }
      }
    })
    return array;
  }

  //Show DeletConfirmationBox modal if delConfirmation state is true, pass through the selected collection to delete
  function showDelConfirmation(collection) {
    setDelCollection(collection);
    setDelConfirmation(true);
  }

  //Add the number of pages required to show all items
  function pagination() {
    const numbers = [];
    for (let i = 1; i <= Math.ceil((collectionNames.length)/itemsPerPage); i++) {
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
    fetchCollection();
    setDeleteMode(false);
    setCategories([]);
    setItems([]);
  }, []);

  //Call back to pagination function to re-render the page buttons initially, refresh the pagebar if the maximum item displayed it reached,
  //or if no items are on the page. This accounts for deleting and creating collections.
  useEffect(() => {
    if (pageNumbers.length === 0) {
      pagination();
    }
    else if (currentCollections.length === 15){
      pagination();
    }
    else if (currentCollections.length === 0) {
      if (currentPage !== 1){
        changePage(currentPage - 1);
        pagination();
      }
    }
  }, [collectionNames]);

  return (
    <div class='page'>
      <div class='header'>
        <h1 class='title'>
          Collections
        </h1>
        <div class='header-menu'>
          <div class='create-button' onClick={() => {setShowing(!showing)}}> + </div>
        </div>
        <div class='collectionGrid'>
          <div class='collections'>
          {
            currentCollections.map((listname, i) => (
            <div class='items' key={listname.name}>
              {
                (deleteMode ? <MdClose id='deleteCat' onClick={() => { showDelConfirmation(listname); }} /> : null)
              }
              <a href={'/collections/'+ listname.name.replace(/[ ]/g, '-') + '/' + listname.id} class="item" key={listname.name}>
                <div class='collection-tn'>
                  {
                     (listname.randPhoto !== null ? <AmplifyS3Image imgKey={listname.randPhoto} /> : <FcFolder class='defaultImgIcon'/>)
                     
                  }
                </div>
                {listname.name}
              </a>
            </div>
            ))
          }
          </div>
          {
            (delConfirmation ? <DeleteCollectionConfirmation delCollection={delCollection} setDelConfirmation={setDelConfirmation} fetchCollection={fetchCollection} /> : null)
          }
          {showing
            ? <CreateCollection class='createCollection' setShowing={setShowing} fetchCollection={fetchCollection} pagination={pagination}/>
            : null
          }
        </div>
      </div>
      <div class= 'pageBarContainerCol'>
          <div class='pageBarCol'>
              {
                pageNumbers.map((number, i) => {
                    return (
                      <div class='pageBarBtnsCol' key={i}>
                          <button class='pageNumberCol' onClick={() => changePage(number)}>{number}</button>
                      </div>
                    )
                })
              }
          </div>
      </div>
    </div>
  );
} 