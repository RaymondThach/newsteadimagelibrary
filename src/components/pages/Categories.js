import './Categories.css';
import Gallery from './gallery/Gallery'
import React, { useState } from 'react';
import './LoginPage.css';
import { API, graphqlOperation } from 'aws-amplify';
import CreateCategory from '../Modal/CreateCollection';

// class Categories extends React.Component {

//   constructor(props) {
//       super(props);
//       this.state = {
//           list: []

//       };

//   }
//   modalState = { showing: true };

//   //query to grab just the name in the collection
//   fetchNames = /* GraphQL */ `
// query ListCollections {
//   listCollections {
//       items {
//         name
//       }
//     }
//   }
// `;




//   // Fetch collection names from DB and store into local array

//   async fetchCollections() {
//       console.log('test')

//       const results = await API.graphql(graphqlOperation(this.fetchNames))
//       this.setState({ list: results.data.listCollections.items })


//   }

   
//   componentDidMount(){
      
//       this.fetchCollections();


//   }


//   render() {
//       const { showing } = this.state;

//       return (

//           <div class="page">
//               <div class="header">
//                   <div class="header-center">Categories</div>
//                   <div class="header-right" >
//                       <div class="create-button" onClick={() => this.setState({ showing: !showing })}> + </div>

//                   </div>
//               </div>

//               <div class="modal-overlay">

//                   {showing
//                       ? <CreateCategory />
//                       : null
//                   }
//                   <div class="main-content">
//                       <div class="gallery">

//                           {


//                               this.state.list.map((listname, i) => (

//                                   <div class="items">
                                      
//                                       {listname.name}
//                                   </div>
                                  

                                  


//                               ))

//                           }
//                       </div>



//                   </div>
//               </div>
//           </div>


//       )
//   }

// }

    const getData = () => {
        let data = [
          {
      src: `https://source.unsplash.com/random/500x500?sig=${Math.floor(Math.random() * 999)}`,
      height: 500,
      album: 'Album1',
      pname:'Photo Name 1',
      desc:'This is a really good description #1'
    }, {
      src: `https://source.unsplash.com/random/500x500?sig=${Math.floor(Math.random() * 999)}`,
      height: 500,
      album: 'Album2',
      pname:'Photo Name 2',
      desc:'This is a really good description #2'
    }, {
      src: `https://source.unsplash.com/random/500x500?sig=${Math.floor(Math.random() * 999)}`,
      height: 500,
      album: 'Album3',
      pname:'Photo Name 3',
      desc:'This is a really good description #3'
    }, {
      src: `https://source.unsplash.com/random/500x500?sig=${Math.floor(Math.random() * 999)}`,
      height: 500,
      album: 'Album4',
      pname:'Photo Name 4',
      desc:'This is a really good description #4'
    }, {
      src: `https://source.unsplash.com/random/500x500?sig=${Math.floor(Math.random() * 999)}`,
      height: 500,
      album: 'Album5',
      pname:'Photo Name 5',
      desc:'This is a really good description #5'
    }, {
      src: `https://source.unsplash.com/random/500x500?sig=${Math.floor(Math.random() * 999)}`,
      height: 500,
      album: 'Album6',
      pname:'Photo Name 6',
      desc:'This is a really good description #6'
    }, {
      src: `https://source.unsplash.com/random/500x500?sig=${Math.floor(Math.random() * 999)}`,
      height: 500,
      pname:'Photo Name 7',
      desc:'This is a really good description #7'
    }
        ]
        return data;
      }

let images = getData();

class Categories extends React.Component {
    render() {
        return (
            <div>
              <h1>Hello World - this is the categories page<br></br></h1>
                <b1>Below you will find created categories. Please click on one to reveal the whole category.<br></br></b1>
                
                <div class="cats">
                <Gallery imgarr={images} />
                </div>
            </div>

        )
    }
}
export default Categories;