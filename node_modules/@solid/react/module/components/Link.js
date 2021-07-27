import _extends from "@babel/runtime/helpers/extends";
import React from 'react';
import Label from './Label';
import useLDflexValue from '../hooks/useLDflexValue';
/** Creates a link to the value of the Solid LDflex expression. */

export default function Link({
  href,
  children,
  ...props
}) {
  href = useLDflexValue(href) || '';
  children = children || /*#__PURE__*/React.createElement(Label, {
    src: href && `[${href}]`
  }, `${href}`);
  return href ? /*#__PURE__*/React.createElement("a", _extends({
    href: href
  }, props), children) : children;
}