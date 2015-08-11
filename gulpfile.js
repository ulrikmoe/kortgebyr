/**
 *   gulpfile.js
 *   @author Ulrik Moe. Copyright (c) 2015.
 *   @license GPLv3
 *
 *   Indentation: 3 spaces
 *   Conventions: https://github.com/airbnb/javascript
 **/

var gulp = require('gulp');
var gls = require('gulp-live-server');
var uglify = require('gulp-uglify'); // Javascript compressor
var nunjucks = require('gulp-nunjucks-html');
var htmlmin = require('gulp-htmlmin');
var del = require('del');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var runSequence = require('run-sequence');

// Constants
var compress = true;
var localize = false;
var i18n = ['da', 'sv', 'no', 'fi', 'ee', 'lv', 'lt'];
var paths = {
   dest: '_site',
   html: 'src/index.html',
   scripts: 'src/js/kortgebyr.js',
   less: 'src/less/global.less',
   assets: 'src/assets/**',
   rebuild: ['_site/kortgebyr.js', '_site/global.css']
};

// Options
var nunjucksOpts = {
   searchPaths: ['_site/']
   // grunt -> options: { data: grunt.file.readJSON('i18n/da.json') },
};

var uglifyOpts = {
   mangle: {
      sort: compress
      //toplevel: compress // shorten function names etc.
   },
   output: {
      beautify: !compress,
      ascii_only: true
   }
};
var htmlminOpts = {
   removeComments: compress,
   collapseWhitespace: compress,
   conservativeCollapse: false,
   preserveLineBreaks: false,
   removeScriptTypeAttributes: compress,
   removeEmptyAttributes: compress,
   removeEmptyElements: false
};

// Delete
gulp.task('clean', function(callback) {
   del([paths.dest], callback);
});

// Webserver at port 9000
gulp.task('serve', ['build'], function() {
   var server = gls.static(paths.dest, 9000);
   server.start();

   gulp.watch([paths.dest + '/index.html'], function() {
      server.notify.apply(server, arguments);
   });
});

// Copy /assets/ folder to _site/
gulp.task('assets', function() {
   return gulp.src(paths.assets).pipe(gulp.dest(paths.dest + '/assets/'));
});

// Minify JavaScript and move to _site/
gulp.task('scripts', function() {
   return gulp.src(paths.scripts)
      .pipe(uglify(uglifyOpts))
      .on('error', errorHandler)
      .pipe(gulp.dest(paths.dest));
});

// Less -> Minified CSS.
gulp.task('less', function() {
   return gulp.src(paths.less)
      .pipe(less())
      .pipe(minifyCSS())
      .on('error', errorHandler)
      .pipe(gulp.dest(paths.dest));
});

// Nunjucks -> HTML.
gulp.task('html', function() {
   return gulp.src(paths.html)
      .pipe(nunjucks(nunjucksOpts))
      .pipe(htmlmin(htmlminOpts))
      .on('error', errorHandler)
      .pipe(gulp.dest(paths.dest));
});

// Watch for changes.
gulp.task('watch', ['build'], function() {
   gulp.watch(paths.assets, ['assets']);
   gulp.watch(paths.html, ['html']);
   gulp.watch(paths.scripts, ['scripts']);
   gulp.watch(paths.less, ['less']);
   gulp.watch(paths.rebuild, ['html']);
});

gulp.task('build', function(callback) {
   runSequence('clean', ['assets', 'scripts', 'less'], 'html', callback);
});

gulp.task('default', ['build', 'serve', 'watch']);

// Handle the error
function errorHandler (error) {
   console.log(error.toString());
   this.emit('end');
}
