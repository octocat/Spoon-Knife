'use strict';var _map = require('babel-runtime/core-js/map');var _map2 = _interopRequireDefault(_map);var _weakMap = require('babel-runtime/core-js/weak-map');var _weakMap2 = _interopRequireDefault(_weakMap);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _keys = require('babel-runtime/core-js/object/keys');var _keys2 = _interopRequireDefault(_keys);var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);var _getOwnPropertyNames = require('babel-runtime/core-js/object/get-own-property-names');var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);var _create = require('babel-runtime/core-js/object/create');var _create2 = _interopRequireDefault(_create);var _assign = require('babel-runtime/core-js/object/assign');var _assign2 = _interopRequireDefault(_assign);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}



































var MOCK_CONSTRUCTOR_NAME = 'mockConstructor';

// $FlowFixMe
/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */var RESERVED_KEYWORDS = (0, _assign2.default)((0, _create2.default)(null), { arguments: true, await: true, break: true, case: true, catch: true, class: true, const: true, continue: true,
  debugger: true,
  default: true,
  delete: true,
  do: true,
  else: true,
  enum: true,
  eval: true,
  export: true,
  extends: true,
  false: true,
  finally: true,
  for: true,
  function: true,
  if: true,
  implements: true,
  import: true,
  in: true,
  instanceof: true,
  interface: true,
  let: true,
  new: true,
  null: true,
  package: true,
  private: true,
  protected: true,
  public: true,
  return: true,
  static: true,
  super: true,
  switch: true,
  this: true,
  throw: true,
  true: true,
  try: true,
  typeof: true,
  var: true,
  void: true,
  while: true,
  with: true,
  yield: true });


function isA(typeName, value) {
  return Object.prototype.toString.apply(value) === '[object ' + typeName + ']';
}

function getType(ref) {
  if (isA('Function', ref) || isA('AsyncFunction', ref)) {
    return 'function';
  } else if (Array.isArray(ref)) {
    return 'array';
  } else if (isA('Object', ref)) {
    return 'object';
  } else if (
  isA('Number', ref) ||
  isA('String', ref) ||
  isA('Boolean', ref) ||
  isA('Symbol', ref))
  {
    return 'constant';
  } else if (isA('Map', ref) || isA('WeakMap', ref) || isA('Set', ref)) {
    return 'collection';
  } else if (isA('RegExp', ref)) {
    return 'regexp';
  } else if (ref === undefined) {
    return 'undefined';
  } else if (ref === null) {
    return 'null';
  } else {
    return null;
  }
}

function isReadonlyProp(object, prop) {
  return (
    (prop === 'arguments' ||
    prop === 'caller' ||
    prop === 'callee' ||
    prop === 'name' ||
    prop === 'length') && (
    isA('Function', object) || isA('AsyncFunction', object)) ||
    (prop === 'source' ||
    prop === 'global' ||
    prop === 'ignoreCase' ||
    prop === 'multiline') &&
    isA('RegExp', object));

}

function getSlots(object) {
  var slots = {};
  if (!object) {
    return [];
  }

  var parent = (0, _getPrototypeOf2.default)(object);
  do {
    if (object === (0, _getPrototypeOf2.default)(Function)) {
      break;
    }
    var ownNames = (0, _getOwnPropertyNames2.default)(object);
    for (var i = 0; i < ownNames.length; i++) {
      var prop = ownNames[i];
      if (!isReadonlyProp(object, prop)) {
        var propDesc = (0, _getOwnPropertyDescriptor2.default)(object, prop);
        if (!propDesc.get || object.__esModule) {
          slots[prop] = true;
        }
      }
    }
    object = parent;
  } while (object && (parent = (0, _getPrototypeOf2.default)(object)) !== null);
  return (0, _keys2.default)(slots);
}var

ModuleMockerClass = function () {





  /**
                                  * @see README.md
                                  * @param global Global object of the test environment, used to create
                                  * mocks
                                  */
  function ModuleMockerClass(global) {(0, _classCallCheck3.default)(this, ModuleMockerClass);
    this._environmentGlobal = global;
    this._mockState = new _weakMap2.default();
    this._mockConfigRegistry = new _weakMap2.default();
    this.ModuleMocker = ModuleMockerClass;
  }(0, _createClass3.default)(ModuleMockerClass, [{ key: '_ensureMockConfig', value: function _ensureMockConfig(

    f) {
      var config = this._mockConfigRegistry.get(f);
      if (!config) {
        config = this._defaultMockConfig();
        this._mockConfigRegistry.set(f, config);
      }
      return config;
    } }, { key: '_ensureMockState', value: function _ensureMockState(

    f) {
      var state = this._mockState.get(f);
      if (!state) {
        state = this._defaultMockState();
        this._mockState.set(f, state);
      }
      return state;
    } }, { key: '_defaultMockConfig', value: function _defaultMockConfig()

    {
      return {
        defaultReturnValue: undefined,
        isReturnValueLastSet: false,
        mockImpl: undefined,
        specificMockImpls: [],
        specificReturnValues: [] };

    } }, { key: '_defaultMockState', value: function _defaultMockState()

    {
      return {
        calls: [],
        instances: [] };

    } }, { key: '_makeComponent', value: function _makeComponent(

    metadata, restore) {var _this2 = this;
      if (metadata.type === 'object') {
        return new this._environmentGlobal.Object();
      } else if (metadata.type === 'array') {
        return new this._environmentGlobal.Array();
      } else if (metadata.type === 'regexp') {
        return new this._environmentGlobal.RegExp('');
      } else if (
      metadata.type === 'constant' ||
      metadata.type === 'collection' ||
      metadata.type === 'null' ||
      metadata.type === 'undefined')
      {
        return metadata.value;
      } else if (metadata.type === 'function') {
        /* eslint-disable prefer-const */
        var f = void 0;
        /* eslint-enable prefer-const */

        var prototype = metadata.members &&
        metadata.members.prototype &&
        metadata.members.prototype.members || {};
        var prototypeSlots = getSlots(prototype);
        var mocker = this;
        var mockConstructor = function mockConstructor() {var _this = this;
          var mockState = mocker._ensureMockState(f);
          var mockConfig = mocker._ensureMockConfig(f);
          mockState.instances.push(this);
          mockState.calls.push(Array.prototype.slice.call(arguments));
          if (this instanceof f) {
            // This is probably being called as a constructor
            prototypeSlots.forEach(function (slot) {
              // Copy prototype methods to the instance to make
              // it easier to interact with mock instance call and
              // return values
              if (prototype[slot].type === 'function') {
                var protoImpl = _this[slot];
                _this[slot] = mocker.generateFromMetadata(prototype[slot]);
                _this[slot]._protoImpl = protoImpl;
              }
            });

            // Run the mock constructor implementation
            return (
              mockConfig.mockImpl && mockConfig.mockImpl.apply(this, arguments));

          }

          var returnValue = void 0;
          // If return value is last set, either specific or default, i.e.
          // mockReturnValueOnce()/mockReturnValue() is called and no
          // mockImplementationOnce()/mockImplementation() is called after that.
          // use the set return value.
          if (mockConfig.isReturnValueLastSet) {
            returnValue = mockConfig.specificReturnValues.shift();
            if (returnValue === undefined) {
              returnValue = mockConfig.defaultReturnValue;
            }

            return returnValue;
          }

          // If mockImplementationOnce()/mockImplementation() is last set,
          // or specific return values are used up, use the mock implementation.
          var specificMockImpl = void 0;
          if (returnValue === undefined) {
            specificMockImpl = mockConfig.specificMockImpls.shift();
            if (specificMockImpl === undefined) {
              specificMockImpl = mockConfig.mockImpl;
            }
            if (specificMockImpl) {
              return specificMockImpl.apply(this, arguments);
            }
          }

          // Otherwise use prototype implementation
          if (returnValue === undefined && f._protoImpl) {
            return f._protoImpl.apply(this, arguments);
          }

          return returnValue;
        };

        f = this._createMockFunction(metadata, mockConstructor);
        f._isMockFunction = true;
        f.getMockImplementation = function () {return _this2._ensureMockConfig(f).mockImpl;};

        this._mockState.set(f, this._defaultMockState());
        this._mockConfigRegistry.set(f, this._defaultMockConfig());

        // $FlowFixMe - defineProperty getters not supported
        Object.defineProperty(f, 'mock', {
          configurable: false,
          enumerable: true,
          get: function get() {return _this2._ensureMockState(f);},
          set: function set(val) {return _this2._mockState.set(f, val);} });


        f.mockClear = function () {
          _this2._mockState.delete(f);
        };

        f.mockReset = function () {
          _this2._mockState.delete(f);
          _this2._mockConfigRegistry.delete(f);
        };

        f.mockReturnValueOnce = function (value) {
          // next function call will return this value or default return value
          var mockConfig = _this2._ensureMockConfig(f);
          mockConfig.isReturnValueLastSet = true;
          mockConfig.specificReturnValues.push(value);
          return f;
        };

        f.mockReturnValue = function (value) {
          // next function call will return specified return value or this one
          var mockConfig = _this2._ensureMockConfig(f);
          mockConfig.isReturnValueLastSet = true;
          mockConfig.defaultReturnValue = value;
          return f;
        };

        f.mockImplementationOnce = function (fn) {
          // next function call will use this mock implementation return value
          // or default mock implementation return value
          var mockConfig = _this2._ensureMockConfig(f);
          mockConfig.isReturnValueLastSet = false;
          mockConfig.specificMockImpls.push(fn);
          return f;
        };

        f.mockImplementation = function (fn) {
          // next function call will use mock implementation return value
          var mockConfig = _this2._ensureMockConfig(f);
          mockConfig.isReturnValueLastSet = false;
          mockConfig.mockImpl = fn;
          return f;
        };

        f.mockReturnThis = function () {return (
            f.mockImplementation(function () {
              return this;
            }));};

        if (metadata.mockImpl) {
          f.mockImplementation(metadata.mockImpl);
        }

        f.mockRestore = restore ? restore : function () {};

        return f;
      } else {
        var unknownType = metadata.type || 'undefined type';
        throw new Error('Unrecognized type ' + unknownType);
      }
    } }, { key: '_createMockFunction', value: function _createMockFunction(


    metadata,
    mockConstructor)
    {
      var name = metadata.name;
      // Special case functions named `mockConstructor` to guard for infinite
      // loops.
      if (!name || name === MOCK_CONSTRUCTOR_NAME) {
        return mockConstructor;
      }

      // Preserve `name` property of mocked function.
      var boundFunctionPrefix = 'bound ';
      var bindCall = '';
      // if-do-while for perf reasons. The common case is for the if to fail.
      if (name && name.startsWith(boundFunctionPrefix)) {
        do {
          name = name.substring(boundFunctionPrefix.length);
          // Call bind() just to alter the function name.
          bindCall = '.bind(null)';
        } while (name && name.startsWith(boundFunctionPrefix));
      }

      // It's a syntax error to define functions with a reserved keyword
      // as name.
      if (RESERVED_KEYWORDS[name]) {
        name = '$' + name;
      }

      // It's also a syntax error to define a function with a reserved character
      // as part of it's name.
      if (/[\s-]/.test(name)) {
        name = name.replace(/[\s-]/g, '$');
      }

      var body =
      'return function ' +
      name +
      '() {' +
      'return ' +
      MOCK_CONSTRUCTOR_NAME +
      '.apply(this,arguments);' +
      '}' +
      bindCall;
      var createConstructor = new this._environmentGlobal.Function(
      MOCK_CONSTRUCTOR_NAME,
      body);

      return createConstructor(mockConstructor);
    } }, { key: '_generateMock', value: function _generateMock(


    metadata,
    callbacks,
    refs)
    {var _this3 = this;
      var mock = this._makeComponent(metadata);
      if (metadata.refID != null) {
        refs[metadata.refID] = mock;
      }

      getSlots(metadata.members).forEach(function (slot) {
        var slotMetadata = metadata.members && metadata.members[slot] || {};
        if (slotMetadata.ref != null) {
          callbacks.push(function () {return mock[slot] = refs[slotMetadata.ref];});
        } else {
          mock[slot] = _this3._generateMock(slotMetadata, callbacks, refs);
        }
      });

      if (
      metadata.type !== 'undefined' &&
      metadata.type !== 'null' &&
      mock.prototype)
      {
        mock.prototype.constructor = mock;
      }

      return mock;
    }

    /**
       * @see README.md
       * @param metadata Metadata for the mock in the schema returned by the
       * getMetadata method of this module.
       */ }, { key: 'generateFromMetadata', value: function generateFromMetadata(
    _metadata) {
      var callbacks = [];
      var refs = {};
      var mock = this._generateMock(_metadata, callbacks, refs);
      callbacks.forEach(function (setter) {return setter();});
      return mock;
    }

    /**
       * @see README.md
       * @param component The component for which to retrieve metadata.
       */ }, { key: 'getMetadata', value: function getMetadata(
    component, _refs) {var _this4 = this;
      var refs = _refs || new _map2.default();
      var ref = refs.get(component);
      if (ref != null) {
        return { ref: ref };
      }

      var type = getType(component);
      if (!type) {
        return null;
      }

      var metadata = { type: type };
      if (
      type === 'constant' ||
      type === 'collection' ||
      type === 'undefined' ||
      type === 'null')
      {
        metadata.value = component;
        return metadata;
      } else if (type === 'function') {
        metadata.name = component.name;
        if (component._isMockFunction) {
          metadata.mockImpl = component.getMockImplementation();
        }
      }

      metadata.refID = refs.size;
      refs.set(component, metadata.refID);

      var members = null;
      // Leave arrays alone
      if (type !== 'array') {
        if (type !== 'undefined') {
          getSlots(component).forEach(function (slot) {
            if (
            type === 'function' &&
            component._isMockFunction &&
            slot.match(/^mock/))
            {
              return;
            }

            if (
            !component.hasOwnProperty && component[slot] !== undefined ||
            component.hasOwnProperty && component.hasOwnProperty(slot) ||
            type === 'object' && component[slot] != Object.prototype[slot])
            {
              var slotMetadata = _this4.getMetadata(component[slot], refs);
              if (slotMetadata) {
                if (!members) {
                  members = {};
                }
                members[slot] = slotMetadata;
              }
            }
          });
        }

        // If component is native code function, prototype might be undefined
        if (type === 'function' && component.prototype) {
          var prototype = this.getMetadata(component.prototype, refs);
          if (prototype && prototype.members) {
            if (!members) {
              members = {};
            }
            members.prototype = prototype;
          }
        }
      }

      if (members) {
        metadata.members = members;
      }

      return metadata;
    } }, { key: 'isMockFunction', value: function isMockFunction(

    fn) {
      return !!fn._isMockFunction;
    } }, { key: 'fn', value: function fn(

    implementation) {
      var fn = this._makeComponent({ type: 'function' });
      if (implementation) {
        fn.mockImplementation(implementation);
      }
      return fn;
    } }, { key: 'spyOn', value: function spyOn(

    object, methodName) {
      var original = object[methodName];

      if (!this.isMockFunction(original)) {
        if (typeof original !== 'function') {
          throw new Error(
          'Cannot spyOn the ' + methodName + ' property; it is not a function');

        }

        object[methodName] = this._makeComponent({ type: 'function' }, function () {
          object[methodName] = original;
        });
        object[methodName].mockImplementation(function () {
          return original.apply(this, arguments);
        });
      }

      return object[methodName];
    } }, { key: 'clearAllMocks', value: function clearAllMocks()

    {
      this._mockState = new _weakMap2.default();
    } }, { key: 'resetAllMocks', value: function resetAllMocks()

    {
      this._mockConfigRegistry = new _weakMap2.default();
      this._mockState = new _weakMap2.default();
    } }]);return ModuleMockerClass;}();



module.exports = new ModuleMockerClass(global);