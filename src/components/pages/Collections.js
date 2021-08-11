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
            <div class ="title">
                   <div class ="header-center">Collections</div>
                   <div class = "header-right" >
                        <div class ="create-button"onClick={()=>{alert('clicked')}}> + </div>
                        </div>   
                    <div className="main_content">
            <div class= "responsive">
                <div class="gallery">

                    <a target= "_blank" href= "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg">
                        <img src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg" alt="BG" width="300" height="200">
                    </img> 
                    </a>
                    <div class="desc">Testing</div>

                    <a target ="_blank" href="https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGhvdG98ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80">
                        <img src="https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGhvdG98ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80" alt="tester" width="300" height="200">
                        </img>
                    </a>
                    <div class="Desc">tester</div>
                </div>
            </div>
            </div>
            </div>

 
                
        )
    }
    
}
//

   

export default Collections