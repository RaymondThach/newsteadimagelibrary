import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'; 
import { listMediaFiles } from '../../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';

export default function CategoryItem() {
    const { categoryName } = useParams();
    const [ items, setItems ] = useState([]); 

    async function fetchMediaFiles() {
        const results = await API.graphql(graphqlOperation(listMediaFiles, {filter: {tags: {contains: categoryName}}}));
        setItems(results.data.listMediaFiles.items);
    };

    //componentDidMount() for functional component
    useEffect(() => {
        console.log('thisonlyprintsonce');
        fetchMediaFiles();
    }, []);

    return (
        <div class="page">
            <div class="header">
                <h1>
                    {categoryName}
                </h1>
                <div class="gallery">
                {
                    items.map((item, i) => (
                    <a class="items" key={item.name}>
                    {item.name}
                    </a>
                    ))
                }
                </div>
            </div>
        </div>   
    );
  }      