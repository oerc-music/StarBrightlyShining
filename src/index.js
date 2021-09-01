import React  from 'react';
import ReactDOM from 'react-dom';

import StoreWrapper from './containers/storeWrapper';

// Parameters for SelectableScore component
// ****************************************

// MEI_URI: Can be a full URI, e.g. obtained from the TROMPA Contributor Environment
const MEI_URI = "Hello_MELD.mei"

// vrvOptions: If not supplied to <SelectableScore>, will default to predefined options
const vrvOptions = {
  breaks: 'line',
  scale: 45,
  adjustPageHeight: 1,
  pageHeight: 2500,
  pageWidth: 2200,
  noFooter: 1,
  unit: 6
}

// changed to port 8081 to accomodate eXist db at 8080
const BitHCollection = "http://localhost:8081/rdf/BitHCollection.jsonld"

ReactDOM.render(
  <div>
    <div className="topLevelWrapper">
      <StoreWrapper graphURI = { BitHCollection } vrvOptions = { vrvOptions }/>
    </div>
  </div>
  , document.querySelector('.container')
);
