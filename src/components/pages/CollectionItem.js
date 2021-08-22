import { Storage, API, graphq, graphqlOperation } from 'aws-amplify';
import awsExports from '../../aws-exports.js';
import { AmplifyS3Album, AmplifyS3Image } from '@aws-amplify/ui-react';
import React from 'react';
import Collections from './Collections.js';

class CollectionItem extends React.Component{
    //<AmplifyS3Image imgKey={'Collections/'+this.foldername+'/images.png'} />

    constructor(props) {
        super(props);
        this.state = {
           

        };

    }

    foldername = this.props.match.params.name.replace('-',' ',)

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
    

    async listItems (foldername){
        console.log('CollectionItem.js ListItems')

        const results = await API.graphql(graphqlOperation(this.fetchNames))
        this.setState({ list: results.data.listCollections.items })
    }


   
    fetchKeys(){
        let list = []
        Storage.list('Collections/Test Collection/' )
        .then((results)=>{
            console.log(results)
            list = results
        })

        console.log('test ' + list)
        
    }
     
       
    componentDidMount(){
        this.fetchKeys();



    }



    
    render(){

        
        

        return(
            <div class= 'page'>
            <div class = 'main-content'>
            <div class='gallery'> 
                {
                   
                    
                
                }
            </div>
            </div>
           
         
        
            </div>
        )
    }
}
export default CollectionItem;