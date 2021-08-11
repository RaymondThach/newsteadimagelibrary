import React, { useState } from 'react';
import './Collections.css';
import CreateCollection from '../Modal/CreateCollection';

import { Storage, API, graphqlOperation } from 'aws-amplify';
import awsExports from '../../aws-exports.js';
import { AmplifyS3Album } from '@aws-amplify/ui-react';



class Collections extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            check: false,
            test: ''

        };

    }



    /*
    s3CreateCollection(collectionName){
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



    modalState = { showing: true };

    
   



    

   


    




    render() {
        const { showing } = this.state;

        function processStorageList(result) {
            let files = []
            let folders = new Set()
            result.forEach(res => {
              if (res.size) {
                files.push(res)
                // sometimes files declare a folder with a / within then
                let possibleFolder = res.key.split('/').slice(0,-1).join('/')
                if (possibleFolder) folders.add(possibleFolder)
              } else {
                folders.add(res.key)
              }
            })
            console.log(folders)
            return {files, folders}
          }


          function listCollections(){

            Storage.list('Collections/')
            .then(result => processStorageList(result));

            
            
                
    
                
        }
        
        
        


        return (
           
            <div class="page">
                <div class="header">
                        <div class="header-center">Collections</div>
                        <div class="header-right" >
                            <div class ="create-button"onClick={listCollections}> + </div>

                        </div>
                    </div>

                    <div class="modal-overlay">
                        
                    {showing
                            ? <CreateCollection />
                            : null
                    }
                    <div class="main-content">
                    
                        <div class="gallery">
                            
                            


                            
                              
                            
                        </div>
                   
                    </div>
                </div>
            </div>
            

        )
    }

}




export default Collections