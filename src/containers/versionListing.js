import React, { Component } from 'react';

export default class VersionListing extends Component {
  constructor(props) {
		super(props);
		this.state = {
		}
	}
	render(){
		return (
			<div className="listing" onClick={this.props.clickHandler}>
				<dl>
					<div><dt>Title:</dt><dd>{this.props.shortTitle}</dd></div>
					<div><dt>Genre:</dt><dd> {this.props.genre}</dd></div>
					<div><dt>Arranger:</dt><dd>{typeof(this.props.arranger)==='string' ?
																			this.props.arranger : ''}</dd></div>
					<div><dt>Publisher:</dt><dd>{typeof(this.props.publisher)==='string' ?
																			 this.props.publisher : ''}</dd></div>
					<div><dt>Date:</dt><dd>{this.props.date}</dd></div>
					<div><dt>Place:</dt><dd>{typeof(this.props.place)==='string' ?
																	 this.props.place : ''}</dd></div>
          <div><dt>catNumber:</dt><dd>{this.props.catNumber}</dd></div>
				</dl>
			</div>
		);
	}
}