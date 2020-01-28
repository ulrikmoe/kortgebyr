/* @author Ulrik Moe */
/* eslint-env node */
const fs = require('fs');
const Path = require('path');
const gulp = require('gulp');
const connect = require('gulp-connect');
const mo3 = require('mo3place')();
const through = require('through2');
const sass = require('node-sass');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const env = require('minimist')(process.argv.slice(2));
if (!env.git) { env.git = '1'; }

//  Last changed
const months = ['jan', 'feb', 'mar', 'apr', 'maj', 'juni',
    'juli', 'aug', 'sept', 'okt', 'nov', 'dec'];
const date = new Date();
env.lastUpdate = date.getDate() + '. ' + months[date.getMonth()] + ', ' +
    date.getFullYear();


function assets() {
    return gulp.src(['src/img/**', 'src/font/*.*'], { base: 'src' })
        .pipe(gulp.dest('www'));
}

function scripts() {
    return gulp.src(['src/js/data/dk.js', 'src/js/currency.js',
        'src/js/tools.js', 'src/js/main.js'])
        .pipe(through.obj((file, enc, cb) => {
            mo3.render(file, env);
            cb(null, file);
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('all.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('www/js/'))
        .pipe(connect.reload());
}

function css() {
    return gulp.src(['src/css/*.scss'])
        .pipe(through.obj((file, enc, cb) => {
            file.contents = sass.renderSync({ data: file.contents.toString() }).css;
            file.path = file.path.slice(0, -4) + 'css';
            cb(null, file);
        }))
        .pipe(gulp.dest('www/css/'))
        .pipe(connect.reload());
}

function html() {
    return gulp.src(['src/*.html'])
        .pipe(through.obj((file, enc, cb) => {
            mo3.render(file, env);
            if (file.path.substring(__dirname.length) === '/src/index.html') {
                file.stat.mtime = fs.statSync('www/js/all.js').mtime;
            }
            cb(null, file);
        }))
        .pipe(gulp.dest('www'))
        .pipe(connect.reload());
}

gulp.task('sitemap', (cb) => {
    const index = JSON.parse(fs.readFileSync('./i18n/index.json')).da;
    let map = '<?xml version="1.0" encoding="UTF-8"?><urlset ' +
    'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    for (const x in index) {
        const o = index[x];
        if (o.hidden) { continue; }
        let path = o.url.substring(o.url.indexOf('/'));
        path += (path.slice(-1) === '/') ? 'index.html' : '.html';
        const stat = fs.statSync(Path.join(__dirname, 'www', path));
        map += '<url><loc>https://' + o.url + '</loc>';
        map += '<lastmod>' + stat.mtime.toISOString() + '</lastmod></url>';
    }
    map += '</urlset>';
    const fd = fs.openSync(Path.join(__dirname, 'www', 'sitemap.xml'), 'w');
    fs.writeSync(fd, map);
    fs.closeSync(fd);
    cb(null);
});

gulp.task('serve', () => {
    connect.server({ root: 'www', livereload: true });

    gulp.watch(['src/img/**', 'src/font/*'], assets);
    gulp.watch(['src/*.html'], html);
    gulp.watch(['src/css/*.scss'], gulp.series(css));
    gulp.watch(['src/js/**/*.js'], gulp.series(scripts, html));
});

gulp.task('build', gulp.series(assets, scripts, css, html, 'sitemap'));
gulp.task('default', gulp.series('build', 'serve'));
