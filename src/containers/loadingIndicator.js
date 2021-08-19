import React, { Component } from 'react';

export default class LoadingIndicator extends Component {

  render() {
    return (
      <div>
        <img className="loadingIndicator" src="img/loading.gif"/>
        {'   '}New Loading Indicator
      </div>
    )
  }
}
