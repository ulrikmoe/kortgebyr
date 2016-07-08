/**
*   @author Ulrik Moe
*   @license GPLv3
*
*   Indentation: 4 spaces
*   Conventions: https://github.com/airbnb/javascript
*
*   Use 'gulp --min'
**/
'use strict';

const gulp = require('gulp');
const del = require('del');
const gutil = require('gulp-util');
const connect = require('gulp-connect');
const nunjucks = require('gulp-nunjucks-html');
const less = require('gulp-less');
const concat = require('gulp-concat');

//  Last changed
const months = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'];
const date = new Date();

let env = gutil.env;
env.lastUpdate = date.getDate() + '. ' + months[date.getMonth()] + ' ' + date.getFullYear();

function server() { connect.server({ root: 'www', livereload: true }); }

function assets() {
    return gulp.src(['src/assets/**/*', 'src/*.{ico,xml}'], { since: gulp.lastRun(assets) })
    .pipe(gulp.dest('www'))
    .pipe(connect.reload());
}

function scripts() {
    return gulp.src(['src/js/data.js', 'src/js/kortgebyr.js'])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('www/js/'));
}

function less2css() {
    return gulp.src(['src/css/**/*'], { since: gulp.lastRun(less2css) })
    .pipe(less())
    .pipe(gulp.dest('www/css/'))
    .pipe(connect.reload());
}

function html() {
    return gulp.src(['src/**/*.html'])
    .pipe(nunjucks({ searchPaths: ['src/'], locals: env }))
    .pipe(gulp.dest('www'))
    .pipe(connect.reload());
}

function stalker() {
    gulp.watch(['src/assets/**/*'], assets);
    gulp.watch(['src/**/*.html'], html);
    gulp.watch(['src/css/*.less'], gulp.series(less2css, html));
    gulp.watch(['src/js/data.js', 'src/js/kortgebyr.js'], gulp.series(scripts, html));
    gulp.watch(['i18n/*.json'], gulp.series('build'));
}

gulp.task('clean', function () { return del(['www/**', '!www']); });
gulp.task('serve', gulp.parallel(stalker, server));
gulp.task('build', gulp.series(assets, scripts, less2css, html));
gulp.task('default', gulp.series('clean', 'build', 'serve'));
