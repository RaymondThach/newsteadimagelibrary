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
           list:[]

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



   
    fetchKeys(){
        
        Storage.list('Collections/'+this.foldername)
        .then((results)=>{
            console.log('test fetch keys')
            this.setState({ list: results})
        })

        console.log(this.state.list)

        
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
                   
                    
                   this.state.list.map((listname, i) => (

        
                    <div>
                        <AmplifyS3Image imgKey={listname.key} key={listname.key}/>
                    </div>
                    
                        
                    
                    

                    


                ))
                
                }
            </div>
            </div>
           
         
        
            </div>
        )
    }
}
export default CollectionItem;