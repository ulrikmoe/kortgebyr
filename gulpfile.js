/**
*   @author Ulrik Moe
*   @license GPLv3
**/
'use strict';

const gulp = require('gulp');
const del = require('del');
const connect = require('gulp-connect');
const nunjucks = require('gulp-nunjucks-html');
const less = require('gulp-less');
const concat = require('gulp-concat');
const env = require('minimist')(process.argv.slice(2));

//  Last changed
const months = ['jan', 'feb', 'mar', 'apr', 'maj', 'juni', 'juli', 'aug', 'sept', 'okt', 'nov', 'dec'];
const date = new Date();
env.lastUpdate = date.getDate() + '. ' + months[date.getMonth()] + ', ' + date.getFullYear();

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
