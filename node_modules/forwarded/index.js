/*!
 * forwarded
 * Copyright(c) 2014 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

/**
 * Simple expression to split token list.
 * @private
 */

var TOKEN_LIST_REGEXP = / *, */

/**
 * Module exports.
 * @public
 */

module.exports = forwarded

/**
 * Get all addresses in the request, using the `X-Forwarded-For` header.
 *
 * @param {object} req
 * @return {array}
 * @public
 */

function forwarded (req) {
  if (!req) {
    throw new TypeError('argument req is required')
  }

  // simple header parsing
  var proxyAddrs = (req.headers['x-forwarded-for'] || '')
    .trim()
    .split(TOKEN_LIST_REGEXP)
    .filter(Boolean)
    .reverse()
  var socketAddr = req.connection.remoteAddress
  var addrs = [socketAddr].concat(proxyAddrs)

  // return all addresses
  return addrs
}
