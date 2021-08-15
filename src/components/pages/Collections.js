import React, { useState } from 'react';
import './Collections.css';
import CreateCollection from '../Modal/CreateCollection';

import { Storage, API, graphq, graphqlOperation } from 'aws-amplify';
import awsExports from '../../aws-exports.js';
import { AmplifyS3Album, AmplifyS3Image } from '@aws-amplify/ui-react';
import { listCollections } from '../../graphql/queries.js';
import { FcFolder } from "react-icons/fc";
//import { S3Image } from 'aws-amplify-react-native';


class Collections extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            list: []

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

    //query to grab just the name in the collection
    fetchNames = /* GraphQL */ `
  query ListCollections {
    listCollections {
        items {
          name
        }
      }
    }
`;




    // Fetch collection names from DB and store into local array

    async fetchCollections() {
        console.log('test')

        const results = await API.graphql(graphqlOperation(this.fetchNames))
        this.setState({ list: results.data.listCollections.items })


    }


    render() {
        const { showing } = this.state;

        //fetch current collections
        this.fetchCollections();

        /* Grabs a list of files\folders from s3

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
            console.log(files)
            return {files, folders}
          }


          function listCollections(){
            let files = []
            let folders = new Set()

            Storage.list('Collections/')
            .then(result => processStorageList(result));
            console.log(files);
     
        }*/




        return (

            <div class="page">
                <div class="header">
                    <div class="header-center">Collections</div>
                    <div class="header-right" >
                        <div class="create-button" onClick={() => this.setState({ showing: !showing })}> + </div>

                    </div>
                </div>

                <div class="modal-overlay">

                    {showing
                        ? <CreateCollection />
                        : null
                    }
                    <div class="main-content">
                        <div class="gallery">

                            {


                                this.state.list.map((listname, i) => (

                                    <div class="items">
                                        <FcFolder size = {100}/>
                                        {listname.name}
                                    </div>
                                    

                                    


                                ))

                            }
                        </div>



                    </div>
                </div>
            </div>


        )
    }

}




export default Collections