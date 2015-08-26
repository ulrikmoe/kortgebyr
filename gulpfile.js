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
var connect = require('gulp-connect');
var gzip = require('gulp-gzip');


// Constants
var compress = false;
var localize = false;
var i18n = ['da', 'sv', 'no', 'fi', 'ee', 'lv', 'lt'];
var paths = {
   dest: '_site',
   html: 'src/*.html',
   scripts: 'src/js/*.js',
   less: 'src/less/global.less',
   assets: ['src/assets/**', '!src/assets/img/{psp,psp/**.svg}'],
   svgs: 'src/assets/img/psp/**.svg',
   rebuild: ['_site/kortgebyr.js', '_site/data.js', '_site/global.css']
};

var monthNames = ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"];
var datetime = new Date();
var day = datetime.getDate();
var month = datetime.getMonth();
var year = datetime.getFullYear();
var lastUpdate = day + ". " + monthNames[month] + " " + year;

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

var middleman = function (req, res, next) {
   var url = req.url;
   var ext = url.substr(url.lastIndexOf('.')+1);
   if (ext == "svg" || ext == "gz" || ext == "svgz") {
      res.setHeader('Content-Encoding', 'gzip');
   }
   next();
};

// Delete
gulp.task('clean', function(callback) {
   del([paths.dest], callback);
});

// Webserver at port 9000
gulp.task('serve', ['build'], function() {
   connect.server({
      root: paths.dest,
      livereload: true,
      port: 9000,
      middleware: function () {
         return [middleman];
      }
   });
});

// Copy /assets/ folder to _site/
gulp.task('assets', function() {
   return gulp.src(paths.assets)
      .pipe(gulp.dest(paths.dest + '/assets/'));
});

// Copy and gzip all psp logos
gulp.task('svgz', function() {
   return gulp.src(paths.svgs)
      .pipe(gzip({
         gzipOptions: { level: 9 },
         append: false
      }))
      .on('error', errorHandler)
      .pipe(gulp.dest(paths.dest + '/assets/img/psp/'));
});


// Minify JavaScript and move to _site/
gulp.task('scripts', function() {
   return gulp.src(paths.scripts)
      //.pipe(uglify(uglifyOpts))
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
      .pipe(nunjucks({searchPaths: ['_site/'], locals: { lastUpdate: lastUpdate }}))
      .pipe(htmlmin(htmlminOpts))
      .on('error', errorHandler)
      .pipe(gulp.dest(paths.dest))
      .pipe(connect.reload());
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
   runSequence('clean', ['assets', 'scripts', 'less'], 'svgz', 'html', callback);
});

gulp.task('default', ['build', 'serve', 'watch']);

// Handle the error
function errorHandler (error) {
   console.log(error.toString());
   this.emit('end');
}
