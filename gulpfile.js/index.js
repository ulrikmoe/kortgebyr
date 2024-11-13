const gulp = require('gulp');
const connect = require('gulp-connect');
const util = require('./util.js')();
const { rmSync } = require('fs');

// Store arguments in global `args`
global.urls = [];
global.args = util.argParser({
    dist: 'www',
    gitHash: Math.floor(Math.random() * 1000000),
});

// Add last update date to the global args
const date = new Date();
global.args.lastUpdate = date.toLocaleDateString('da-DK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
});

// Gulp tasks are defined in the `tasks` directory
const tasks = util.taskList(gulp, __dirname + '/tasks/');
gulp.task('build', gulp.series(tasks));

// Default task is to 'build' and serve/watch
gulp.task(
    'default',
    gulp.series('build', () => {
        connect.server({
            root: global.args.dist,
            livereload: global.args.noreload ? false : true,
            middleware: () => [
                (req, res, next) => {
                    if (!req.url.includes('.') && !req.url.endsWith('/')) {
                        req.url += '.html';
                    }
                    next();
                },
            ],
        });
    })
);
