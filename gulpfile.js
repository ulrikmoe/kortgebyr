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
const uglify = require('gulp-uglify');
const nunjucks = require('gulp-nunjucks-html');
const htmlmin = require('gulp-htmlmin');
const less = require('gulp-less');
const nano = require('gulp-cssnano');
const babel = require('gulp-babel');
const concat = require('gulp-concat');

//  Last changed
const months = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'];
const date = new Date();
const updated = date.getDate() + '. ' + months[date.getMonth()] + ' ' + date.getFullYear();

// Global variables
const config = {
    htmlmin: { removeComments: true, collapseWhitespace: true },
    uglify: {
        mangle: { sort: true, toplevel: true },
        compress: {
            drop_console: true,
            loops: false,
            unused: false
        }
    },
    babel: {
        plugins: ['transform-es2015-block-scoping', 'transform-es2015-shorthand-properties', 'transform-es2015-for-of']
    },
    nunjucks: {
        searchPaths: ['www/'],
        locals: { lastUpdate: updated }
    }
};

function server() { connect.server({ root: 'www', livereload: !gutil.env.min }); }

function assets() {
    return gulp.src(['src/assets/**/*'], { base: 'src/assets', since: gulp.lastRun(assets) })
    .pipe(gulp.dest('www'))
    .pipe(connect.reload());
}

function scripts() {
    return gulp.src(['src/js/data.js', 'src/js/kortgebyr.js'])
    .pipe(gutil.env.min ? babel(config.babel) : gutil.noop())
    .pipe(concat('all.js'))
    .pipe(gutil.env.min ? uglify(config.uglify) : gutil.noop())
    .pipe(gulp.dest('www'));
}

function less2css() {
    return gulp.src(['src/css/**/*'], { since: gulp.lastRun(less2css) })
    .pipe(less())
    .pipe(gutil.env.min ? nano({ safe: true }) : gutil.noop())
    .pipe(gulp.dest('www'))
    .pipe(connect.reload());
}

function html() {
    return gulp.src(['src/**/*.html'])
    .pipe(nunjucks(config.nunjucks))
    .pipe(gutil.env.min ? htmlmin(config.htmlmin) : gutil.noop())
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
gulp.task('default', gulp.series('clean', assets, scripts, less2css, html, 'serve'));
