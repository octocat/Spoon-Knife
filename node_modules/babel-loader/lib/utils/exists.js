"use strict";

module.exports = function (fileSystem, filename) {
  var exists = false;

  try {
    exists = fileSystem.statSync(filename).isFile();
  } catch (e) {}

  return exists;
};