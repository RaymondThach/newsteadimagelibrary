import "./Collections.css";
import React, { useState, useEffect } from 'react';
import CreateCollection from "../Modal/CreateCollection";
import { API, graphqlOperation } from "aws-amplify";
import { FcFolder } from "react-icons/fc";
import { BsCameraVideo } from "react-icons/bs";
import { listCollections } from '../../graphql/queries';

export default function Collections() {
  const [showing, setShowing] = useState(false);
  const [collectionNames, setCollectionNames ] = useState([]);

  

  async function fetchCollection(){
    const results = await API.graphql(graphqlOperation(listCollections));
    setCollectionNames(results.data.listCollections.items)
  }

  //componentDidMount() for functional component
  useEffect(() => {
    fetchCollection();
  }, []);

  return (
    <div class="page">
      <div class="header">
        <h1>
          Collection
        </h1>
        <div class="header-right" >
            <div class="create-button" onClick={() => {setShowing(!showing)}}> + </div>
        </div>
        <div class="modal-overlay">
          {showing
              ? <CreateCollection setShowing={setShowing}/>
              : null
          }
          <div class="categories">
          {
            collectionNames.map((listname, i) => (
            <a href={'/collections/'+ listname.name.replace(/[ ]/g, '-')} class="items" key={listname.name}>
              <FcFolder size={100} />
              {listname.name}
            </a>
            ))
          }
          </div>
        </div>
      </div>
    </div>
  );
}          

