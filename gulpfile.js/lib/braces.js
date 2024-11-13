const { readFileSync } = require('fs');
const uri = 'src/';

function getFile(filename) {
    try {
        return readFileSync(uri + filename, 'utf8');
        // Process the file content
    } catch (err) {
        console.error('Error reading file:', err);
        return '';
    }
}

/**
 * Search for {% include "file" %} directives and replace them with the content of the file.
 * @param {string} str
 */
function includer(str) {
    let result = '';
    let i = 0;
    while (i < str.length) {
        const start = str.indexOf('{% include "', i);
        if (start === -1) return result + str.slice(i);

        const end = str.indexOf('" %}', start + 12);
        if (end === -1) throw new Error('Unclosed include directive');
        const filename = str.slice(start + 12, end);

        // Recursively include the file content
        result += str.slice(i, start) + includer(getFile(filename));
        i = end + 4; // 4 is the length of `" %}`
    }
    return result;
}

/**
 * Make operations on variables in the form of {$ {var}.printf('abc', 'def') $}
 */

function operateOnVar(str, vars) {
    const end = str.indexOf('}');
    if (end === -1) throw new Error('Unclosed variable directive in operator');
    const key = str.slice(1, end).trim();
    let value = vars[key];
    if (!value) {
        console.log(`Variable not found: ${key}`);
        return '';
    }
    // Operator (we only support printf for now)
    const opEnd = str.indexOf('(');
    const operator = str.slice(end + 2, opEnd);
    if (operator !== 'printf') throw new Error(`Unknown operator: ${operator}`);

    // Arguments
    const args = str
        .slice(opEnd + 1, -1)
        .split('|')
        .map((arg) => arg.trim());

    // Perform printf-like operation
    value = value.replace(/%s/g, () => args.shift());
    return value;
}

function operate(str, vars) {
    switch (str[0]) {
        case '{':
            return operateOnVar(str, vars);
        default:
            throw new Error(`Unknown operator: ${str}`);
    }
}

/**
 * Search for {$ operators $} and perform the operation.
 */
function operator(str, vars) {
    let result = '';
    let i = 0;
    while (i < str.length) {
        const start = str.indexOf('{$', i);
        if (start === -1) return result + str.slice(i);
        const end = str.indexOf('$}', start + 2);
        if (end === -1) throw new Error('Unclosed operator directive');
        result += str.slice(i, start) + operate(str.slice(start + 2, end).trim(), vars);
        i = end + 2;
    }
    return result;
}

/**
 * Search for {{ variables }} and replace them with the value from the vars object.
 */
function replaceVariables(str, vars) {
    let result = '';
    let i = 0;
    while (i < str.length) {
        const start = str.indexOf('{{', i);
        if (start === -1) return result + str.slice(i);
        const end = str.indexOf('}}', start + 3);
        if (end === -1) throw new Error('Unclosed variable directive');
        const key = str.slice(start + 3, end).trim();
        const value = vars[key];
        if (!value) console.log(`Variable not found: ${key}`);
        result += str.slice(i, start) + value;
        i = end + 2;
    }
    return result;
}

function parseDoc(file) {
    const obj = {
        path: file.path.substring(file._base.length + 1),
        mtime: file.stat.mtimeMs,
    };
    let str = file.contents.toString();
    const endOfConfig = str.indexOf('-->');
    if (endOfConfig === -1) {
        throw new Error(`No end of config found in file: ${file.path}`);
    }
    obj.content = fromString(str.substring(endOfConfig + 3));
    str = str.substring(4, endOfConfig - 1);
    const lines = str.split('\n');
    for (let i = 1; i < lines.length; i++) {
        const split = lines[i].split(':');
        if (split.length === 2) {
            obj[split[0].trim()] = split[1].trim();
        }
    }
    if (!obj.title) {
        throw new Error(`No title found in file: ${file.path}`);
    }
    return obj;
}

function fromString(str, vars) {
    let fullStr = includer(str);
    if (typeof vars !== 'object') {
        return fullStr;
    }
    fullStr = replaceVariables(fullStr, vars);
    return operator(fullStr, vars);
}

module.exports = () => ({
    fromString,
    parseDoc,
});
