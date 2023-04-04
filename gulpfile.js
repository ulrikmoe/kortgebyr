/* @author Ulrik Moe */
/* eslint-env node */
const fs = require('fs');
const Path = require('path');
const gulp = require('gulp');
const connect = require('gulp-connect');
const mo3 = require('mo3place')();
const through = require('through2');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const applySourceMap = require('vinyl-sourcemaps-apply');
const terser = require("terser");
const htmlmin = require("html-minifier");
const { ESLint } = require("eslint");
const eslint = new ESLint();
const env = require('minimist')(process.argv.slice(2));
const config = require('./config.json');
if (!env.git) { env.git = '1'; }

//  Last changed
const months = ['jan', 'feb', 'mar', 'apr', 'maj', 'juni',
    'juli', 'aug', 'sept', 'okt', 'nov', 'dec'];
const date = new Date();
env.lastUpdate = date.getDate() + '. ' + months[date.getMonth()] + ', ' +
    date.getFullYear();


function assets() {
    return gulp.src(['src/assets/**'], { base: 'src/assets' })
        .pipe(gulp.dest('www'))
        .pipe(connect.reload());
}

function css() {
    return gulp.src(['src/css/**.scss'], { base: 'src/css' })
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('www/css'))
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
        .pipe(through.obj(async (file, enc, cb) => {
            const str = file.contents.toString();
            const results = await eslint.lintText(str);
            if (results[0].warningCount || results[0].errorCount) {
                const formatter = await eslint.loadFormatter("stylish");
                console.error(formatter.format(results)); // output ESlint errors
            }
            const opts = { ...config.terser };
            opts.sourceMap.filename = file.sourceMap.file;
            opts.sourceMap.content = file.sourceMap;

            const minified = await terser.minify(str, opts);
            file.contents = Buffer.from(minified.code, 'utf-8');
            applySourceMap(file, JSON.parse(minified.map))
            cb(null, file);
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('www/js/'))
        .pipe(connect.reload());
}


function html() {
    return gulp.src(['src/*.html'])
        .pipe(through.obj((file, enc, cb) => {
            file.contents = Buffer.from(
                htmlmin.minify(
                    mo3.fromString(file.contents.toString(), env),
                    config.htmlmin
                ),
                'utf-8'
            );
            file.stat.mtime = false; // bump to current time
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
    gulp.watch(['src/css/**'], css);
    gulp.watch(['src/*.html'], html);
    gulp.watch(['src/js/**/*.js'], gulp.series(scripts, html));
});

gulp.task('build', gulp.series(assets, scripts, css, html, 'sitemap'));
gulp.task('default', gulp.series('build', 'serve'));
