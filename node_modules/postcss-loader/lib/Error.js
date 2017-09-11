'use strict'

class SyntaxError extends Error {
  constructor (err) {
    super(err)

    this.err = err.input.source

    this.name = 'Syntax Error'
    this.message = ''

    if (err.line) {
      this.message += `${this.name} \n\n(${err.line}:${err.column}) ${err.reason}`
    }

    if (err.input.source) {
      this.message += `\n\n${err.showSourceCode()}\n`
    }

    this.stack = false
  }
}

module.exports = SyntaxError
