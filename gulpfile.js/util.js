const { Transform } = require('stream');
const fs = require('fs');

function argParser(args) {
    process.argv.slice(2).forEach((arg) => {
        const [key, value] = arg.split('=');
        args[key.replace('--', '')] = value || true;
    });
    return args;
}

function piper(fn) {
    return new Transform({
        objectMode: true,
        transform(file, enc, cb) {
            try {
                fn(file);
                cb(null, file);
            } catch (err) {
                cb(err);
            }
        },
    });
}

function taskFinder(tasks, trigger) {
    const arr = [trigger];
    const x = parseInt(trigger.split('_')[0], 10);
    for (let i = 0; i < tasks.length; i++) {
        const group = parseInt(tasks[i].split('_')[0], 10);
        if (group > x) {
            arr.push(...tasks.slice(i));
            break;
        }
    }
    return arr;
}

function taskList(gulp, dir) {
    const watcher = process.argv.length === 2 || process.argv.includes('default');
    const arr = [];
    fs.readdirSync(dir).forEach((filename) => {
        if (filename.endsWith('.js')) {
            const ex = require(dir + filename);
            const name = filename.split('.')[0];
            if (ex.task) {
                gulp.task(name, ex.task);
                arr.push(name);

                if (watcher && ex.src) {
                    gulp.watch(ex.src, (cb) => {
                        const seriesFunction = gulp.series(name, ...taskFinder(arr, name));
                        seriesFunction(cb);
                    });
                }
            }
        }
    });
    return arr;
}

module.exports = () => ({
    argParser,
    piper,
    taskList,
});
