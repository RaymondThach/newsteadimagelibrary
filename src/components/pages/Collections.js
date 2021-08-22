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



    modalState = { showing: false };

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

   
     
    componentDidMount(){
        
        this.fetchCollections();


    }


    render() {
        const { showing } = this.state;

       

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

        

                                    <a href={'/collections/'+ listname.name.replace(/[ ]/g, '-')}class="items">
                                        <FcFolder size = {100}/>
                                        {listname.name}
                                    </a>
                                    

                                    


                                ))

                            }
                        </div>



                    </div>
                </div>
            </div>


        )
    }

}
//



export default Collections