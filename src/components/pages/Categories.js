import './Categories.css';
import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import CreateCategory from '../Modal/CreateCategory';
import { listTags } from '../../graphql/queries';
import { listMediaFiles } from '../../graphql/queries';
import { AmplifyS3Image } from '@aws-amplify/ui-react';
import { HiOutlinePhotograph } from "react-icons/hi";
import { MdClose } from 'react-icons/md';
import DeleteConfirmationBox from '../Modal/DeleteConfirmationBox.js';
import { useAppContext } from '../services/context.js';

export default function Categories() {
  //State variable for showing the create category modal
  const [ showing, setShowing ] = useState(false);

  //Context State array for storing all categories and their random photo, lifted to App.js level
  const { categories, setCategories, setCollectionNames, setItems } = useAppContext();

  //Use declared context variables to track delete mode
  const { deleteMode, setDeleteMode } = useAppContext();

  //Array of accepted video formats
  const videoFormat = ['mp4', 'mov', 'wmv', 'avi', 'avchd', 'flv', 'f4v', 'swf', 'mkv']

  //State variable for showing a delete confirmation box when delete button is clicked
  const [ delConfirmation, setDelConfirmation ] = useState(false);

  //State variable for choosing which category to delete
  const [ delCategory, setDelCategory ] = useState();

  //Current page shown in the catalogue
  const [ currentPage, setCurrentPage ] = useState(1);
  //State variable for number of items shown per page
  const [ itemsPerPage ] = useState(15);
  //Last item index of current page
  const lastIndex = currentPage * itemsPerPage;
  //First item index of current page
  const firstIndex = lastIndex - itemsPerPage;
  //Items of the page being shown
  const currentCategories = categories.slice(firstIndex, lastIndex);
  //State array of the page numbers
  const [ pageNumbers, setPageNumbers ] = useState([]);

  //Fetch all categories from DynamoDB tags table, then select a random photo of each category
  //Get photo names from Promise results
  async function fetchCategories(){
    const categoriesArr = [];
    const results = await API.graphql(graphqlOperation(listTags));
    const randPhotos = fetchRandPhoto(results);
    Promise.all(randPhotos).then(values => {
      values.map(value => {
        categoriesArr.push(value);
      });
      setCategories(categoriesArr);
    });
  }

  //Fetch photos for each category and select a random one to represent that category
  //Return the modified object with the random photo's name attached. Return null for randPhoto if video is randomly chosen.
  function fetchRandPhoto(results){
    const array = results.data.listTags.items.map(async (catObj) => {
      const categoryObjects = await API.graphql(graphqlOperation(listMediaFiles, { filter: { tags: { contains: (catObj.categoryName) } } }));
      const randCategoryObject = categoryObjects.data.listMediaFiles.items[Math.floor(Math.random()*categoryObjects.data.listMediaFiles.items.length)];
      if (randCategoryObject && videoFormat.indexOf(randCategoryObject.name.split('.').pop()) < 0) {
        return {
          id: catObj.id,
          categoryName: catObj.categoryName,
          createdAt: catObj.createdAt,
          updatedAt: catObj.updatedAt,
          randPhoto: randCategoryObject.name
        }
      }
      else {
        return {
          id: catObj.id,
          categoryName: catObj.categoryName,
          createdAt: catObj.createdAt,
          updatedAt: catObj.updatedAt,
          randPhoto: null
        }
      }
    })
    return array;
  }

  //Show DeletConfirmationBox modal if delConfirmation state is true, pass through the selected category to delete
  function showDelConfirmation(category) {
    setDelCategory(category);
    setDelConfirmation(true);
  }

  //Add the number of pages required to show all items
  function pagination() {
    const numbers = [];
    for (let i = 1; i <= Math.ceil((categories.length)/itemsPerPage); i++) {
        numbers.push(i);
    }
    setPageNumbers(numbers);
  }

  //Change the current page to the one selected
  function changePage(pageNumber) {
    setCurrentPage(pageNumber);
  }

  //componentDidMount() for functional component, populate page and return deleteMode to default
  useEffect(() => {
    fetchCategories();
    setDeleteMode(false);
    setCollectionNames([]);
    setItems([]);
  }, []);

  //Call back to pagination function to re-render the page buttons initially, refresh the pagebar if the maximum item displayed it reached,
  //or if no items are on the page. This accounts for deleting and creating categories.
  useEffect(() => {
    if (pageNumbers.length === 0) {
      pagination();
    }
    else if (currentCategories.length === 15){
      pagination();
    }
    else if (currentCategories.length === 0) {
      if (currentPage !== 1){
        changePage(currentPage - 1);
        pagination();
      }
    }
  }, [categories]);

  return (
    <div class='page'>
      <div class='header'>
        <h1 class='title'>
          Categories
        </h1>
        <div class='header-menu'>
          <a href={'/categories/Photos/allPhotos' } class='photosBtn'>Photos</a>    
          <a href={'/categories/Videos/allVideos' } class='videosBtn'>Videos</a>    
          <a href={'/categories/Uncategorised/uncategorised' } class='uncategorisedBtn'>Uncategorised</a>
          <a href={'/categories/Favourites/favourites' } class='favouritesBtn'>Favourites</a>          
          <div class='createCatBtn' onClick={() => {setShowing(!showing)}}> + </div>
        </div>
        <div class='categoryGrid'>
          <div class='categories'>
          {
            currentCategories.map((listname, i) => (
            <div class='items' key={listname.categoryName}>
              {
                (deleteMode ? <MdClose id='deleteCat' onClick={() => { showDelConfirmation(listname); }} /> : null)
              }
              <a class='item' href={'/categories/'+ encodeURIComponent(listname.categoryName.replace(/[ ]/g, '-')) + '/' + listname.id}>
                <div class='cat_tn'>
                  {
                    (listname.randPhoto !== null ? <AmplifyS3Image imgKey={listname.randPhoto} /> : <HiOutlinePhotograph id='defaultIcon' class='defaultImgIcon'/>)
                  }
                </div>
                {listname.categoryName}
              </a>
            </div>
            ))
          }
          </div>
          {
            (delConfirmation ? <DeleteConfirmationBox delCategory={delCategory} setDelConfirmation={setDelConfirmation} fetchCategories={fetchCategories} pagination={pagination}/> : null)
          }
          {showing
            ? <CreateCategory class='createCat' setShowing={setShowing} fetchCategories={fetchCategories} pagination={pagination}/>
            : null
          }
        </div>
      </div>
      <div class= 'pageBarContainerCat'>
          <div class='pageBarCat'>
              {
                  pageNumbers.map((number, i) => {
                      return (
                        <div class='pageBarBtnsCat' key={i}>
                            <button class='pageNumberCat' onClick={() => changePage(number)}>{number}</button>
                        </div>
                      )
                  })
              }
          </div>
      </div>
    </div>
  );
}          