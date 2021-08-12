import React from 'react';
import './Categories.css';
import Gallery from './gallery/Gallery'


var CatNumber = 5;
let CatName = ['beer', 'chair', 'computer', 'house', 'phone']
let CatPhoto = ["https://cdn.iconscout.com/icon/free/png-256/beer-mug-glass-drink-cocktail-emoj-symbol-babr-30679.png",
    "https://i.pinimg.com/600x315/b2/78/8b/b2788b326be16a5dc09dc9d255825e5f.jpg",
    "https://cdn.iconscout.com/icon/free/png-256/computer-1751683-1489579.png",
    "https://cdn.iconscout.com/icon/free/png-256/house-1495589-1267760.png",
    "https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/256x256/plain/mobile_phone.png"]


    const getData = () => {
        let data = [
          {
            src: `https://source.unsplash.com/random/500x500?sig=${Math.floor(Math.random() * 999)}`,
            height: 500,
            author: 'Awesome'
          }, {
            src: `https://source.unsplash.com/random/500x400?sig=${Math.floor(Math.random() * 999)}`,
            height: 400,
            author: 'Awesome'
          }, {
            src: `https://source.unsplash.com/random/500x700?sig=${Math.floor(Math.random() * 999)}`,
            height: 700,
            author: 'Awesome'
          }, {
            src: `https://source.unsplash.com/random/500x250?sig=${Math.floor(Math.random() * 999)}`,
            height: 250,
            author: 'Awesome'
          }, {
            src: `https://source.unsplash.com/random/500x800?sig=${Math.floor(Math.random() * 999)}`,
            height: 800,
            author: 'Awesome'
          }, {
            src: `https://source.unsplash.com/random/500x500?sig=${Math.floor(Math.random() * 999)}`,
            height: 500,
            author: 'Awesome'
          }, {
            src: `https://source.unsplash.com/random/500x400?sig=${Math.floor(Math.random() * 999)}`,
            height: 400,
            author: 'Awesome'
          }, {
            src: `https://source.unsplash.com/random/500x700?sig=${Math.floor(Math.random() * 999)}`,
            height: 700,
            author: 'Awesome'
          }, {
            src: `https://source.unsplash.com/random/500x250?sig=${Math.floor(Math.random() * 999)}`,
            height: 250,
            author: 'Awesome'
          }, {
            src: `https://source.unsplash.com/random/500x800?sig=${Math.floor(Math.random() * 999)}`,
            height: 800,
            author: 'Awesome'
          }, {
            src: `https://source.unsplash.com/random/500x400?sig=${Math.floor(Math.random() * 999)}`,
            height: 400,
            author: 'Awesome'
          }, {
            src: `https://source.unsplash.com/random/500x700?sig=${Math.floor(Math.random() * 999)}`,
            height: 700,
            author: 'Awesome'
          }, {
            src: `https://source.unsplash.com/random/500x250?sig=${Math.floor(Math.random() * 999)}`,
            height: 250,
            author: 'Awesome'
          }, {
            src: `https://source.unsplash.com/random/500x800?sig=${Math.floor(Math.random() * 999)}`,
            height: 800,
            author: 'Awesome'
          }
        ]
        return data;
      }

let images = getData();


class Categories extends React.Component {
    render() {
        return (
            <div>Hello World - this is the categories page<br></br>
                <b1>Below you will find created categories. Please click on one to reveal the whole category.</b1>
                <br></br><br></br>
                <div class="cats">
                <Gallery imgarr={images} />
                </div>
            </div>

        )
    }
}
export default Categories;