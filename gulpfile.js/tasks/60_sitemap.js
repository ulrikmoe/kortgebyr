
const fs = require('fs');
const Path = require('path');
const { src } = require('gulp');
const util = require('../util.js')();

exports.task = (cb) => {

    let map = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    for (const url of pages) {
        const filePath = (url[url.length - 1] === '/') ? url + 'index.html' : url + '.html';
        let stat = fs.statSync(Path.join(__dirname, 'src', filePath));
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
    map += '\n</urlset>';

    const fd = fs.openSync(Path.join(__dirname, 'www', 'sitemap.xml'), 'w');
    fs.writeSync(fd, map);
    fs.closeSync(fd);



    cb(null);
};


/*
    let map = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset ' +
        'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    const pages = ['/', '/ofte-stillede-spørgsmål'];
    for (const url of pages) {
        const filePath = (url[url.length - 1] === '/') ? url + 'index.html' : url + '.html';

        console.log(Path.join(__dirname, 'src', filePath));
        console.log(filePath);
        let stat = fs.statSync(Path.join(__dirname, 'src', filePath));
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
    map += '\n</urlset>';

    const fd = fs.openSync(Path.join(__dirname, 'www', 'sitemap.xml'), 'w');
    fs.writeSync(fd, map);
    fs.closeSync(fd);
*/
