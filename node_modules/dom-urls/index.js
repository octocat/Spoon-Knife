'use strict';

var URI = require('urijs');

function URL(urlStr, base) {
  if (!urlStr) {
    throw new TypeError('You need to provide a URL');
  }

  this._url = URI(urlStr, base).normalize();

  if (!this._url.protocol()) {
    throw new SyntaxError('Failed to construct \'URL\': Invalid URL');
  }
}

URL.prototype = {
  toString: function () {
    return this.href;
  },

  get protocol() {
    // Spec wants the trailing colon. (See 5.2)
    return this._url.protocol() + ':';
  },

  set protocol(value) {
    // Strip the colon, including anything following it and replace it with a
    // single one.
    this._url.protocol(value.replace(/(\:.*)?$/, ':'));
  },

  get host() {
    return this._url.clone().normalizeHostname().host();
  },

  set host(value) {
    var partial = new URI('proto://' + value);
    var oldPort = this._url.port();

    // For some reason, we have to keep the port even though we override the
    // complete host (not just the hostname) to not have one according to the
    // spec.
    this._url.host(value);

    if (!partial.port()) {
      this._url.port(oldPort);
    }
  },

  get pathname() {
    return this._url.pathname();
  },

  set pathname(value) {
    this._url.pathname(value);
    this._url.normalizePathname();
  },

  get path() {
    return this._url.path();
  },

  set path(value) {
    this._url.path(value);
    this._url.normalizePath();
  },

  // Origin is a read-only attribute:
  // http://url.spec.whatwg.org/#api
  get origin() {
    // "Let uri-scheme be the scheme component of the URI,
    // converted to lowercase."
    var scheme = this._url.protocol().toLowerCase();

    var hostname = this._url.hostname().toLowerCase();

    var port = '';
    if (this._url._parts.port !== null &&
        this._url._parts.port !== URI.defaultPorts[this._url.protocol()]) {
      port = ':' + this._url.port();
    }

    return scheme + '://' + hostname + port;
  }
};

[
  'href',
  'hostname',
  'port',
  'search',
  'hash'
].forEach(function (property) {
  Object.defineProperty(URL.prototype, property, {
    get: function () {
      return this._url.clone().normalize()[property]();
    },
    set: function (value) {
      this._url[property](value);
    }
  });
});

module.exports = URL;
