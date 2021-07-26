import React, { Component } from 'react';
import { convertCoords }
from 'meld-clients-core/lib/library/boxesForMeasures';
import { prefix as pref } from 'meld-clients-core/lib/library/prefixes';

function xmin(positions){
	return Math.min(...positions.map(pos => pos.x));
}

function xmax(positions){
	return Math.max(...positions.map(pos => pos.x2));
}

export default class ExtractVisualiser extends Component {
  constructor(props) {
		super(props);
		this.xRanges = this.xRanges.bind(this);
		this.simpleLine = this.simpleLine.bind(this);
	}
	simpleLine(xrange, i){
		if(xrange){
			return <line className={"materialLine line-"+i} x1={xrange[0]} x2={xrange[1]}
									 y1={20} y2={20} key={"material-"+i}
									 onClick={this.props.handleSelectAnnotation.bind(null, this.props.musicalMaterial[i]) }/>;
		}
	}
	xRanges(material) {
		let xPositions = [];
		const extracts = material[pref.frbr+"embodiment"];
		const ids = extracts.reduce(
			(extractNotes, extract) => {
				console.log(extract);
				return extract[pref.frbr+"member"].reduce(
					(selectionNotes, selection) => {
						console.log(selection);
						return selection[pref.frbr+"part"].reduce(
							(notes, uri) => ((uri.startsWith(this.props.uri + "#")) ? notes.concat([uri]) : notes),
							selectionNotes);
					}, extractNotes);
			}, []);
		const frags = ids.map(x => x.split('#')[1]);
		console.log(frags);
		const positions = frags.map(convertCoords);
		console.log(positions);
		return [xmin(positions), xmax(positions)];
	}
	
	render(){
		if(this.props.toDraw && this.props.toDraw.length){
			// const toDraw = this.props.musicalMaterial.map(this.xRanges);
			// console.log("!!!!", toDraw);
			return (
				<svg width="6000" height="50">
					{this.props.toDraw.map(this.simpleLine)}
				</svg>
			);
		} else return <div/>;
	}
}
