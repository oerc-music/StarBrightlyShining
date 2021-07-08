import React, { Component } from 'react';
import SelectableScore from 'selectable-score/lib/selectable-score';
import NextPageButton from 'selectable-score/lib/next-page-button.js';
import PrevPageButton from 'selectable-score/lib/prev-page-button.js';
import SubmitButton from 'selectable-score/lib/submit-button.js';

export default class VersionPane extends Component {
  constructor(props) {
		super(props);
		this.state = {
			showDetails: "noDetails"
		}
		this.toggleDetails = this.toggleDetails.bind(this);
	}
	toggleDetails(){
		if(this.state.showDetails==="metadata"){
			this.setState({showDetails: "noDetails"});
		} else {
			this.setState({showDetails: "metadata"});
		}
	}
	detailsButtonText(){
		if(this.state.showDetails==="metadata"){
			return "Hide details";
		} else {
			return "Show details";
		}
	}
	vrvScale() {
		const targetWidth = this.state.showDetails==="noDetails"
			? Math.min(this.props.width, 1000)
			: Math.min(0.8 * this.props.width, 1000);
		return Math.max(20, 45 - ((1000-targetWidth) / 20));
	}
	render(){
		let vrvOptions = {...this.props.vrvOptions,
											scale: this.vrvScale()};
		return (
			<div className={"music pane "+this.props.extraClasses} id={this.props.id}>
				<div className={"main "+this.state.showDetails}>
					<div className="controllbar">
						<div className="leftControls">
							<PrevPageButton uri={this.props.uri} buttonContent={<span>⇦</span>} />
							<NextPageButton uri={this.props.uri} buttonContent={<span>⇨</span>} />
						</div>
						<div className="middle"/>
						<div className="rightControls">
							<button className="showDetails" onClick={this.toggleDetails}>
								{ this.detailsButtonText() }
							</button>
						</div>
					</div>
					<SelectableScore uri={this.props.uri}
													 vrvOptions = { vrvOptions }
													 onSelectionChange = { this.props.selectionHandler }
													 selectorString = { this.props.selectorString }
													 onScoreUpdate = { this.props.handleScoreUpdate } />
				</div>
				<aside className={this.state.showDetails}>
					<dl>
						<div><dt>Title:</dt><dd>{this.props.shortTitle}</dd></div>
						<div><dt>Genre:</dt><dd> {this.props.genre}</dd></div>
						<div><dt>Arranger:</dt><dd>{this.props.arranger}</dd></div>
						<div><dt>Publisher:</dt><dd>{this.props.publisher}</dd></div>
						<div><dt>Date:</dt><dd>{this.props.date}</dd></div>
						<div><dt>Place:</dt><dd>{this.props.place}</dd></div>
            <div><dt>catNumber:</dt><dd>{this.props.catNumber}</dd></div>
					</dl>
				</aside>
			</div>
		);
	}
}
