module.exports = function(grunt) {
    grunt.initConfig({
     lint: {
      files: ['hello.js']
    }
  });
  grunt.registerTask('default', 'lint');
  grunt.registerTask('travis', 'lint');
};
