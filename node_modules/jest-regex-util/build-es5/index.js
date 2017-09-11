'use strict'; /**
               * Copyright (c) 2014, Facebook, Inc. All rights reserved.
               *
               * This source code is licensed under the BSD-style license found in the
               * LICENSE file in the root directory of this source tree. An additional grant
               * of patent rights can be found in the PATENTS file in the same directory.
               *
               * 
               */

var path = require('path');

var escapePathForRegex = function escapePathForRegex(dir) {
  if (path.sep === '\\') {
    // Replace "\" with "/" so it's not escaped by escapeStrForRegex.
    // replacePathSepForRegex will convert it back.
    dir = dir.replace(/\\/g, '/');
  }
  return replacePathSepForRegex(escapeStrForRegex(dir));
};

var escapeStrForRegex = function escapeStrForRegex(string) {return (
    string.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&'));};

var replacePathSepForRegex = function replacePathSepForRegex(string) {
  if (path.sep === '\\') {
    return string.replace(/(\/|\\(?!\.))/g, '\\\\');
  }
  return string;
};

module.exports = {
  escapePathForRegex: escapePathForRegex,
  escapeStrForRegex: escapeStrForRegex,
  replacePathSepForRegex: replacePathSepForRegex };