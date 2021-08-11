import React, { Component } from 'react';
import { prefix as pref } from 'meld-clients-core/lib/library/prefixes';

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
          <div><dt>Arrangement of:</dt><dd>{this.props.work[pref.rdfs+"label"]}</dd></div>
					<div><dt>Genre:</dt><dd>{typeof(this.props.genre)}</dd></div>
					<div><dt>Arranger:</dt><dd>{typeof(this.props.arranger[pref.rdfs+"label"])==='string' ?
																			this.props.arranger[pref.rdfs+"label"] : ''}</dd></div>
					<div><dt>Publisher:</dt><dd>{typeof(this.props.publisher[pref.rdfs+"label"])==='string' ?
																			 this.props.publisher[pref.rdfs+"label"] : ''}</dd></div>
					<div><dt>Date:</dt><dd>{this.props.date}</dd></div>
					<div><dt>Place:</dt><dd>{typeof(this.props.place)==='string' ?
																	 this.props.place : ''}</dd></div>
          <div><dt>catNumber:</dt><dd>{this.props.catNumber}</dd></div>
          <div><dt>Opus:</dt><dd>{typeof(this.props.work[pref.gndo+"opusNumericDesignationOfMusicalWork"])==='string' ?
																			 this.props.work[pref.gndo+"opusNumericDesignationOfMusicalWork"]: ''}</dd></div>				</dl>
			</div>
		);
	}
}
