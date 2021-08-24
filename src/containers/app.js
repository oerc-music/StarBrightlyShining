import React, { Component } from 'react';
import { connect } from 'react-redux' ;
import { bindActionCreators } from 'redux';
import update from 'immutability-helper';
import { registerTraversal, traverse, setTraversalObjectives, checkTraversalObjectives } from 'meld-clients-core/lib/actions/index';
import { prefix as pref } from 'meld-clients-core/lib/library/prefixes';
import { fetchGraph } from 'meld-clients-core/lib/actions/index';
import VersionPane from './versionPane';
import VersionListing from './versionListing';
import WorkListing from './workListing';
import SelectableScore from 'selectable-score/lib/selectable-score';
import NextPageButton from 'selectable-score/lib/next-page-button.js';
import PrevPageButton from 'selectable-score/lib/prev-page-button.js';
import SubmitButton from 'selectable-score/lib/submit-button.js';
import LoadingIndicator from './loadingIndicator.js';

const MAX_TRAVERSERS = 5;

// selectionString: CSS selector for all elements to be selectable (e.g. ".measure", ".note")
//const selectorString = ".measure";
//const selectorString = ".notehead";
const selectorStrings = { note: ".notehead, .stem, .verse", measure: ".measure" };

pref.bith = "https://example.com/";
pref.bithTerms = "https://example.com/Terms/";
pref.bibo = "http://purl.org/ontology/bibo/";
pref.gndo = "https://d-nb.info/standards/elementset/gnd#";
pref.dce = "http://purl.org/dc/elements/1.1/";
pref.dbpedia = "https://dbpedia.org/ontology/";
pref.rdau = "http://rdaregistry.info/Elements/u/";
pref.wdt = "https://www.wikidata.org/prop/direct/";
pref.wdp = "http://www.wikidata.org/prop/";
pref.wdps = "http://www.wikidata.org/prop/statement/"
pref.wdpn = "http://www.wikidata.org/prop/statement/value-normalized/";
pref.schema = "http://schema.org/";
pref.locn = "http://id.loc.gov/authorities/names/";

const basicVrvOptions = {
  scale: 45,
	header: "none",
  adjustPageHeight: 1,
  pageHeight: 800,
  pageWidth: 2200,
  footer: "none",
  unit: 6
};


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
			mode: 'work',
			//			mode: 'compare',
			// mode: 'version',
			versions: [false, false],
			work: false,
			worklist: [],
			targetting: 'note',
			multiSelect: false,
			// selector: '.notehead, .stem, .verse',
      selection: {},
			width: 1200,
			height: 800,
			annotations: [],
      uri: this.props.uri,
			selectedAnnotation: false,
      arrangements: false
    };
    this.handleScoreUpdate = this.handleScoreUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
		this.selectMeasures = this.selectMeasures.bind(this);
		this.selectNotes = this.selectNotes.bind(this);
		this.usefulIdForChildElement = this.usefulIdForChildElement.bind(this);
		this.makeMusicalMaterialFromSelection = this.makeMusicalMaterialFromSelection.bind(this);
		this.makeSelectionJSONLDFromSelection = this.makeSelectionJSONLDFromSelection.bind(this);
		this.makeExtractFromSelection = this.makeExtractFromSelection.bind(this);
		this.renderVersionInList = this.renderVersionInList.bind(this);
		this.renderWorkInList = this.renderWorkInList.bind(this);
		this.handleAddVersionPane = this.handleAddVersionPane.bind(this);
		this.handleSelectAnnotation = this.handleSelectAnnotation.bind(this);
    this.handleChangeWork = this.handleChangeWork.bind(this);
    this.transformArrangement = this.transformArrangement.bind(this);
		this.props.setTraversalObjectives([
			{
				"@embed": "@always",
				"http://rdaregistry.info/Elements/u/P60242": {}
			},
			{
				"@type": pref.bith + "MusicalMaterial"
			}
		]);
	}
	// Life cycle methods
	componentDidMount(){
    // See: https://reactjs.org/docs/react-component.html#componentdidmount
    if(this.props.graphURI){
      // this.props.registerTraversal(this.props.graphURI, {numHops: 3});
      this.props.registerTraversal(this.props.graphURI,
					 {numHops: 3,
						followPropertyUri: [pref.bibo+"shortTitle", pref.dbpedia+"genre", "@id", "@type", "@value",
																pref.gndo+"arranger", pref.gndo+"opusNumericDesignationOfMusicalWork",
																pref.dce+"publisher", pref.gndo+"dateOfPublication",
																pref.frbr+"embodiment", pref.rdau+"P60163", pref.rdau+"O60242",
																pref.wdt+"P217",pref.rdfs+"label"
						],
						ignoreObjectPrefix: ["http://d-nb.info/gnd/", "http://rdaregistry.info/"]});
    }
		window.addEventListener("resize", this.updateDimensions.bind(this));
  }
  updateDimensions() {
		this.setState({width: document.documentElement.clientWidth,
									 height: document.documentElement.clientHeight});
  }

  componentDidUpdate(prevProps, prevState){
    // See: https://reactjs.org/docs/react-component.html#componentdidupdate
    if(prevProps && "graph" in prevProps) {
      if ( this.graphComponentDidUpdate(this.props, prevProps, prevState ) ) {
				this.graphHasChanged();
      }
    }
	}

  labelForGenre(genre, language){
      if (!genre || !(pref.schema+"about" in genre)) return "";
       const name = genre [pref.schema+"about"][pref.schema+"name"];
      if ( Array.isArray(name) && name.length > 1 ){
        return name.find(x => x["@language"] === language)["@value"];
      } else if ( Array.isArray(name)){
        return name[0]["@value"];
      } else {
        return "";
      }
  }

    labelForPlace(place, language){
      if (!place || !(pref.schema+"about" in place)) return "";
      const name = place [pref.schema+"about"][pref.schema+"name"];
      if ( Array.isArray(name) && name.length > 1 ){
        return name.find(x => x["@language"] === language)["@value"];
      } else if ( Array.isArray(name)){
        return name[0]["@value"];
      } else {
        return "";
      }
    }

    labelForArranger(arranger, language){
      if (!arranger || !(pref.schema+"about" in arranger)) return "";
      const name = arranger [pref.schema+"about"][pref.schema+"name"];
      if ( Array.isArray(name) && name.length > 1 ){
        return name.find(x => x["@language"] === language)["@value"];
      } else if ( Array.isArray(name)){
        return name[0]["@value"];
      } else {
        return "";
      }
    }

    dnbForArranger(arranger){
      if (!arranger || !(pref.schema+"about" in arranger)) return "No Arranger/About";

      const dnbnum = arranger [pref.schema+"about"][pref.schema+"name"][pref.wdp+"P227"];

      if ( Array.isArray(dnbnum) && dnbnum.length > 1 ){
        return dnbnum;
      } else if ( Array.isArray(dnbnum)){
        return dnbnum;
      } else {
        return dnbnum;
      }
    }

/* http://www.wikidata.org/prop/statement/value-normalized/P227 */

  getNumber(vivoScore) {

    let arranger;
    let about;
    let p227;
    let p227statement;

const notFound = ""

    if(pref.gndo+"arranger" in vivoScore) {
      arranger = vivoScore[pref.gndo+"arranger"]
    } else {
      return notFound
    }
    if(pref.schema+"about" in arranger) {
      about = arranger[pref.schema+"about"]
    } else {
      return notFound
    }
    if(pref.wdp+"P227" in about) {
      p227 = about[pref.wdp+"P227"]
    } else {
      return notFound
    }
    if(pref.wdps+"P227" in p227) {
      p227statement = p227[pref.wdps+"P227"]
    return p227statement
    } else {
      return notFound
    }
  }
/*
    let step2 = step1 && pref.schema+"about" in vivoScore[pref.gndo+"arranger"] ? true : false
    let step3 = step2 && pref.wdp+"P227" in vivoScore[pref.gndo+"arranger"][pref.schema+"about"] ? true : false
    let step4 = step3 && pref.wdpn+"P227" in vivoScore[pref.gndo+"arranger"][pref.schema+"about"][pref.wdp+"P227"] ? true : false

    console.log('\nlevels: ' + step1 + ' - ' + step2 + ' - ' + step3 + ' - ' + step4)

    obj.dnbArr = step4 ?
              vivoScore[pref.gndo+"arranger"][pref.schema+"about"][pref.wdp+"P227"][pref.wdps+"P227"] : "";
  }
*/

	transformArrangement(vivoScore){

    // Take graph of arrangement and make more intuitive local object
		let obj = {};
		obj.shortTitle = vivoScore[pref.bibo+"shortTitle"];

    obj.genre = pref.dbpedia+"genre" in vivoScore ?
                this.labelForGenre(vivoScore[pref.dbpedia+"genre"], "en") : false;

    obj.arranger = pref.gndo+"arranger" in vivoScore ?
                this.labelForArranger(vivoScore[pref.gndo+"arranger"], "en") : false;

//  find url of dnb record in wikidata

    let step1 = pref.gndo+"arranger" in vivoScore ? true : false
    let step2 = step1 && pref.schema+"about" in vivoScore[pref.gndo+"arranger"] ? true : false
    let step3 = step2 && pref.wdp+"P227" in vivoScore[pref.gndo+"arranger"][pref.schema+"about"] ? true : false
    let step4 = step3 && pref.wdpn+"P227" in vivoScore[pref.gndo+"arranger"][pref.schema+"about"][pref.wdp+"P227"] ? true : false

    console.log('\nlevels: ' + step1 + ' - ' + step2 + ' - ' + step3 + ' - ' + step4)

//    obj.dnbArr = step4 ?
//              vivoScore[pref.gndo+"arranger"][pref.schema+"about"][pref.wdp+"P227"][pref.wdps+"P227"] : "";
    obj.dnbArr = pref.gndo+"arranger" in vivoScore ?
                 this.getNumber(vivoScore) : "transformArrangement return: false"

    obj.place = pref.rdau+"P60163" in vivoScore ?
                this.labelForPlace(vivoScore[pref.rdau+"P60163"], "en") : false;

// not all the publishers listed on wikidata. So stick to dnb for now
    obj.publisher = pref.dce+"publisher" in vivoScore ?
                vivoScore[pref.dce+"publisher"][pref.rdfs+"label"] : false;

		obj.date = pref.gndo+"dateOfPublication" in vivoScore ?
                vivoScore[pref.gndo+"dateOfPublication"] : false;

		obj.MEI = pref.frbr+"embodiment" in vivoScore ?
                vivoScore[pref.frbr+"embodiment"]['@id'] : false;

    obj.catNumber = pref.wdt+"P217" in vivoScore ? vivoScore[pref.wdt+"P217"] : false;

		obj.work = vivoScore[pref.rdau+"P60242"];

//		obj.genre = pref.dbpedia+"genre" in vivoScore ? vivoScore[pref.dbpedia+"genre"]['@id'] : false;
//		obj.arranger = vivoScore[pref.gndo+"arranger"][pref.schema+"about"][pref.rdfs+"label"][0]; // Change so we have name, not URL
//    obj.genre = vivoScore[pref.dbpedia+"genre"][pref.schema+"about"][pref.schema+"name"];
//    obj.dnbArr = this.getNumber(vivoScore);
//    obj.work = pref.rdau+"P60424" in vivoScore ? vivoScore[pref.rdau+"P60242"] : false;

		console.log("Processed a ", vivoScore, " into a ", obj);

		return obj;
	}

	// methods called during initialisation and graph loading
	addWork(worklist, arrangement){
		if(!arrangement.work || !'@id' in arrangement.work) return workList;
		const wID = arrangement.work['@id'];
		if(worklist.find(x => x['@id']===wID)){
			return worklist;
		} else {
			let wl2 = worklist.slice();
			wl2.push(arrangement.work);
			return wl2;
		}
	}
	graphHasChanged(){
		let arrangements = [];
		let worklist = [];
		// 0. Get arrangements
		if(this.props.graph && this.props.graph.outcomes
			 && this.props.graph.outcomes[0]
			 && this.props.graph.outcomes[0]['@graph']
			 && this.props.graph.outcomes[0]['@graph'].length){
			arrangements = this.props.graph.outcomes[0]['@graph'].map(this.transformArrangement);
			// Extract all unique works from the arrangements list
			worklist = arrangements.reduce(this.addWork, []);
		}
		// 1. convert this.graph.outcomes[0] into this.state.worklist
    this.setState({arrangements: arrangements, worklist: worklist});
	}

  graphComponentDidUpdate(props, prevProps, prevState) {
		// Boiler plate traversal code (should move to m-c-c)
		// Check whether the graph has updated and trigger further traversal as necessary.
		// Called by this.componentDidUpdate
    var prevPool = prevProps.traversalPool;
    var thisPool = props.traversalPool;
    var updated  = false;
    if (prevPool.running === 1 && thisPool.running ===0){
      // check our traversal objectives if the graph has updated
      props.checkTraversalObjectives(
        props.graph.graph, props.graph.objectives);
      updated = true;
    } else if ( Object.keys(thisPool.pool).length && thisPool.running < MAX_TRAVERSERS) {
      // Initiate next traverser in pool...
      var uri = Object.keys(thisPool.pool)[0];
      props.traverse(uri, thisPool.pool[uri]);
      if (prevProps.graph.outcomesHash !== props.graph.outcomesHash) {
        updated = true;
      }
    } else if ( props.traversalPool.running===0 ) {
      if(prevProps.graph.outcomesHash !== props.graph.outcomesHash) {
        updated = true;
      }
    }
    return updated;
  }

	// UI methods

	selectMeasures(){
		this.setState({targetting: 'measure'});
	}
	selectNotes(){
		this.setState({targetting: 'note'});
	}

	usefulIdForChildElement(element) {
		if(element.classList.contains(this.state.targetting)){
			return element.id;
		} else if(this.state.targetting==='note' && element.classList.contains('chord')){
			// Ugly exception – chords have a stem that applies to all notes
			return Array.from(element.getElementsByClassName('note')).map(x => x.id);
		} else if(!element.parentNode.parentNode) {
			return false;
		} else {
			return this.usefulIdForChildElement(element.parentNode);
		}
	}
  handleNoteSelectionChange(key, selection) {
		// We need to replace this.state.selection[key] with the notes that contain newSelection
		const selectionIds = selection.map(this.usefulIdForChildElement).flat();
		this.handleSelectionChange(key, selectionIds);
  }
  handleMeasureSelectionChange(key, selection) {
		// We need to replace this.state.selection[key] with the notes that contain newSelection
		const selectionIds = selection.map(x => x.id);
		this.handleSelectionChange(key, selectionIds);
  }
	handleSelectionChange(key, selectionIds){
		const pane = document.getElementById(key);
		if(!pane){
			console.log("FAILED TO FIND", key, selectionIds);
			return;
		}
		const selectedElements = Array.from(pane.getElementsByClassName('selected'));
		const newSelection = {...this.state.selection};
		selectedElements.forEach(thing => thing.classList.remove('selected'));
		selectionIds.forEach(e => document.getElementById(e).classList.add('selected'));
		newSelection[key] = selectionIds;
    this.setState({ selection: newSelection,
										multiSelect: (Object.keys(newSelection).length > 1
																	&& Object.values(newSelection).filter(x => x.length).length > 1) });
	}
	handleSelectAnnotation(annotation){
		this.setState({selectedAnnotation: annotation});
	}
	addElementToSelectionObject(object, resourceURI, element) {
		if(!((pref.frbr+"part") in object)) object[pref.frbr+"part"] = [];
		object[pref.frbr+"part"].push(resourceURI+"#"+element);
		return object;
	}
	makeSelectionJSONLDFromSelection(uri){
		const selectionObject = {"@type": pref.bithTerms+"Selection"};
		this.state.selection[uri].forEach(this.addElementToSelectionObject.bind(this, selectionObject, uri));
		return selectionObject;
	}
	makeExtractFromSelection(uri){
		const extractObject = {"@type": pref.bithTerms+"Extract"};
		extractObject[pref.frbr+"member"] = [this.makeSelectionJSONLDFromSelection(uri)];
		return extractObject;
	}
	makeMusicalMaterialFromSelection(){
		const uris = Object.keys(this.state.selection);
		const now = new Date();
		let mm = {"@type": pref.bithTerms+"MusicalMaterial"};
		mm[pref.dct+"created"] = now.toISOString();
		mm[pref.frbr+"embodiment"] = uris.map(this.makeExtractFromSelection);
		this.setState(update(this.state, {annotations: {$push: [mm]}}));
	}
  handleScoreUpdate(scoreElement) {
    console.log("Received updated score DOM element: ", scoreElement)
  }

	handleChooseWork(work){
		this.setState({mode: 'version', work: work });
  }
  handleChangeWork(){
    this.setState({mode: 'work', work: false});
  }

	handleChooseVersion(version){
		this.setState({mode: 'score', versions: [version, false]});
	}
	handleReplaceVersion(version, replacePos){


		// Swap out one of the versions
		let versions = this.state.versions.slice();
		versions[replacePos] = version;

		this.setState({mode: 'compare', versions});
	}

	handleAddVersionPane(){
		this.setState({mode: 'addVersion'});
	}
  handleSubmit(args) {
    /* do any app-specific actions and return the object (e.g. a Web Annotation)
     * to be submitted to the user POD */
    console.log("Received args: ", args);
    return {
      "@context": "http://www.w3.org/ns/anno.jsonld",
      "target": this.state.selection.map( (elem) => this.state.uri + "#" + elem.getAttribute("id") ),
      "motivation": "highlighting"
    }
  }
	render(){

		switch(this.state.mode){
			case 'version':
				return this.renderVersions();
			case 'addVersion':
				return this.renderVersions();
			case 'score':
				return this.renderSingleScore();
			case 'compare':
        return this.renderTiledScores();
			case 'work':
			default:
          if (this.state.worklist.length > 0) {
            return this.renderWorks();
          } else {
            return <LoadingIndicator/>
          }
	     }
  }
	// renderWorkInList(work){
	// 	// Each work is drawn separately to the works list
	// 	return <div className="workListing" onClick={ this.handleChooseWork.bind(this, work) }>{ work.title}</div> ;
	// }

  renderWorkInList(work){
      const handler = this.handleChooseWork.bind(this, work) ;
      return <WorkListing key={work['@id']}
                shortTitle={work[pref.rdfs+"label"]}
                composer={work[pref.rdau+"P60426"][pref.rdfs+"label"]}
                opus={work[pref.gndo+"opusNumericDesignationOfMusicalWork"]}
                date={work[pref.gndo+"dateOfPublication"]}
                clickHandler={ handler } />
  }

	renderVersionInList(version){
		// Each verison is drawn separately to the versions list
		const handler = this.state.mode==="version" ? this.handleChooseVersion.bind(this, version)
					: this.handleReplaceVersion.bind(this, version, 1)
		return <VersionListing key={version.shortTitle}
													 clickHandler={ handler }
                           {...version}/>;
	}
	renderWorks(){
		return (
			<div className="works">
				{ this.state.worklist.map(this.renderWorkInList) }
			</div>
		);
	}

	renderWorkAsHeader(work){
		if(!work){
			return <div className="backButton" onClick={this.handleChangeWork}>Go Back - Change Work</div>;
		} else if(this.state.mode==="version"){
      return <div className="backButton1" onClick={this.handleChangeWork}>Go Back - Change Work</div>
    } else {
			return <div className="workHeader">
                <div className="backButton1" onClick={this.handleChangeWork}>Go Back - Change Work</div>
                <div className="workTitle">
                  <div>Title of Work: <h4>{work[pref.rdfs+"label"]}</h4></div>
                </div>
             </div>;
		}
	}
	renderVersions(){
		if(!this.state.arrangements.length) return <div>Loading...</div>;
		return (
			<div className="work">
				<div className="workInfo">{this.renderWorkAsHeader(this.state.work)}</div>
				<div className="versions">
					{ this.state.work ?
						this.state.arrangements.filter(x=> x.work['@id']===this.state.work['@id']).map(this.renderVersionInList) :
						this.state.arrangements.map(this.renderVersionInList) }
				</div>
			</div>
		);
	}
	selectionRadioButton(target, callback){
		return <input type="radio" name="target" checked={this.state.targetting===target}
									className={this.state.targetting===target ? "checked" : "unchecked" }
									onChange={callback}
									value={target} id={target} /> ;
	}
	annotationButtons(){
		if(this.state.multiSelect){
			return (
				<button className="musicalMaterial annotationButton"
						 onClick={ this.makeMusicalMaterialFromSelection } >
					Parallel passages
				</button>
			);
		}
	}
	renderTiledScores(){

		if(!this.state.versions[0] && this.state.versions[1]) return <div>Loading...</div>;

		const upper = this.state.versions[0];
		const lower = this.state.versions[1];
		const selectionHandler = this.state.targetting==='note' ?
					this.handleNoteSelectionChange :
					this.handleMeasureSelectionChange ;
		const narrowWindow = this.state.width < 800;
		console.log(this.state.versions[0], this.state.versions[1]);
		return(

			<main>

				<div className="workInfo">{this.renderWorkAsHeader(this.state.work)}</div>

				<h4>Select:</h4>
				<div className="target switch-field">
					{ this.selectionRadioButton('measure', this.selectMeasures) }
					<label htmlFor="measure">Measures</label>
					{ this.selectionRadioButton('note', this.selectNotes) }
					<label htmlFor="note">Notes</label>
				</div>


				{this.annotationButtons()}

				<VersionPane extraClasses="upper"
										 id="pane1"
										 narrowPane={ narrowWindow }
										 width={ this.state.width }
										 uri={ upper.MEI }
                     shortTitle={ upper.shortTitle}
                     arranger={ upper.arranger }
                     genre={ upper.genre}
                     publisher={ upper.publisher }
                     date={ upper.date}
                     place={ upper.place}
                     catNumber={ upper.catNumber}
                     dnbArr={ upper.dnbArr }
										 vrvOptions={ basicVrvOptions }
										 annotations= {this.state.annotations}
										 selectionHandler={ selectionHandler.bind(this, upper.MEI) }
										 selectorString={ selectorStrings[this.state.targetting] }
										 handleSelectAnnotation={ this.handleSelectAnnotation }
										 selectedAnnotation={this.state.selectedAnnotation}
										 handleScoreUpdate={ this.handleScoreUpdate }
                     handleReplaceVersion={ this.handleReplaceVersion.bind(this)}/>
				<VersionPane extraClasses="lower"
										 width={ this.state.width }
										 id="pane1"
                     shortTitle={lower.shortTitle}
                     arranger={ lower.arranger }
                     genre={ lower.genre}
                     publisher={ lower.publisher }
                     date={ lower.date}
                     place={ lower.place}
                     catNumber={ lower.catNumber}
                     dnbArr={ lower.dnbArr }
										 uri={ lower.MEI }
										 annotations= {this.state.annotations}
										 vrvOptions={ basicVrvOptions }
										 handleSelectAnnotation={ this.handleSelectAnnotation }
										 selectedAnnotation={this.state.selectedAnnotation}
										 selectionHandler={ selectionHandler.bind(this, lower.MEI) }
										 selectorString={ selectorStrings[this.state.targetting] }
										 handleScoreUpdate={ this.handleScoreUpdate }
                     handleReplaceVersion={ this.handleReplaceVersion.bind(this)}/>
			</main>
		);
	}
  renderSingleScore() {
    const upper = this.state.versions[0];
		const lower = this.state.versions[1];
		const selectionHandler = this.state.targetting==='note' ?
					this.handleNoteSelectionChange :
					this.handleMeasureSelectionChange ;
		const narrowWindow = this.state.width < 800;
/*         return name.find(x => x["@language"] === language)["@value"]; */

    return(
      <div>
				<div className="workInfo">{this.renderWorkAsHeader(this.state.work)}</div>
        <p>Current selection: { this.state.selection.length > 0
          ? <span> { this.state.selection.map( (elem) => elem.getAttribute("id") ).join(", ") } </span>
          : <span>Nothing selected</span>
        }</p>

        <VersionPane extraClasses="upper"
										 id="pane1"
										 narrowPane={ narrowWindow }
										 width={ this.state.width }
										 uri={ upper.MEI }
                     shortTitle={ upper.shortTitle}
                     arranger={ upper.arranger }
                     genre={ upper.genre}
                     publisher={ upper.publisher }
                     date={ upper.date}
                     place={ upper.place}
                     catNumber={ upper.catNumber}
                     dnbArr={ upper.dnbArr }
										 vrvOptions={ basicVrvOptions }
										 annotations= {this.state.annotations}
										 selectionHandler={ selectionHandler.bind(this, upper.MEI) }
										 selectorString={ selectorStrings[this.state.targetting] }
										 handleSelectAnnotation={ this.handleSelectAnnotation }
										 selectedAnnotation={this.state.selectedAnnotation}
										 handleScoreUpdate={ this.handleScoreUpdate }
                     handleReplaceVersion={ this.handleReplaceVersion.bind(this)}/>

          <div><h4 className="addMessage">Choose version to compare</h4>
   				<button className="addPane" onClick={this.handleAddVersionPane}>
   					+
   				</button>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ graph , score, traversalPool}) {
    return { graph , score, traversalPool };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ registerTraversal, traverse,
                                setTraversalObjectives, checkTraversalObjectives, fetchGraph },
                              dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
