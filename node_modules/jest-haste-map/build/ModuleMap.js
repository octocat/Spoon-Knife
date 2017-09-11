'use strict'; /**
               * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
               *
               * This source code is licensed under the BSD-style license found in the
               * LICENSE file in the root directory of this source tree. An additional grant
               * of patent rights can be found in the PATENTS file in the same directory.
               *
               * 
               */










const H = require('./constants');

class ModuleMap {



  constructor(map, mocks) {
    this._map = map;
    this._mocks = mocks;
  }

  getModule(
  name,
  platform,
  supportsNativePlatform,
  type)
  {
    if (!type) {
      type = H.MODULE;
    }

    const map = this._map[name];
    if (map) {
      let module = platform && map[platform];
      if (!module && map[H.NATIVE_PLATFORM] && supportsNativePlatform) {
        module = map[H.NATIVE_PLATFORM];
      } else if (!module) {
        module = map[H.GENERIC_PLATFORM];
      }
      if (module && module[H.TYPE] === type) {
        return module[H.PATH];
      }
    }

    return null;
  }

  getPackage(
  name,
  platform,
  supportsNativePlatform)
  {
    return this.getModule(name, platform, null, H.PACKAGE);
  }

  getMockModule(name) {
    return this._mocks[name];
  }

  getRawModuleMap() {
    return {
      map: this._map,
      mocks: this._mocks };

  }}


module.exports = ModuleMap;