import './Categories.css';
//import Gallery from './gallery/Gallery'
import React, { useState, useEffect } from 'react';
import './Categories.css';
import { API, graphqlOperation } from 'aws-amplify';
import CreateCategory from '../Modal/CreateCategory';
import { listTags } from '../../graphql/queries';

export default function Categories() {
  const [showing, setShowing] = useState(false);
  const [categoryNames, setCategoryNames ] = useState([]);

  async function fetchCategories(){
    const results = await API.graphql(graphqlOperation(listTags));
    setCategoryNames(results.data.listTags.items)
  }

  //componentDidMount() for functional component
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div class="page">
      <div class="header">
        <h1>
          Categories
        </h1>
        <div class="header-right" >
            <div class="create-button" onClick={() => {setShowing(!showing)}}> + </div>
        </div>
        <div class="modal-overlay">
          {showing
              ? <CreateCategory/>
              : null
          }
          <div class="categories">
          {
            categoryNames.map((listname, i) => (
            <a href={'/categories/'+ listname.categoryName.replace(/[ ]/g, '-')} class="items" key={listname.categoryName}>
              {listname.categoryName}
            </a>
            ))
          }
          </div>
        </div>
      </div>
    </div>
  );
}          

//     const getData = () => {
//         let data = [
//           {
//       src: `https://source.unsplash.com/random/500x500?sig=${Math.floor(Math.random() * 999)}`,
//       height: 500,
//       album: 'Album1',
//       pname:'Photo Name 1',
//       desc:'This is a really good description #1'
//     }, {
//       src: `https://source.unsplash.com/random/500x500?sig=${Math.floor(Math.random() * 999)}`,
//       height: 500,
//       album: 'Album2',
//       pname:'Photo Name 2',
//       desc:'This is a really good description #2'
//     }, {
//       src: `https://source.unsplash.com/random/500x500?sig=${Math.floor(Math.random() * 999)}`,
//       height: 500,
//       album: 'Album3',
//       pname:'Photo Name 3',
//       desc:'This is a really good description #3'
//     }, {
//       src: `https://source.unsplash.com/random/500x500?sig=${Math.floor(Math.random() * 999)}`,
//       height: 500,
//       album: 'Album4',
//       pname:'Photo Name 4',
//       desc:'This is a really good description #4'
//     }, {
//       src: `https://source.unsplash.com/random/500x500?sig=${Math.floor(Math.random() * 999)}`,
//       height: 500,
//       album: 'Album5',
//       pname:'Photo Name 5',
//       desc:'This is a really good description #5'
//     }, {
//       src: `https://source.unsplash.com/random/500x500?sig=${Math.floor(Math.random() * 999)}`,
//       height: 500,
//       album: 'Album6',
//       pname:'Photo Name 6',
//       desc:'This is a really good description #6'
//     }, {
//       src: `https://source.unsplash.com/random/500x500?sig=${Math.floor(Math.random() * 999)}`,
//       height: 500,
//       pname:'Photo Name 7',
//       desc:'This is a really good description #7'
//     }
//         ]
//         return data;
//       }

// let images = getData();

// class Categories extends React.Component {
//     render() {
//         return (
//             <div>
//               <h1>Hello World - this is the categories page<br></br></h1>
//                 <b1>Below you will find created categories. Please click on one to reveal the whole category.<br></br></b1>
                
//                 <div class="cats">
//                 <Gallery imgarr={images} />
//                 </div>
//             </div>

//         )
//     }
// }
// export default Categories;