import React from 'react';
import './Collections.css';

import {Storage, API, graphqlOperation } from 'aws-amplify';
import awsExports from '../../aws-exports.js';
import { AmplifyS3Album } from '@aws-amplify/ui-react';

class Collections extends React.Component {

    /* Scraping this, code below creates a subfolder in s3 bucket. Will utitlize dynamodb for this functionality
    createCollection(collectionName){
        collectionName = collectionName.trim();
        // Add some constraints here e.g. name cant contain special characters

        var collectionKey = encodeURIComponent(collectionName);
        Storage.headObject({key: collectionKey}, function(err, data){
            if(!err){
                return alert("Collection Already Exists: "+ err.message);
            }
            if (err.code !== "NotFound"){
                return alert("There was an error creating this collection: " + err.message);
            }
            Storage.putObject({key: collectionKey}, function(err, data){
                if (err){
                    return alert ("There was an error creating this colllection: " + err.message);
                }
                alert("Successfully created collection.")
                
            });
        });
    }*/
    render(){

        return(
            <div className ="main_content">
                <div class = "header"> 
                   <div class ="header-center">Collections</div>
                   <div class = "header-right" >
                        <div class ="create-button"onClick={()=>{alert('clicked')}}> + </div>
                    </div>

                </div>
                
            </div>
        )
    }
    
}


   

export default Collections