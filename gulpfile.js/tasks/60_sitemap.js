/*
    Create sitemap.xml
*/
const fs = require('fs');
const Path = require('path');

exports.task = (cb) => {
    let map = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    for (const arr of global.urls) {
        map += `<url>
            <loc>https://kortgebyr.dk${arr[0]}</loc>
            <lastmod>${arr[1].toISOString()}</lastmod>
        </url>`
    }
    map += '\n</urlset>';
    fs.writeFileSync(Path.join(process.cwd(), 'www', 'sitemap.xml'), map);
    cb(null);
};
