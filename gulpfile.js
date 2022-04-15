/* @author Ulrik Moe */
/* eslint-env node */
const fs = require('fs');
const Path = require('path');
const gulp = require('gulp');
const connect = require('gulp-connect');
const mo3 = require('mo3place')();
const through = require('through2');
const sass = require('sass');
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
    return gulp.src(['src/assets/**'], { base: 'src/assets' })
    .pipe(through.obj((file, enc, cb) => {
        if (/\.scss$/.test(file.path)) {
            file.contents = sass.renderSync({ data: file.contents.toString() }).css;
            file.path = file.path.slice(0, -4) + 'css';
        }
        cb(null, file);
    }))
    .pipe(gulp.dest('www'))
    .pipe(connect.reload());
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


function html() {
    return gulp.src(['src/*.html'])
        .pipe(through.obj((file, enc, cb) => {
            mo3.render(file, env);
            cb(null, file);
        }))
        .pipe(gulp.dest('www'))
        .pipe(connect.reload());
}

gulp.task('sitemap', (cb) => {
    let map = '<?xml version="1.0" encoding="UTF-8"?><urlset ' +
    'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    const pages = ['/', '/ofte-stillede-spørgsmål'];
    for (const url of pages) {
        const path = (url[url.length - 1] === '/') ?
            url + 'index.html' : url + '.html';
        let stat = fs.statSync(Path.join(__dirname, 'src', path));
        if (url === '/') {
            const jsStat = fs.statSync('www/js/all.js');
            if (jsStat.mtimeMs > stat.mtimeMs) stat = jsStat;
        }
        map += `
        <url>
            <loc>https://kortgebyr.dk${url}</loc>
            <lastmod>${stat.mtime.toISOString()}</lastmod>
        </url>`
    }
    map += '</urlset>';
    const fd = fs.openSync(Path.join(__dirname, 'www', 'sitemap.xml'), 'w');
    fs.writeSync(fd, map);
    fs.closeSync(fd);
    cb(null);
});

gulp.task('serve', () => {
    connect.server({
        root: 'www',
        livereload: true,
        middleware: () => ([(req, res, next) => {
            if (req.url.slice(-1) !== '/' && req.url.indexOf('.') === -1) {
                req.url += '.html';
            }
            next();
        }])
    });

    gulp.watch(['src/assets/**'], assets);
    gulp.watch(['src/*.html'], html);
    gulp.watch(['src/js/**/*.js'], gulp.series(scripts, html));
});

gulp.task('build', gulp.series(assets, scripts, html, 'sitemap'));
gulp.task('default', gulp.series('build', 'serve'));
