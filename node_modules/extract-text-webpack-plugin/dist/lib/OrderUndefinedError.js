'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function OrderUndefinedError(module) {
  Error.call(this);
  Error.captureStackTrace(this, OrderUndefinedError);
  this.name = 'OrderUndefinedError';
  this.message = 'Order in extracted chunk undefined';
  this.module = module;
}
exports.default = OrderUndefinedError;


OrderUndefinedError.prototype = Object.create(Error.prototype);