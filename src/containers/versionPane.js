import React, { Component } from 'react';
import SelectableScore from 'selectable-score/lib/selectable-score';
import NextPageButton from 'selectable-score/lib/next-page-button.js';
import PrevPageButton from 'selectable-score/lib/prev-page-button.js';
import SubmitButton from 'selectable-score/lib/submit-button.js';

export default class VersionPane extends Component {
  constructor(props) {
		super(props);
	}
	render(){
		return (
			<div className={"music pane "+this.props.extraClasses} id={this.props.id}>
				<PrevPageButton uri={this.props.uri} buttonContent={<span>⇦</span>} />
				<NextPageButton uri={this.props.uri} buttonContent={<span>⇨</span>} />
				<SelectableScore uri={this.props.uri}
												 vrvOptions = { this.props.vrvOptions }
												 onSelectionChange = { this.props.selectionHandler }
												 selectorString = { this.props.selectorString }
												 onScoreUpdate = { this.props.handleScoreUpdate } />
				<div className="sidebar">
					<b>Title:</b> {this.props.shortTitle}<br/>
               <b>Genre:</b> {this.props.genre}<br/>
               <b>Arranger:</b> {this.props.arranger}<br/>
               <b>Publisher:</b> {this.props.publisher}<br/>
               <b>Date:</b> {this.props.date}<br/>
               <b>Place:</b> {this.props.place}<br/>
				</div>
			</div>
		);
	}
}
