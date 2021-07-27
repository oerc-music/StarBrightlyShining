import React from 'react';
import Value from './Value';
import { srcToLDflex } from '../util';
/** Displays the label of a Solid LDflex subject. */

export default function Label({
  src,
  children = null
}) {
  return /*#__PURE__*/React.createElement(Value, {
    src: src && `${srcToLDflex(src)}.label`
  }, children);
}