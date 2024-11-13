const connect = require('gulp-connect');
const { src } = require('gulp');

exports.task = () => {
    return src('src/*.html', { encoding: false }).pipe(connect.reload());
};
