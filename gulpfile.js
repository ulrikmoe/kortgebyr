/**
*   @author Ulrik Moe
*   @license GPLv3
**/
'use strict';

const gulp = require('gulp');
const connect = require('gulp-connect');
const nunjucks = require('gulp-nunjucks-html');
const less = require('gulp-less');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const env = require('minimist')(process.argv.slice(2));

//  Last changed
const months = ['jan', 'feb', 'mar', 'apr', 'maj', 'juni', 'juli', 'aug', 'sept', 'okt', 'nov', 'dec'];
const date = new Date();
env.lastUpdate = date.getDate() + '. ' + months[date.getMonth()] + ', ' + date.getFullYear();

function server() { connect.server({ root: 'www', livereload: true }); }

function assets() {
    return gulp.src(['src/img/**', 'src/font/*.*'], { base: 'src' })
    .pipe(gulp.dest('www'))
    .pipe(connect.reload());
}

function scripts() {
    return gulp.src(['src/js/data.js', 'src/js/currency.js', 'src/js/main.js'])
    .pipe(nunjucks({ locals: env }))
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('www/js/'))
    .pipe(connect.reload());
}

function less2css() {
    return gulp.src(['src/css/*.less'], { since: gulp.lastRun(less2css) })
    .pipe(nunjucks({ locals: env }))
    .pipe(less())
    .pipe(gulp.dest('www/css/'))
    .pipe(connect.reload());
}

function html() {
    return gulp.src(['src/*.html'])
    .pipe(nunjucks({ searchPaths: ['src/'], locals: env }))
    .pipe(gulp.dest('www'))
    .pipe(connect.reload());
}

function stalker() {
    gulp.watch(['src/img/**', 'src/font/*'], assets);
    gulp.watch(['src/*.html'], html);
    gulp.watch(['src/css/*.less'], gulp.series(less2css, html));
    gulp.watch(['src/js/*.js'], gulp.series(scripts, html));
    gulp.watch(['i18n/*.json'], gulp.series('build'));
}

gulp.task('serve', gulp.parallel(stalker, server));
gulp.task('build', gulp.series(assets, scripts, less2css, html));
gulp.task('default', gulp.series('build', 'serve'));
