/*
    Build JavaScript
*/
const { src, dest } = require('gulp');
const util = require('../util.js')();
const braces = require('../lib/braces.js')();
const terser = require('terser');
const concat = require('gulp-concat');

const config = {
    "ecma": 6,
    "toplevel": true,
    "mangle": {
        "properties": false
    },
    "compress": false,
    "warnings": true
}

exports.src = ['src/js/data/dk.js', 'src/js/currency.js', 'src/js/tools.js', 'src/js/main.js'];
exports.task = () => {
    return src(exports.src)
        .pipe(util.piper((file) => {
            let str = file.contents.toString();
            if (file.path.endsWith('currency.js')) {
                str = str.replace("currency_values = {}", "currency_values = {" + global.currency_values + "}");
            }
            file.contents = Buffer.from(braces.fromString(str, global.args), 'utf-8');
        }))
        .pipe(concat('all.js'))
        .pipe(util.piper(async (file) => {
            const str = file.contents.toString();
            const minified = await terser.minify(str, config);
            file.contents = Buffer.from(minified.code, 'utf-8');
        }))
        .pipe(dest('www/js/'));
};
