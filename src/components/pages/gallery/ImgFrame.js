import React, { useState } from 'react'
import '../Categories.css';


function ImgFrame({ src, h, desc, pname }) {
  const [show, setShow] = useState(0);

  return (
    <div className={"imgframe " + (show ? 'pop' : '')} style={{ height: h }}>
    <img className={show ? "mainimgpop" : "mainimg"} src={src} height={h}/>
    <span className={(show ? 'show' : 'close')} onClick={() => setShow(0)}>X</span>
    <span className={(show ? 'showPhotoName' : 'close')} onClick={() => setShow(0)}>  {pname}  </span>
    <span className={(show ? 'showdesc' : 'close')} onClick={() => setShow(0)}>  {desc}  </span>
    <div className="actions">
      <button className={show ? 'hide' : ''} onClick={() => setShow(show ? 0 : 1)}>{pname}</button>
      <div className={show ? '' : 'hide'}>
        Newstead House Image
      </div>
      <div className="title">
      </div>

    </div>
  </div>
  )
}

export default ImgFrame