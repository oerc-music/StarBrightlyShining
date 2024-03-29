import React, { Component } from 'react';
import SelectableScore from 'selectable-score/lib/selectable-score';
import SubmitButton from 'selectable-score/lib/submit-button.js';
import ExtractVisualiser from './extractVisualiser';
import { prefix as pref } from 'meld-clients-core/lib/library/prefixes';
import { convertCoords } from 'meld-clients-core/lib/library/boxesForMeasures';

function xmin(positions){
	return Math.min(...positions.map(pos => pos.x));
}

function xmax(positions){
	return Math.max(...positions.map(pos => pos.x2));
}

export default class VersionPane extends Component {
  constructor(props) {
		super(props);
		this.state = {
			showDetails: "noDetails",
			lpos: 0
		}
		this.scrollPane = React.createRef();
		this.toggleDetails = this.toggleDetails.bind(this);
		this.scrollForward = this.scrollForward.bind(this);
		this.scrollBackward = this.scrollBackward.bind(this);
		this.replaceVersion = this.replaceVersion.bind(this);
		this.xRanges = this.xRanges.bind(this);

	}
	xRanges(material) {
		let xPositions = [];
		const extracts = material["https://domestic-beethoven.eu/Terms/hasSetting"];
		const ids = extracts.reduce(
			(extractNotes, extract) => {
				var selections = Array.isArray(extract[pref.frbr+"embodiment"]) ? extract[pref.frbr+"embodiment"] : [extract[pref.frbr+"embodiment"]];
				return selections.reduce(
				// return extract[pref.frbr+"embodiment"].reduce(
					(selectionNotes, selection) => {
						return selection[pref.frbr+"part"].reduce(
							(notes, uri) => ((uri["@id"].startsWith(this.props.uri + "#")) ? notes.concat([uri["@id"]]) : notes), selectionNotes);
					}, extractNotes);
			}, []);
		const frags = ids.map(x => x.split('#')[1]);
		const positions = frags.map(convertCoords);
		return [xmin(positions), xmax(positions)];
	}
	toggleDetails(){
		if(this.state.showDetails==="metadata"){
			this.setState({showDetails: "noDetails"});
		} else {
			this.setState({showDetails: "metadata"});
		}
	}
	componentDidUpdate(prevProps, prevState){
		const margin = 30;
		if(this.props.selectedAnnotation){
			console.log(this.props.selectedAnnotation, this.xRanges(this.props.selectedAnnotation), this.scrollPane.current);
			this.scrollPane.current.scrollLeft = this.xRanges(this.props.selectedAnnotation)[0] - margin;
		}
	}
	detailsButtonText(){
		if(this.state.showDetails==="metadata"){
			return "Hide details";
		} else {
			return "Show details";
		}
	}
	scrollForward(){
		const delta = this.state.showDetails==="noDetails" ? 0.90 * this.props.width : 0.75*this.props.width;
		this.scrollPane.current.scrollBy({top: 0, left: delta, behavior: 'smooth'});
	}
	scrollBackward(){
		const delta = this.state.showDetails==="noDetails" ? 0.90 * this.props.width : 0.75*this.props.width;
		this.scrollPane.current.scrollBy({top: 0, left: - delta, behavior: 'smooth'});
	}
	vrvScale() {
		const targetWidth = this.state.showDetails==="noDetails"
			? Math.min(this.props.width, 1000)
			: Math.min(0.8 * this.props.width, 1000);
		return Math.max(20, 45 - ((1000-targetWidth) / 20));
	}

	replaceVersion() {
		const position = (this.props.extraClasses === 'upper') ? 0 : 1

		console.log('\n\n\n---------got here to replaceVersion()--------- ' + position)


		console.log('Need to Switch position ' + position)

		try {
			this.props.handleReplaceVersion();
//			this.props.handleReplaceVersion(false, position)
		} catch(err) {
			console.log('ERRoR: ' + err)
			console.log('this in versionPane:')
			console.log(this)
			console.log(this.props.handleReplaceVersion)
		}

	}

// For entities with GND number provided in wikidata rdf:
// Creates a small button with link to DNB '/about' page.
	addGnd(number) {
		return <a href={"http://d-nb.info/gnd/"+this.props.dnbArr} target='_blank'>
			<img className="authButton" src="img/dnb.jpg"/></a>
	}

	render(){
		let vrvOptions = {...this.props.vrvOptions, adjustPageHeight: 0, breaks: 'none',
											pageWidth: 60000};
		return (
			<div className={"music pane "+this.props.extraClasses} id={this.props.id}>
				<div className={"main "+this.state.showDetails}>

					<div className="controllbar">
						<div className="leftControls">
							<div className="scoreScrollButton" onClick={this.scrollBackward}><span>⇦</span></div>
							<div className="scoreScrollButton" onClick={this.scrollForward}><span>⇨</span></div>
							<div className="replaceButton" onClick={this.replaceVersion} >Replace version</div>
						</div>
						<div className="middle"/>
						<div className="rightControls">
							<button className="showDetails" onClick={this.toggleDetails}>
								{ this.detailsButtonText() }
							</button>
						</div>
					</div>


					<div className="scrollableScore" ref={this.scrollPane}>
						<SelectableScore uri={this.props.uri}
														 vrvOptions = { vrvOptions }
														 onSelectionChange = { this.props.selectionHandler }
														 selectorString = { this.props.selectorString }
														 onScoreUpdate = { this.props.handleScoreUpdate } />
						<ExtractVisualiser uri={this.props.uri} musicalMaterial={this.props.annotations}
															 toDraw={this.props.annotations.map(this.xRanges)}
															 selectedAnnotation={this.props.selectedAnnotation}
															 handleSelectAnnotation={this.props.handleSelectAnnotation} />
					</div>
				</div>
				<aside className={this.state.showDetails}>
					<dl>
						<div><dt>Title:</dt><dd>{this.props.shortTitle}</dd></div>
						<div><dt>Genre:</dt><dd> {this.props.genre}</dd></div>
						<div><dt>Arranger:</dt><dd>{this.props.arranger}
				 			{ this.props.dnbArr ? this.addGnd(this.props.dnbArr) : false }</dd></div>
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
