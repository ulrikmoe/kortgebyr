/**
*   gulpfile.js
*   @author Ulrik Moe. Copyright (c) 2015.
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
   dest: 'www',
   html: 'src/*.html',
   scripts: 'src/js/*.js',
   less: 'src/css/*.less',
   rebuild: ['www/all.js', 'www/global.css'],
   assets: ['src/fonts/**','src/img/**']
};

// Last changed
var monthNames = ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"];
var datetime = new Date();
var day = datetime.getDate();
var month = datetime.getMonth();
var year = datetime.getFullYear();
var lastUpdate = day + ". " + monthNames[month] + " " + year;

// Call with 'gulp clean'
function clean(done) {
   del([paths.dest], done);
}

function webserver() {
   connect.server({
      root: paths.dest,
      livereload: config.dev,
      port: 9000
   });
}

function assets() {
   return gulp.src(paths.assets, { base: './src/' })
      .pipe(gulp.dest(paths.dest));
}

function scripts() {
   return gulp.src(paths.scripts, { base: paths.src })
      .pipe(concat('all.js'))
      .pipe(!config.dev ? uglify(config.uglify) : gutil.noop())
      .pipe(gulp.dest(paths.dest));
}

function less2css() {
   return gulp.src(paths.less, { base: paths.src })
      .pipe(less())
      .pipe(!config.dev ? minifyCSS() : gutil.noop())
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
      .pipe(!config.dev ? htmlmin(config.htmlmin) : gutil.noop())
      .pipe(gulp.dest(paths.dest))
      .pipe(connect.reload());
}

function stalker() {
   gulp.watch(paths.less, less2css);
   gulp.watch(paths.assets, assets);
   gulp.watch(paths.html, html);
   gulp.watch(paths.scripts, scripts);
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
