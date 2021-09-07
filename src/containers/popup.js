// https://www.youtube.com/watch?v=i8fAO_zyFAM

import React, { Component } from 'react';
import Popup from 'reactjs-popup';

const CustomPopup = (props) => {

   return (
   <Popup
      trigger={<button className="button"> {props.openButtonLabel} </button>}
      modal
      nested>
      {close => (
         <div className={'modal ' + props.className}>
            <button className="close" onClick={close}> &times;</button>
            <div className="header"> {props.title} </div>
            <div className="content">
               { props.content }
            </div>
            <div className="actions">
               <button
                  className="button"
                  onClick={() => {
                     console.log('modal closed ');
                     close();
                  }}
               >close</button>
            </div>
         </div>
      )}
  </Popup>
   )
}

export default CustomPopup
