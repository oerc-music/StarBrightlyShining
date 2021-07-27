"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function request(element) {
  var vendors = [
    "requestFullscreen",
    "mozRequestFullScreen",
    "msRequestFullscreen",
    "webkitRequestFullscreen"
  ];
  var requestFullscreen = vendors.reduce(function(prev, curr) {
    return document.documentElement[curr] ? curr : prev;
  });
  element[requestFullscreen]();
}

function exit() {
  var vendors = [
    "exitFullscreen",
    "mozCancelFullScreen",
    "msExitFullscreen",
    "webkitExitFullscreen"
  ];
  var exitFullscreen = vendors.reduce(function(prev, curr) {
    return document[curr] ? curr : prev;
  });
  document[exitFullscreen]();
}

function change(type, callback) {
  var vendors = [
    "fullscreenchange",
    "mozfullscreenchange",
    "MSFullscreenChange",
    "webkitfullscreenchange"
  ];
  vendors.forEach(function(vendor) {
    return document[type + "EventListener"](vendor, callback);
  });
}

exports.default = {
  request: request,
  exit: exit,
  change: change
};
module.exports = exports["default"];
