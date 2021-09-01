import React, { Component } from 'react';

export default class WorkListing extends Component {
  constructor(props) {
		super(props);
		this.state = {
		}
	}
	render(){
		return (
         <div className="listing work" onClick={this.props.clickHandler}>
            <dl>
               <div><dt>Title:</dt><dd>{this.props.shortTitle}</dd></div>
               <div><dt>Composer:</dt><dd>{this.props.composer}</dd></div>
               <div><dt>Opus no.</dt><dd>{this.props.opus}</dd></div>
               <div><dt>Date:</dt><dd>{this.props.date}</dd></div>
            </dl>
         </div>
		);
	}
}
