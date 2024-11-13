/*
    Compile Sass to CSS.
*/
const fs = require('fs');
const path = require('path');
const { src, dest } = require('gulp');
const { compileString } = require('sass');
const util = require('../util.js')();

function writeSourceMap(filePath, sourceMap) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFile(filePath, JSON.stringify(sourceMap), (err) => {
        if (err) console.error(err);
    });
}

exports.src = ['src/css/**/*.scss'];
exports.task = () => {
    // Create the directory if it doesn't exist
    const cssDir = path.join(global.args.dist, 'css');
    if (!fs.existsSync(cssDir)) fs.mkdirSync(cssDir, { recursive: true });

    return src(['src/css/*.scss'], { encoding: false, base: 'src/css' })
        .pipe(
            util.piper((file) => {
                file.path = file.path.replace(/\.scss$/, '.css');
                const { css, sourceMap } = compileString(file.contents.toString(), {
                    loadPaths: ['src/css/'],
                    sourceMap: true,
                    sourceMapIncludeSources: true,
                    style: 'compressed',
                });
                const sourceMapComment = `/*# sourceMappingURL=${file.relative}.map */`;
                file.contents = Buffer.from(`${css}\n${sourceMapComment}`, 'utf-8');
                writeSourceMap(path.join(cssDir, file.relative + '.map'), sourceMap);
            })
        )
        .pipe(dest(cssDir));
};
