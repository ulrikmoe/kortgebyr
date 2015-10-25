/**
 *   gulpfile.js
 *   @author Ulrik Moe. Copyright (c) 2015.
 *   @license GPLv3
 *
 *   Indentation: 3 spaces
 *   Conventions: https://github.com/airbnb/javascript
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
var gzip = require('gulp-gzip');
var concat = require('gulp-concat');
var rename = require("gulp-rename");

// Use 'gulp --dev' for development mode (uncompressed code)
var config = {
   production: !gutil.env.dev,
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
   dest: 'www',
   html: 'src/*.html',
   scripts: 'src/js/*.js',
   less: 'src/css/*.less',
   assets: ['src/assets/**/*.{svg,png,woff,woff2}'],
   rebuild: ['www/all.js', 'www/global.css'],
   gzip: ['www/**/*.{html,svg}']
};

// Last changed
var monthNames = ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"];
var datetime = new Date();
var day = datetime.getDate();
var month = datetime.getMonth();
var year = datetime.getFullYear();
var lastUpdate = day + ". " + monthNames[month] + " " + year;

// Gulp functions/tasks
function clean(done) {
   del([paths.dest], done);
}

function webserver() {
   connect.server({
      root: paths.dest,
      livereload: !config.production,
      port: 9000
   });
}

function assets() {
   return gulp.src(paths.assets, { base: paths.src })
      .pipe(gulp.dest(paths.dest + "/assets/"));
}

function scripts() {
   return gulp.src(paths.scripts, { base: paths.src })
      .pipe(concat('all.js'))
      .pipe(config.production ? uglify(config.uglify) : gutil.noop())
      .pipe(gulp.dest(paths.dest));
}

function less2css() {
   return gulp.src(paths.less, { base: paths.src })
      .pipe(less())
      .pipe(config.production ? minifyCSS() : gutil.noop())
      .pipe(gulp.dest(paths.dest));
}

function html() {
   return gulp.src(paths.html, { base: paths.src })
      .pipe(nunjucks({
         searchPaths: ['www/'],
         locals: {
            lastUpdate: lastUpdate
         }
      }))
      .pipe(config.production ? htmlmin(config.htmlmin) : gutil.noop())
      .pipe(gulp.dest(paths.dest))
      .pipe(connect.reload());
}

function gz() {
   return gulp.src(paths.gzip)
      .pipe(gzip({
         gzipOptions: { level: 9 },
         append: true
      }))
      .pipe(gulp.dest(paths.dest));
}

function stalker() {
   gulp.watch(paths.less, less2css);
   gulp.watch(paths.assets, assets);
   gulp.watch(paths.html, html);
   gulp.watch(paths.scripts, scripts);
   gulp.watch(paths.rebuild, html);
}

gulp.task('default', gulp.series(clean, assets, scripts, less2css, html, gz, gulp.parallel(stalker, webserver)));
