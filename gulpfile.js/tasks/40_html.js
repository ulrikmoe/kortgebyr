/*
    Build html pages
*/
const { src, dest } = require('gulp');
const util = require('../util.js')();
const { minify } = require('html-minifier');
const braces = require('../lib/braces.js')();

function getUrl(file) {
    const relativePath = file.relative.replace(/\.html$/, '');
    const url = relativePath === 'index' ? '' : relativePath;
    return '/' + url;
}

exports.src = ['src/*.html'];
exports.task = () => {
    return src(exports.src)
        .pipe(util.piper((file) => {
            file.contents = Buffer.from(
                minify(
                    braces.fromString(file.contents.toString(), global.args),
                    {
                        collapseWhitespace: true,
                        removeComments: true
                    }
                ),
                'utf-8'
            );
            const url = getUrl(file);
            if (url === '/') file.stat.mtime = new Date(); // bump mtime of frontpage
            global.urls.push([getUrl(file), file.stat.mtime]);
        }))
        .pipe(dest('www'));
}
