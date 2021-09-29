import './Categories.css';
//import Gallery from './gallery/Gallery'
import React, { useState, useEffect } from 'react';
import './Categories.css';
import { API, graphqlOperation } from 'aws-amplify';
import CreateCategory from '../Modal/CreateCategory';
import { listTags } from '../../graphql/queries';

export default function Categories() {
  const [showing, setShowing] = useState(false);
  const [categoryNames, setCategoryNames ] = useState([]);

  async function fetchCategories(){
    const results = await API.graphql(graphqlOperation(listTags));
    setCategoryNames(results.data.listTags.items)
  }

  //componentDidMount() for functional component
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div class="page">
      <div class="header">
        <h1>
          Categories
        </h1>
        <div class="header-right" >
            <div class="create-button" onClick={() => {setShowing(!showing)}}> + </div>
        </div>
        <div class="modal-overlay">
          {showing
              ? <CreateCategory setShowing={setShowing}/>
              : null
          }
          <div class="categories">
          {
            categoryNames.map((listname, i) => (
            <a href={'/categories/'+ listname.categoryName.replace(/[ ]/g, '-')} class="items" key={listname.categoryName}>
              {listname.categoryName}
            </a>
            ))
          }
          </div>
        </div>
      </div>
    </div>
  );
}          