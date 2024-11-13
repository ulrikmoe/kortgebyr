/*
    Build html pages
*/
const { src, dest } = require('gulp');
const util = require('../util.js')();
const { minify } = require('html-minifier');
const braces = require('../lib/braces.js')();

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
            file.stat.mtime = false; // bump to current time
        }))
        .pipe(dest('www'));
}
