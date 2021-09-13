import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'; 
import { listMediaFiles } from '../../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import Gallery from '../Modal/Gallery';
//import { AmplifyS3Image } from '@aws-amplify/ui-react';
import './CategoryItem.css';


export default function CategoryItem() {
    const { categoryName } = useParams();
    const [ catName, setCatName] = useState('');
    const [ items, setItems ] = useState([]); 
    const [ item, setItem ] = useState();

    const [showGallery, setShowGallery] = useState(false);
    

    const openGallery = () => {
        setShowGallery(true);
    }

    async function fetchMediaFiles() {
        const results = await API.graphql(graphqlOperation(listMediaFiles, {filter: {tags: {contains: (categoryName.replace(/-/g, ' '))}}}));
        setItems(results.data.listMediaFiles.items);
    };

    //componentDidMount() for functional component
    useEffect(() => {
        setCatName(categoryName.replace(/-/g, ' '));
        fetchMediaFiles();
    }, []); 

    return (
        <div class="page">
            <div class="header">
                <h1>
                    {catName}
                </h1> 
            </div>
            <div class="main-content">
                    <div class="categoryItems">
                    {
                        items.map((item, i) => (
                        <a class="items" key={item.name} onClick={() => { openGallery(); setItem(item); }}>
                        {item.name}
                        </a>
                        ))
                    }   
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