'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = scrollTo;

var _offset = require('../query/offset');

var _offset2 = _interopRequireDefault(_offset);

var _height = require('../query/height');

var _height2 = _interopRequireDefault(_height);

var _scrollParent = require('../query/scrollParent');

var _scrollParent2 = _interopRequireDefault(_scrollParent);

var _scrollTop = require('../query/scrollTop');

var _scrollTop2 = _interopRequireDefault(_scrollTop);

var _requestAnimationFrame = require('./requestAnimationFrame');

var _requestAnimationFrame2 = _interopRequireDefault(_requestAnimationFrame);

var _isWindow = require('../query/isWindow');

var _isWindow2 = _interopRequireDefault(_isWindow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function scrollTo(selected, scrollParent) {
  var offset = (0, _offset2.default)(selected);
  var poff = { top: 0, left: 0 };
  var list = void 0,
      listScrollTop = void 0,
      selectedTop = void 0,
      isWin = void 0;
  var selectedHeight = void 0,
      listHeight = void 0,
      bottom = void 0;

  if (!selected) return;

  list = scrollParent || (0, _scrollParent2.default)(selected);
  isWin = (0, _isWindow2.default)(list);
  listScrollTop = (0, _scrollTop2.default)(list);

  listHeight = (0, _height2.default)(list, true);
  isWin = (0, _isWindow2.default)(list);

  if (!isWin) poff = (0, _offset2.default)(list);

  offset = {
    top: offset.top - poff.top,
    left: offset.left - poff.left,
    height: offset.height,
    width: offset.width
  };

  selectedHeight = offset.height;
  selectedTop = offset.top + (isWin ? 0 : listScrollTop);
  bottom = selectedTop + selectedHeight;

  listScrollTop = listScrollTop > selectedTop ? selectedTop : bottom > listScrollTop + listHeight ? bottom - listHeight : listScrollTop;

  var id = (0, _requestAnimationFrame2.default)(function () {
    return (0, _scrollTop2.default)(list, listScrollTop);
  });
  return function () {
    return _requestAnimationFrame2.default.cancel(id);
  };
}
module.exports = exports['default'];