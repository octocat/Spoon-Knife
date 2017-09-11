/**
 * @fileoverview Prevent usage of setState in componentDidUpdate
 * @author Yannick Croissant
 */
'use strict';

var makeNoMethodSetStateRule = require('../util/makeNoMethodSetStateRule');

module.exports = makeNoMethodSetStateRule('componentDidUpdate');
