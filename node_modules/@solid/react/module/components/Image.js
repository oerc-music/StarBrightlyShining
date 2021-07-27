import _extends from "@babel/runtime/helpers/extends";
import React from 'react';
import useLDflexValue from '../hooks/useLDflexValue';
/** Displays an image whose source is a Solid LDflex expression. */

export default function Image({
  src,
  defaultSrc,
  children = null,
  ...props
}) {
  src = useLDflexValue(src) || defaultSrc;
  return src ? /*#__PURE__*/React.createElement("img", _extends({
    src: src,
    alt: ""
  }, props)) : children;
}