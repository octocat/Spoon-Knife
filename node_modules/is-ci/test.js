'use strict'

var assert = require('assert')
var clearRequire = require('clear-require')

if (!process.env.TRAVIS) process.env.CI = 'true'

var isCI = require('./')
assert(isCI)

delete process.env.CI
delete process.env.CONTINUOUS_INTEGRATION

clearRequire('./')
clearRequire('ci-info')
isCI = require('./')
assert(!isCI)
