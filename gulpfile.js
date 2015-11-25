/**
*   gulpfile.js
*   @author Ulrik Moe. Copyright (c) 2015.
*   @license GPLv3
*
*   Indentation: 3 spaces
*   Conventions: https://github.com/airbnb/javascript
**/

const gulp = require('gulp');
const gutil = require('gulp-util');
const connect = require('gulp-connect');
const uglify = require('gulp-uglify');
const nunjucks = require('gulp-nunjucks-html');
const htmlmin = require('gulp-htmlmin');
const less = require('gulp-less');
const minifyCSS = require('gulp-minify-css');
const concat = require('gulp-concat');

const config = {
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

//  Last changed
const monthNames = ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"];
const datetime = new Date();
const day = datetime.getDate();
const month = datetime.getMonth();
const year = datetime.getFullYear();
const lastUpdate = day + ". " + monthNames[month] + " " + year;

//  Gulp tasks
function webserver() {
   connect.server({
      root: 'www',
      livereload: config.dev,
      port: 9000
   });
}

function webserver() {
   connect.server({ root: 'www', livereload:config.dev, port: 9000 });
}


function assets() {
   return gulp.src(['src/fonts/**','src/img/**'], { base: './src/' })
      .pipe(gulp.dest('www'));
}

function scripts() {
   return gulp.src(['src/js/*.js'])
      .pipe(concat('all.js'))
      .pipe(!config.dev ? uglify(config.uglify) : gutil.noop())
      .pipe(gulp.dest('www'));
}

function less2css() {
   return gulp.src(['src/css/*.less'])
      .pipe(less())
      .pipe(!config.dev ? minifyCSS() : gutil.noop())
      .pipe(gulp.dest('www'));
}

function html() {
   return gulp.src(['src/*.html'])
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
   gulp.watch(['src/css/*.less'], less2css);
   gulp.watch(['src/fonts/**','src/img/**'], assets);
   gulp.watch(['src/*.html'], html);
   gulp.watch(['src/js/*.js'], scripts);
   gulp.watch(['www/*.{js,css}'], html);
}

gulp.task('build', gulp.series(assets, scripts, less2css, html));
gulp.task('default', gulp.series(assets, scripts, less2css, html,
   gulp.parallel(stalker, webserver)
));
