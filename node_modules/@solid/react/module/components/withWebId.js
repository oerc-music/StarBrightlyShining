import _extends from "@babel/runtime/helpers/extends";
import React from 'react';
import useWebId from '../hooks/useWebId';
import { higherOrderComponent } from '../util';
/**
 * Higher-order component that passes the WebID of the logged-in user
 * to the webId property of the wrapped component.
 */

export default higherOrderComponent('WithWebId', Component => props => /*#__PURE__*/React.createElement(Component, _extends({}, props, {
  webId: useWebId()
})));