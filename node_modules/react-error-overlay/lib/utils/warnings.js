

function stripInlineStacktrace(message) {
  return message.split('\n').filter(function (line) {
    return !line.match(/^\s*in/);
  }).join('\n'); // "  in Foo"
} /**
   * Copyright (c) 2015-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   */

function massage(warning, frames) {
  var message = stripInlineStacktrace(warning);

  // Reassemble the stack with full filenames provided by React
  var stack = '';
  var lastFilename = void 0;
  var lastLineNumber = void 0;
  for (var index = 0; index < frames.length; ++index) {
    var _frames$index = frames[index],
        fileName = _frames$index.fileName,
        lineNumber = _frames$index.lineNumber;

    if (fileName == null || lineNumber == null) {
      continue;
    }

    // TODO: instead, collapse them in the UI
    if (fileName === lastFilename && typeof lineNumber === 'number' && typeof lastLineNumber === 'number' && Math.abs(lineNumber - lastLineNumber) < 3) {
      continue;
    }
    lastFilename = fileName;
    lastLineNumber = lineNumber;

    var name = frames[index].name;

    name = name || '(anonymous function)';
    stack += 'in ' + name + ' (at ' + fileName + ':' + lineNumber + ')\n';
  }

  return { message: message, stack: stack };
}

export { massage };