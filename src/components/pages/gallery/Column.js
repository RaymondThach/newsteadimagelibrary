import React from 'react'
import ImgFrame from './ImgFrame'
import '../Categories.css';

function Column({ images }) {
  return (
    <div className="column">
      {images.map((img, i) => {
        return <ImgFrame key={i} src={img.src} h={img.height} album={img.album} desc={img.desc} pname={img.pname}/>
      })}
    </div>
  )
}

export default Column