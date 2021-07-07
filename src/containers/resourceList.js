import React, { Component } from 'react';

export default class resourceList extends Component {
  constructor(props) {
		super(props);
	}
	render(){
		return (

					     <b>Title:</b> {this.props.shortTitle}<br/>
               <b>Genre:</b> {this.props.genre}<br/>
               <b>Arranger:</b> {this.props.arranger}<br/>
               <b>Publisher:</b> {this.props.publisher}<br/>
               <b>Date:</b> {this.props.date}<br/>
               <b>Place:</b> {this.props.place}<br/>
               <b>Shelfmark:</b> {this.props.inventoryNumber}<br/>

      );
   }
}
