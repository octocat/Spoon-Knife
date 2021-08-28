var del         = require('del');
var gulp        = require('gulp');
var bump        = require('gulp-bump');
var header      = require('gulp-header');
var minify      = require('gulp-minify-css');
var plumber     = require('gulp-plumber');
var prefixer    = require('gulp-autoprefixer');
var rename      = require('gulp-rename');
var uglify      = require('gulp-uglify');
var sass        = require('gulp-sass');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');

// Variables
var distDir = './dist';
var pkg = require('./package.json');
var banner = ['/*!', pkg.name, pkg.version, '*/\n'].join(' ');


// Clean
gulp.task('clean', function() {
  del.sync([distDir]);
});


// Javascript
gulp.task('js', function() {
  browserify({
    entries: [
      './src/js/tether.js'
    ],
    standalone: 'Tether',
    transform: ['babelify']
  }).bundle()
    .pipe(plumber())
    .pipe(source('tether.js'))
    .pipe(buffer())
    .pipe(header(banner))

    // Original
    .pipe(gulp.dest(distDir + '/js'))

    // Minified
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(distDir + '/js'));
});


// CSS
gulp.task('css', function() {
  gulp.src('./src/css/**/*.sass')
    .pipe(plumber())
    .pipe(sass())
    .pipe(prefixer())

    // Original
    .pipe(gulp.dest(distDir + '/css'))

    // Minified
    .pipe(minify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(distDir + '/css'));
});


// Version bump
var VERSIONS = ['patch', 'minor', 'major'];
for (var i = 0; i < VERSIONS.length; ++i){
  (function(version) {
    gulp.task('version:' + version, function() {
      gulp.src(['package.json', 'bower.json', 'component.json'])
        .pipe(bump({type: version}))
        .pipe(gulp.dest('.'));
    });
  })(VERSIONS[i]);
}


// Watch
gulp.task('watch', ['js', 'css'], function() {
  gulp.watch('./src/js/**/*', ['js']);
  gulp.watch('./src/css/**/*', ['css']);
});


// Defaults
gulp.task('build', ['js', 'css']);
gulp.task('default', ['build']);

