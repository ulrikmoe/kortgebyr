/* @author Ulrik Moe, Christian Blach, Joakim Sindholt */
/* global $currency */


/*  form2obj(form): A simple version for kortgebyr.dk */
function form2obj(form) {
    const obj = {};
    for (let i = 0; i < form.elements.length; i++) {
        const e = form.elements[i];
        if (!e.name || (e.type === 'radio' && !e.checked)) { continue; }
        if (e.type === 'checkbox') {
            const name = e.name.slice(0, -2);
            if (!obj[name]) { obj[name] = {}; }
            if (e.checked) { obj[name][e.value] = 1; }
        } else {
            obj[e.name] = (e.type === 'number') ? e.value | 0 : e.value;
        }
    }
    return obj;
}

/*  obj2form(obj): A simple version for kortgebyr.dk */
function obj2form(o, form) {
    for (let i = 0; i < form.elements.length; i++) {
        const e = form.elements[i];
        if (e.name) {
            if (e.type === 'checkbox') {
                e.checked = !!o[e.name.slice(0, -2)][e.value];
            } else {
                e.value = o[e.name];
            }
        }
    }
}

/*
    Very simple fetch polyfill (for Safari < 10.1)
*/
if (!window.fetch) {
    window.fetch = url => new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onload = () => {
            resolve({
                body: xhr.response,
                json() {
                    return JSON.parse(xhr.response);
                }
            });
        };

        xhr.onerror = () => reject(new TypeError('Network request failed'));
        xhr.ontimeout = () => reject(new TypeError('Network request failed'));
        xhr.open('GET', url, true);
        xhr.send();
    });
}

function showTooltip() {
    if (!this.firstElementChild) {
        const infobox = document.createElement('ul');
        const obj = this.ttdata;
        for (const prop in obj) {
            let costobj = obj[prop];
            if (typeof costobj === 'function') {
                console.log('wtf!!!!');
                costobj = costobj(settings);
            }

            const li = document.createElement('li');
            li.textContent = prop + ': ' + costobj.print($currency);
            infobox.appendChild(li);
        }
        this.appendChild(infobox);
    }
}

/*
const base64_chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/';
function Base64Array(initsize) {
    this.bitpos = 0; // from 0 - 5
    this.array = [];
    this.pos = 0;
}
Base64Array.prototype.pushbit = function (bit) {
    if (this.array.length === 0) {this.array.push(0);}
    if (this.bitpos > 5) {
        this.bitpos = 0;
        this.array.push(0);
    }
    this.array[this.array.length - 1] += bit << this.bitpos;
    this.bitpos++;
};
Base64Array.prototype.getbit = function () {
    if (this.bitpos > 5) {
        this.bitpos = 0;
        this.pos++;
    }
    let bitval = (this.array[this.pos] & (1 << this.bitpos)) >>> this.bitpos;
    this.bitpos++;
    return bitval;
};
Base64Array.prototype.pushbits = function (bitval, nbits) {
    for (let i = 0; i < nbits; i++) {
        this.pushbit((bitval & (1 << i)) >>> i);
    }
};
Base64Array.prototype.encode = function () {
    let encstr = '';
    for (let i = 0; i < this.array.length; i++) {
        encstr += base64_chars[this.array[i]];
    }
    return encstr;
};
Base64Array.prototype.pushbase64char = function (b64char) {
    let index = base64_chars.indexOf(b64char);
    if (index < 0) {
        return -1;
    }
    this.array.push(index);
    return 0;
};
Base64Array.prototype.getbits = function (nbits) {
    let val = 0;
    for (let i = 0; i < nbits; i++) {
        val += this.getbit() << i;
    }
    return val;
};
*/


/* Save the url to the following structure URL = kortgebyr.dk?{BITS}{ARGUMENT STRING} */
/*
function saveurl() {
    let argstr = ''; // The optional arguments string which follows the base64 enc. bits
    let nbits; // the number of bits for the current option
    let optbits; // The bits for the current option
    let bitbuf = new Base64Array(); // The buffer used for containing bits until they are flushed
    // Loop through the options and construct the url
    for (let key in opts) {
        const o = opts[key];
        // Depending on whether dirty bits are used or not, react accordingly
        if (o.dirty_bits) {
            nbits = o.dirty_bits;
            optbits = o.get_dirty_bits('url');
            let ret = o.get();
            // Create the argument string part if dirty bit is set
            if (optbits) {
                if (ret instanceof Currency) {
                    argstr += ';' + ret.string();
                } else {
                    argstr += ';' + ret;
                }
            }
        } else if (o.bits) {
            nbits = typeof (o.bits) === 'function' ? o.bits() : o.bits;
            optbits = o.get('url');
        } else {
            return;
        }
        bitbuf.pushbits(optbits, nbits);
    }
    history.replaceState({ foo: 'bar' }, '', '?' + bitbuf.encode() + argstr);
}
function loadurl() {
    let querystring = location.search.replace('?', '');
    if (!querystring) { return; }
    let encbits = ''; // The base64 encoded bits
    let args; // The optional arguments string which follows the base64 enc. bits
    let nbits; // the number of bits for the current option
    let bitval;
    let bitbuf = new Base64Array(); // The buffer used for containing bits until they are flushed
    let o;
    // Check if any additional args after the bits and
    // create the arg array if that is the case
    let nb64chars = querystring.indexOf(';');
    if (nb64chars < 0) {
        nb64chars = querystring.length;
    } else {
        args = querystring.slice(nb64chars + 1).split(';');
    }
    // Load the base64 representation of the bits into a base64array type
    for (let i = 0; i < nb64chars; i++) {
        if (bitbuf.pushbase64char(querystring[i]) !== 0) {
            return -1;
        }
    }
    // Loop through the opts set the fields with values loaded from the url
    for (let key in opts) {
        o = opts[key];
        // Check if opt has dirty bits, if so load arg
        if (o.dirty_bits) {
            nbits = o.dirty_bits;
            bitval = bitbuf.getbits(nbits);
            if (bitval) {
                o.set(args[0]);
                args.shift();
            }
            // Otherwise just load the bits directly
        } else if (o.bits) {
            nbits = typeof (o.bits) === 'function' ? o.bits() : o.bits;
            bitval = bitbuf.getbits(nbits);
            o.set(bitval);
        } else {
            return;
        }
        // Create the argument string part if dirty bit is set
    }
}
*/
