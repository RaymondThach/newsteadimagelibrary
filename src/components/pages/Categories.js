import './Categories.css';
import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import CreateCategory from '../Modal/CreateCategory';
import { listTags } from '../../graphql/queries';
import { listMediaFiles } from '../../graphql/queries';
import { AmplifyS3Image } from '@aws-amplify/ui-react';
import { HiOutlinePhotograph } from "react-icons/hi";

export default function Categories() {
  //State variable for showing the create category modal
  const [ showing, setShowing ] = useState(false);

  //State array for storing all categories and their random photo
  const [ categories, setCategories ] = useState([]);

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
  //Return the modified object with the random photo's name attached.  WHAT HAPPENS WHEN A VIDEO IS SELECTED?????????????????????????????????????????????????????????????????????
  function fetchRandPhoto(results){
    const array = results.data.listTags.items.map(async (catObj) => {
      const categoryObjects = await API.graphql(graphqlOperation(listMediaFiles, { filter: { tags: { contains: (catObj.categoryName.replace(/-/g, ' ')) } } }));
      const randCategoryObject = categoryObjects.data.listMediaFiles.items[Math.floor(Math.random()*categoryObjects.data.listMediaFiles.items.length)];
      if (randCategoryObject){
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

  //componentDidMount() for functional component
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div class='page'>
      <div class='header'>
        <h1 class='title'>
          Categories
        </h1>
        <div class='header-menu'>
          <a href={'/categories/Uncategorised' } class='uncategorisedBtn'>Uncategorised</a>
          <div class='create-button' onClick={() => {setShowing(!showing)}}> + </div>
        </div>
        <div class='categoryGrid'>
          {showing
              ? <CreateCategory setShowing={setShowing}/>
              : null
          }
          <div class='categories'>
          {
            categories.map((listname, i) => (
            <a href={'/categories/'+ listname.categoryName.replace(/[ ]/g, '-')} class='items' key={listname.categoryName}>
              <div class='item'>
                <div class='cat_tn'>
                  {
                    (listname.randPhoto !== null ? <AmplifyS3Image imgKey={listname.randPhoto} /> : <HiOutlinePhotograph class='defaultImgIcon'/>)
                  }
                </div>
                {listname.categoryName}
              </div>
            </a>
            ))
          }
          </div>
        </div>
      </div>
    </div>
  );
}          