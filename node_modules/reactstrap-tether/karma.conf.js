module.exports = function (config) {
  config.set({
    frameworks: ['mocha', 'browserify'],
    files: [
      'test/**/*.js'
    ],
    preprocessors: {
      'test/**/*.js': 'browserify'
    },
    browserify: {
      debug: true,
      transform: ['babelify']
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome'],
    singleRun: true,
    concurrency: Infinity
  });
};
