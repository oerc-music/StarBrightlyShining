import React, { Component } from 'react';

export default class Modal extends Component {

  constructor(props) {
		super(props);
	}

  render() {
    return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Modal Tittttle</h4>
        </div>
        <div className="popup">
          This is modal content
        </div>
        <div className="modal-footer">
          <button className="button">Close</button>
        </div>
      </div>
    </div>
    )
  }
}
