module.exports = function() {
  var lines = [ '- This is an example of Node.js code',
                '- You can run it with ',
                '  node .',
                'or',
                '  node src/example.js',
                'from your shell.'
              ];
  lines.forEach(function(line) { console.log(line); })
}()
