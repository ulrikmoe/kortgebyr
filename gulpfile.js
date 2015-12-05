/**
*   @author Ulrik Moe
*   @license GPLv3
*
*   Indentation: 3 spaces
*   Conventions: https://github.com/airbnb/javascript
*
*   Use 'gulp clean' to delete everything.
*   Use 'gulp --dev' for development mode.
*   Use 'gulp build --lang sv' to build in a specific lang
**/

var gulp = require('gulp');
var gutil = require('gulp-util');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var nunjucks = require('gulp-nunjucks-html');
var htmlmin = require('gulp-htmlmin');
var del = require('del');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');

var config = {
   lang: (gutil.env.lang ? gutil.env.lang : 'da'),
   dev: !!gutil.env.dev,
   htmlmin: {
      removeComments: true,
      collapseWhitespace: true,
      minifyJS: true
   },
   uglify: {
      mangle: {
         sort: true,
         toplevel: false // shorten function names etc.
      }
   }
};

var paths = {
   html: 'src/**/*.html',
   js: 'src/js/*.js',
   less: 'src/css/*.less',
   assets: ['src/fonts/**','src/img/**']
};

//  Last changed
var monthNames = ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"];
var date = new Date();
var lastUpdate = date.getDate() + ". " + monthNames[date.getMonth()] + " " + date.getFullYear();

// Gulp tasks
function clean() { return del(['www/**', '!www']); }
function server() { connect.server({ root: 'www', livereload: true }); }

function assets() {
   return gulp.src(paths.assets, {base:'src', since: gulp.lastRun(assets)})
      .pipe(gulp.dest('www'))
      .pipe(connect.reload());
}

function scripts() {
   return gulp.src(paths.js, {since: gulp.lastRun(scripts)})
      .pipe(!config.dev ? uglify(config.uglify) : gutil.noop())
      .pipe(gulp.dest('www'));
}

function less2css() {
   return gulp.src(paths.less, {since: gulp.lastRun(less2css)})
      .pipe(less())
      .pipe(!config.dev ? minifyCSS() : gutil.noop())
      .pipe(gulp.dest('www'));
}

function html() {
   return gulp.src(paths.html)
      .pipe(nunjucks({
         searchPaths: ['www/'],
         locals: { lastUpdate: lastUpdate }
      }))
      .pipe(!config.dev ? htmlmin(config.htmlmin) : gutil.noop())
      .pipe(gulp.dest('www'))
      .pipe(connect.reload());
}

function stalker() {
   gulp.watch(paths.assets, assets);
   gulp.watch(paths.html, html);
   gulp.watch(paths.less, gulp.series(less2css, html));
   gulp.watch(paths.js, gulp.series(scripts, html));
}

gulp.task(clean);
gulp.task('build', gulp.series(assets, scripts, less2css, html));
gulp.task('default', gulp.series(
   clean, assets, scripts, less2css, html,
   gulp.parallel(stalker, server)
));
