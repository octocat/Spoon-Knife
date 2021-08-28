'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTetherAttachments = getTetherAttachments;
exports.getScrollbarWidth = getScrollbarWidth;
exports.setScrollbarWidth = setScrollbarWidth;
exports.isBodyOverflowing = isBodyOverflowing;
exports.getOriginalBodyPadding = getOriginalBodyPadding;
exports.conditionallyUpdateScrollbar = conditionallyUpdateScrollbar;
exports.mapToCssModules = mapToCssModules;
exports.omit = omit;
function getTetherAttachments(placement) {
  var attachments = {};
  switch (placement) {
    case 'top':
    case 'top center':
      attachments = {
        attachment: 'bottom center',
        targetAttachment: 'top center'
      };
      break;
    case 'bottom':
    case 'bottom center':
      attachments = {
        attachment: 'top center',
        targetAttachment: 'bottom center'
      };
      break;
    case 'left':
    case 'left center':
      attachments = {
        attachment: 'middle right',
        targetAttachment: 'middle left'
      };
      break;
    case 'right':
    case 'right center':
      attachments = {
        attachment: 'middle left',
        targetAttachment: 'middle right'
      };
      break;
    case 'top left':
      attachments = {
        attachment: 'bottom left',
        targetAttachment: 'top left'
      };
      break;
    case 'top right':
      attachments = {
        attachment: 'bottom right',
        targetAttachment: 'top right'
      };
      break;
    case 'bottom left':
      attachments = {
        attachment: 'top left',
        targetAttachment: 'bottom left'
      };
      break;
    case 'bottom right':
      attachments = {
        attachment: 'top right',
        targetAttachment: 'bottom right'
      };
      break;
    case 'right top':
      attachments = {
        attachment: 'top left',
        targetAttachment: 'top right'
      };
      break;
    case 'right bottom':
      attachments = {
        attachment: 'bottom left',
        targetAttachment: 'bottom right'
      };
      break;
    case 'left top':
      attachments = {
        attachment: 'top right',
        targetAttachment: 'top left'
      };
      break;
    case 'left bottom':
      attachments = {
        attachment: 'bottom right',
        targetAttachment: 'bottom left'
      };
      break;
    default:
      attachments = {
        attachment: 'top center',
        targetAttachment: 'bottom center'
      };
  }

  return attachments;
}

var tetherAttachements = exports.tetherAttachements = ['top', 'bottom', 'left', 'right', 'top left', 'top center', 'top right', 'right top', 'right middle', 'right bottom', 'bottom right', 'bottom center', 'bottom left', 'left top', 'left middle', 'left bottom'];

// https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.4/js/src/modal.js#L436-L443
function getScrollbarWidth() {
  var scrollDiv = document.createElement('div');
  // .modal-scrollbar-measure styles // https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.4/scss/_modal.scss#L106-L113
  scrollDiv.style.position = 'absolute';
  scrollDiv.style.top = '-9999px';
  scrollDiv.style.width = '50px';
  scrollDiv.style.height = '50px';
  scrollDiv.style.overflow = 'scroll';
  document.body.appendChild(scrollDiv);
  var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
}

function setScrollbarWidth(padding) {
  document.body.style.paddingRight = padding > 0 ? padding + 'px' : null;
}

function isBodyOverflowing() {
  return document.body.clientWidth < window.innerWidth;
}

function getOriginalBodyPadding() {
  return parseInt(window.getComputedStyle(document.body, null).getPropertyValue('padding-right') || 0, 10);
}

function conditionallyUpdateScrollbar() {
  var scrollbarWidth = getScrollbarWidth();
  // https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.4/js/src/modal.js#L420
  var fixedContent = document.querySelectorAll('.navbar-fixed-top, .navbar-fixed-bottom, .is-fixed')[0];
  var bodyPadding = fixedContent ? parseInt(fixedContent.style.paddingRight || 0, 10) : 0;

  if (isBodyOverflowing()) {
    setScrollbarWidth(bodyPadding + scrollbarWidth);
  }
}

function mapToCssModules(className, cssModule) {
  if (!cssModule) return className;
  return className.split(' ').map(function (c) {
    return cssModule[c] || c;
  }).join(' ');
}

/**
 * Returns a new object with the key/value pairs from `obj` that are not in the array `omitKeys`.
 */
function omit(obj, omitKeys) {
  var result = {};
  Object.keys(obj).forEach(function (key) {
    if (omitKeys.indexOf(key) === -1) {
      result[key] = obj[key];
    }
  });
  return result;
}