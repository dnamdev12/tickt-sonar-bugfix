"use strict";

exports.__esModule = true;
exports.between = exports.getDistanceBetweenPoints = exports.getPointFromTouch = exports.settle = void 0;

var settle = function settle(val, target, range) {
  var lowerRange = val > target - range && val < target;
  var upperRange = val < target + range && val > target;
  return lowerRange || upperRange ? target : val;
};

exports.settle = settle;

var getPointFromTouch = function getPointFromTouch(touch) {
  return {
    x: touch.clientX,
    y: touch.clientY
  };
};

exports.getPointFromTouch = getPointFromTouch;

var getDistanceBetweenPoints = function getDistanceBetweenPoints(pointA, pointB) {
  return Math.sqrt(Math.pow(pointA.y - pointB.y, 2) + Math.pow(pointA.x - pointB.x, 2));
};

exports.getDistanceBetweenPoints = getDistanceBetweenPoints;

var between = function between(min, max, value) {
  return Math.min(max, Math.max(min, value));
};

exports.between = between;