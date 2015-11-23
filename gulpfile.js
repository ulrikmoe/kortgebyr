/**
*   @author Ulrik Moe.
*   @license GPLv3
*
*   Indentation: 3 spaces
*   Conventions: https://github.com/airbnb/javascript
*
*   Use 'gulp clean' to delete everything.
*   Use 'gulp --dev' for development mode.
*   Use 'gulp build --lang sv' if you wish to build in a different language than danish.
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
var concat = require('gulp-concat');

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
         toplevel: true // shorten function names etc.
      }
   }
};

var paths = {
   html: 'src/*.html',
   js: 'src/js/*.js',
   less: 'src/css/*.less',
   rebuild: ['www/all.js', 'www/global.css'],
   assets: ['src/**/*.{pdf,png,svg,jpg,jpeg,woff,woff2,ico}']
};

// Last changed
var monthNames = ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"];
var datetime = new Date();
var day = datetime.getDate();
var month = datetime.getMonth();
var year = datetime.getFullYear();
var lastUpdate = day + ". " + monthNames[month] + " " + year;

// Gulp tasks
function clean(done) { return del(['www/**', '!www'], done); }
function assets() { return gulp.src(paths.assets).pipe( gulp.dest('www') ); }
function webserver() { connect.server({ root:'www', livereload:config.dev, port:9000 }); }

function scripts() {
   return gulp.src(paths.js)
      .pipe(concat('all.js'))
      .pipe(!config.dev ? uglify(config.uglify) : gutil.noop())
      .pipe(gulp.dest('www'));
}

function less2css() {
   return gulp.src(paths.less)
      .pipe(less())
      .pipe(!config.dev ? minifyCSS() : gutil.noop())
      .pipe(gulp.dest('www'));
}

function html() {
   return gulp.src(paths.html)
      .pipe(nunjucks({
         searchPaths: ['www/'],
         locals: {
            lastUpdate: lastUpdate
         }
      }))
      .pipe(!config.dev ? htmlmin(config.htmlmin) : gutil.noop())
      .pipe(gulp.dest('www'))
      .pipe(connect.reload());
}

function stalker() {
   gulp.watch(paths.less, less2css);
   gulp.watch(paths.assets, assets);
   gulp.watch(paths.html, html);
   gulp.watch(paths.js, scripts);
   gulp.watch(paths.rebuild, html);
}

gulp.task(clean);
gulp.task('build', gulp.series(
   gulp.parallel(assets, scripts, less2css),
   html
));
gulp.task('default', gulp.series(
   clean,
   gulp.parallel(assets, scripts, less2css),
   html,
   gulp.parallel(stalker, webserver)
));
