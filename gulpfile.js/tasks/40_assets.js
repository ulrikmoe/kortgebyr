/*
    Copy assets to dist
*/

const { src, dest } = require('gulp');

exports.src = ['src/assets/**/*'];
exports.task = () => {
    return src(exports.src, { encoding: false }).pipe(dest(global.args.dist));
};
