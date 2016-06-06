/**
*   First shalt thou take out the Holy Pin. Then...
*   @author Ulrik Moe, Christian Blach, Joakim Sindholt
*   @license GPLv3
*
*   Indentation: 4 spaces
*   Conventions: https://github.com/airbnb/javascript
*
**/

function $(s) { return document.getElementById(s); }

const table = $('table');

const currency_value = {
    DKK: 1,
    SEK: 0.803,
    NOK: 0.801,
    EUR: 7.438,
    USD: 6.669,
    GBP: 9.624
};

const currency_map = {
    DKK: 'kr',
    SEK: 'kr',
    NOK: 'kr',
    EUR: '€',
    USD: '$',
    GBP: '£'
};

// let l, sort, card, acquirer;
let gccode = 'DKK';

function set_ccode(c) {
    if (currency_map.hasOwnProperty(c)) {
        gccode = c;
    }
}

function Currency(amt, code) {
    this.amounts = {};
    this.amounts[code] = amt;
}

Currency.prototype.type = 'currency';

Currency.prototype.print = function () {
    const number = Math.round((this.dkk() * 100) / currency_value[gccode]) / 100;
    let parts = number.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    if (parts.length === 2 && parts[1].length === 1) {
        parts[1] += '0';
    }
    return parts.join(',') + ' ' + currency_map[gccode];
};


Currency.prototype.represent = function () {
    if (this.length() === 1) {
        for (let code in this.amounts) {
            return this.amounts[code] + ' ' + code;
        }
    }
    return this.dkk() / currency_value[gccode] + ' ' + gccode; //currency_map[gccode];
};

Currency.prototype.string = function () {
    if (this.length() === 1) {
        for (let code in this.amounts) {
            return this.amounts[code] + code;
        }
    }
    return this.dkk() / currency_value[gccode] + gccode; //currency_map[gccode];
};

/*
Currency.prototype.length = function () {
    let n = 0;
    for (let k in this.amounts) {
        if (this.amounts.hasOwnProperty(k)) {
            n++;
        }
    }
    return n;
};
*/

Currency.prototype.dkk = function () {
    let sum = 0;
    for (let code in this.amounts) {
        if (this.amounts.hasOwnProperty(code) &&
        currency_value.hasOwnProperty(code)) {
            sum += currency_value[code] * this.amounts[code];
        }
    }
    return sum;
};


Currency.prototype.add = function (rhs) {

    let n = new Currency(0, 'DKK');

    for (let code in this.amounts) {
        if (this.amounts.hasOwnProperty(code)) {
            n.amounts[code] = this.amounts[code];
        }
    }

    for (let code in rhs.amounts) {
        if (rhs.amounts.hasOwnProperty(code)) {
            if (!n.amounts.hasOwnProperty(code)) {
                n.amounts[code] = 0;
            }
            n.amounts[code] += rhs.amounts[code];
        }
    }
    return n;
};

Currency.prototype.is_equal_to = function (other_currency_object) {
    for (let code in this.amounts) {
        if (this.amounts.hasOwnProperty(code)) {
            if (this.amounts[code] !== other_currency_object.amounts[code]) {
                return false;
            }
        }
    }
    return true;
};

Currency.prototype.scale = function (rhs) {
    let n = new Currency(0, 'DKK');
    for (let code in this.amounts) {
        if (this.amounts.hasOwnProperty(code)) {
            n.amounts[code] = this.amounts[code] * rhs;
        }
    }
    return n;
};


function getInt(elem, action) {
    if (action === 'init') { elem.addEventListener('input', build, false); }

    const str = elem.value.trim();
    if (!isNaN(parseFloat(str)) && isFinite(str) &&
    parseFloat(str) === parseInt(str, 10)) {
        elem.classList.remove('error');
        return parseInt(str, 10);
    }
    elem.classList.add('error');
    return null;
}

function setInt(k, v) {
    $(k).value = parseInt(v, 10);
    $(k).classList.remove('error');
}

function mkcurregex() {
    let arr = [];
    for (let k in currency_map) {
        arr.push(currency_map[k]);
    }
    for (let k in currency_value) {
        arr.push(k);
    }
    return RegExp('^ *([0-9][0-9., ]*)(' + arr.join('|') + ')? *$', 'i');
}
const curregex = mkcurregex();

function _getCurrency(currency) {
    const a = currency.match(curregex);
    if (a === null) { return null; }

    let c = a[2] ? a[2] : currency_map[gccode];
    if (c.toLowerCase() === currency_map[gccode].toLowerCase()) {
        /* there are a lot of currencies named kr and we should prefer the kr
        * that has been selected */
        c = gccode;
    } else {
        /* if that's not what's selected, find the currency */
        for (let k in currency_map) {
            if (currency_map[k].toLowerCase() === c.toLowerCase() ||
            k.toLowerCase() === c.toLowerCase()) {
                c = k;
                break;
            }
        }
    }
    return new Currency(parseFloat(a[1].replace('.', '').replace(',', '.')), c);
}

function getCurrency(currency, action) {

    if (action === 'init') { $(currency).addEventListener('input', build, false); }

    const a = _getCurrency($(currency).value);
    if (a === null) {
        $(currency).classList.add('error');
        return null;
    }
    $(currency).classList.remove('error');
    return a;
}

function changeCurrency(option) {
    $('currency_code').innerHTML = option.value;
    set_ccode(option.value);
    build();
    //save_url();
}

function setCurrency(k, v) {
    $(k).value = v.represent();
    $(k).classList.remove('error');
}

function getPercent(k) {
    const elem = $(k);
    const str = elem.value.replace('%', '').replace(',', '.').trim();
    if (!isNaN(parseFloat(str)) && isFinite(str)) {
        $(k).classList.remove('error');
        return parseFloat(str);
    }
    $(k).classList.add('error');
    return null;
}

function setPercent(k, v) {
    $(k).value = (parseFloat(v) + '%').replace('.', ',');
    $(k).classList.remove('error');
}


let opts = {
    cards: {
        type: 'bits',
        bits() { return document.getElementsByClassName('ocards').length; },
        get(action) {
            // Get all selected payment methods from .ocards
            let obj = {};
            const ocards = document.getElementsByClassName('ocards');
            let bitval = 0;
            for (let i = 0; i < ocards.length; i++) {
                const checkbox = ocards[i];
                if (checkbox.checked) {
                    obj[checkbox.id] = 1;
                    if (checkbox.id === 'visa') { obj.mastercard = 1; }
                    bitval += 1 << i;
                }
            }
            return obj;
        },
        set(bitval) {
            const ocards = document.getElementsByClassName('ocards');
            for (let i = 0; i < ocards.length; i++) {
                const checkbox = ocards[i];
                checkbox.checked = (bitval & (1 << i)) !== 0;
            }
        }
    },
    features: {
        type: 'bits',
        bits() { return document.getElementsByClassName('ofeatures').length; },
        get(action) {
            // Get all selected features
            let obj = {};
            const ofeatures = document.getElementsByClassName('ofeatures');
            let bitval = 0;
            for (let i = 0; i < ofeatures.length; i++) {
                const checkbox = ofeatures[i];
                if (checkbox.checked) {
                    obj[checkbox.id] = 1;
                    bitval += 1 << i;
                }
            }
            //if (action === 'url') { return bitval; }
            return obj;
        },
        set(bitval) {
            const ofeatures = document.getElementsByClassName('ofeatures');
            for (let i = 0; i < ofeatures.length; i++) {
                const checkbox = ofeatures[i];
                checkbox.checked = (bitval & (1 << i)) !== 0;
            }
        }
    },
    // Misc
    acquirers: {
        type: 'bits',
        bits() {
            let len = $('acquirer').length;
            let nbits = 0;
            while (len) {
                len = len >>> 1;
                nbits++;
            }
            return nbits;
        },
        get(action) {
            // Return the selected acquirers
            const index = $('acquirer').selectedIndex;
            if (index) {
                return [ACQs[0], ACQs[index]];
            }
            return ACQs.slice(0);
        },
        set(bitval) {
            if (bitval < $('acquirer').length) { $('acquirer').selectedIndex = bitval; }
        },
    },
    transactions: {
        type: 'string',
        dirty_bits: 1,
        get_dirty_bits() { return +(this.get() !== parseInt($('transactions').defaultValue)); },
        get(action) { return getInt($('transactions'), action); },
        set(v) { setInt('transactions', v); }
    },
    avgvalue: {
        type: 'currency',
        dirty_bits: 1,
        get_dirty_bits() { return +(!this.get().is_equal_to(_getCurrency($('avgvalue').defaultValue))); },
        get(action) { return getCurrency('avgvalue', action); },
        set(v) { setCurrency('avgvalue', _getCurrency(v)); }
    },
    currency: {
        type: 'string',
        dirty_bits: 1,
        get_dirty_bits() { return +(this.get() !== $('currency_code_select').options[0].value); },
        get() { return gccode; },
        set(v) {
            const select = $('currency_code_select');
            for (let i = 0; i < select.length; i++) {
                if (select.options[i].value === v) {
                    select.selectedIndex = i;
                    $('currency_code').innerHTML = v;
                    break;
                }
            }
            set_ccode(v);
        }
    }
};


// Check if object-x' properties is in object-y.
function x_has_y(objx, objy) {
    for (let prop in objy) {
        if (!objx[prop]) { return false; }
    }
    return true;
}

// To do: Settings skal forenes med opts()
const Settings = function (action) {
    //if (action === 'init') { loadurl(); }

    for (let key in opts) {
        if (key !== 'dirty_bits') { this[key] = opts[key].get(action); }
    }
    this.features['3-D secure'] = true;
};


function sum() {
    let sumobj = new Currency(0, 'DKK');
    for (let i = 0; i < arguments.length; i++) {
        // Combine costs
        for (let z in arguments[i]) {
            sumobj = sumobj.add(arguments[i][z]);
        }
    }
    return sumobj;
}

// Find combination of acquirers that support all cards
function acqcombo(psp, settings) {
    const A = settings.acquirers;
    let acqarr = [];

    // Check if a single acq support all cards.
    for (let acq of A) {
        if (psp.acquirers[acq.name]) {
            // Return acq if it support all settings.cards.
            if (x_has_y(acq.cards, settings.cards)) { return [acq]; }
            acqarr.push(acq);
        }
    }

    // Nope. Then we'll need to search for a combination of acquirers.
    const len = acqarr.length;
    for (let i = 0; i < len; i++) {
        const primary = acqarr[i];
        let missingCards = {};

        for (let card in settings.cards) {
            if (!primary.cards[card]) { missingCards[card] = true; }
        }

        // Find secondary acquirer with the missing cards.
        for (let j = i + 1; j < len; j++) {
            let secondary = acqarr[j];
            if (x_has_y(secondary.cards, missingCards)) {
                return [primary, secondary];
            }
        }
    }
    return null;
}

function showTooltip(elem, obj) {
    if (!elem.firstElementChild) {
        const infobox = document.createElement('ul');

        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                let costobj = obj[prop];
                if (typeof costobj === 'function') {
                    costobj = costobj(settings);
                }

                const li = document.createElement('li');
                li.textContent = prop + ': ' + costobj.print();
                infobox.appendChild(li);
            }
        }
        elem.appendChild(infobox);
    }
}

// Build table
function build(action) {
    settings = new Settings(action);
    let data = [];
    const tbody = document.createElement('tbody');
    tbody.id = 'tbody';

    // Input validation
    if (!Object.keys(settings.cards).length) { return false; }

    // Cards
    const dankortscale = (!settings.cards.visa) ? 1 : (settings.cards.dankort) ? 0.77 : 0;

    // Calculate acquirer costs and sort by Total Costs.
    for (let acq of settings.acquirers) {
        const cardscale = (acq.name === 'Nets') ? dankortscale : 1 - dankortscale;
        acq.trnfees = acq.fees.trn(settings).scale(settings.transactions).scale(cardscale);
        acq.TC = acq.trnfees.add(acq.fees.monthly);
    }
    settings.acquirers.sort(function (obj1, obj2) { return obj1.TC.dkk() - obj2.TC.dkk(); });

    psploop:
    for (let psp of PSPs) {
        let setup = {};
        let monthly = {};
        let trnfee = {};

        setup[psp.name] = psp.fees.setup;
        monthly[psp.name] = psp.fees.monthly;
        trnfee[psp.name] = psp.fees.trn(settings);

        // Check if psp support all enabled payment methods
        for (let card in settings.cards) { if (!psp.cards[card]) { continue psploop; } }

        // Check if psp support all enabled features
        for (let i in settings.features) {
            if (!psp.features || !psp.features[i]) { continue psploop; }
            const feature = psp.features[i];
            if (feature.setup) {
                setup[i] = feature.setup;
                monthly[i] = feature.monthly;
                trnfee[i] = feature.trn;
            }
        }

        // If an acquirer has been selected then hide the Stripes
        if (settings.acquirers.length < 3 && !psp.acquirers) { continue; }

        const acqfrag = document.createDocumentFragment();
        let acqcards = {};
        let acqArr = [];
        if (psp.acquirers) {

            acqArr = acqcombo(psp, settings); // Find acq with full card support
            if (!acqArr) { continue; }
            for (let acq of acqArr) {
                setup[acq.name] = acq.fees.setup;
                monthly[acq.name] = acq.fees.monthly;
                trnfee[acq.name] = acq.trnfees;

                const acqlink = document.createElement('a');
                acqlink.href = acq.link;
                acqlink.className = 'acq';
                const acqlogo = new Image(acq.w, acq.h);
                acqlogo.src = '/img/psp/' + acq.logo;
                acqlogo.alt = acq.name;
                acqlink.appendChild(acqlogo);
                acqfrag.appendChild(acqlink);
                acqfrag.appendChild(document.createElement('br'));

                // Construct a new acqcards
                for (let card in acq.cards) { acqcards[card] = acq.cards[card]; }
            }
        }

        const cardfrag = document.createDocumentFragment();
        for (let card in psp.cards) {

            if (psp.acquirers && !acqcards[card]) { continue; }

            //  Some cards/methods (e.g. mobilepay) add extra costs.
            if (psp.cards[card].setup) {
                if (!settings.cards[card]) { continue; } // Disable if not enabled.
                setup[card] = psp.cards[card].setup;
                monthly[card] = psp.cards[card].monthly;
                trnfee[card] = psp.cards[card].trn;
            }

            const cardicon = new Image(22, 15);
            cardicon.src = '/img/cards/' + card + '.svg';
            cardicon.alt = card;
            cardicon.className = 'card';
            cardfrag.appendChild(cardicon);
        }

        // Calculate TC and sort psps
        let totalcost = sum(monthly, trnfee);
        let sort;
        for (sort = 0; sort < data.length; ++sort) {
            if (totalcost.dkk() < data[sort]) { break; }
        }
        data.splice(sort, 0, totalcost.dkk());

        // Create PSP logo.
        const pspfrag = document.createDocumentFragment();
        const psplink = document.createElement('a');
        psplink.target = '_blank';
        psplink.href = psp.link;
        psplink.className = 'psp';
        const psplogo = new Image(psp.w, psp.h);
        psplogo.src = '/img/psp/' + psp.logo;
        psplogo.alt = psp.name;
        const pspname = document.createElement('p');
        pspname.textContent = psp.name;
        psplink.appendChild(psplogo);
        psplink.appendChild(pspname);
        pspfrag.appendChild(psplink);

        // setup fees
        const setupfrag = document.createDocumentFragment();
        setupfrag.textContent = sum(setup).print();
        const setup_info = document.createElement('div');
        setup_info.textContent = '[?]';
        setup_info.className = 'info';
        setup_info.onmouseover = function () { showTooltip(this, setup); };
        setupfrag.appendChild(setup_info);

        // Recurring fees
        const recurringfrag = document.createDocumentFragment();
        recurringfrag.textContent = sum(monthly).print();
        const recurring_info = document.createElement('div');
        recurring_info.textContent = '[?]';
        recurring_info.className = 'info';
        recurring_info.onmouseover = function () { showTooltip(this, monthly); };
        recurringfrag.appendChild(recurring_info);

        // Trn fees
        const trnfrag = document.createDocumentFragment();
        trnfrag.textContent = sum(trnfee).print();
        const trn_info = document.createElement('div');
        trn_info.textContent = '[?]';
        trn_info.className = 'info';
        trn_info.onmouseover = function () { showTooltip(this, trnfee); };
        trnfrag.appendChild(trn_info);

        // cardfee calc.
        const cardfeefrag = document.createDocumentFragment();
        const p1 = document.createElement('p');
        let cardfee = totalcost.scale(1 / (settings.transactions || 1));
        cardfeefrag.textContent = cardfee.print();
        p1.textContent = '(' + (cardfee.scale(1 / settings.avgvalue.dkk()).dkk() * 100).toFixed(3).replace('.', ',') + '%)';
        p1.className = 'procent';
        cardfeefrag.appendChild(p1);

        const row = tbody.insertRow(sort);
        row.insertCell(-1).appendChild(pspfrag);
        row.insertCell(-1).appendChild(acqfrag);
        row.insertCell(-1).appendChild(cardfrag);
        row.insertCell(-1).appendChild(setupfrag);
        row.insertCell(-1).appendChild(recurringfrag);
        row.insertCell(-1).appendChild(trnfrag);
        row.insertCell(-1).textContent = totalcost.print();
        row.insertCell(-1).appendChild(cardfeefrag);
    }
    table.replaceChild(tbody, $('tbody'));

    //if (action !== 'init') { saveurl(); }
}


//===========================
//    Blach magic!
//===========================

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


/* Save the url to the following structure URL = kortgebyr.dk?{BITS}{ARGUMENT STRING}*/
function saveurl() {
    let argstr = ''; // The optional arguments string which follows the base64 enc. bits
    let nbits; // the number of bits for the current option
    let optbits; // The bits for the current option
    let bitbuf = new Base64Array(); // The buffer used for containing bits until they are flushed

    /* Loop through the options and construct the url */
    for (let key in opts) {
        let o = opts[key];

        /* Depending on whether dirty bits are used or not, react accordingly */
        if (o.dirty_bits) {
            nbits = o.dirty_bits;
            optbits = o.get_dirty_bits('url');
            let ret = o.get();
            /* Create the argument string part if dirty bit is set */
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

    /* Check if any additional args after the bits and
    create the arg array if that is the case */
    let nb64chars = querystring.indexOf(';');
    if (nb64chars < 0) {
        nb64chars = querystring.length;
    } else {
        args = querystring.slice(nb64chars + 1).split(';');
    }

    /* Load the base64 representation of the bits into a base64array type */
    for (let i = 0; i < nb64chars; i++) {
        if (bitbuf.pushbase64char(querystring[i]) !== 0) {
            return -1;
        }
    }

    /* Loop through the opts set the fields with values loaded from the url */
    for (let key in opts) {
        o = opts[key];
        /* Check if opt has dirty bits, if so load arg */
        if (o.dirty_bits) {
            nbits = o.dirty_bits;
            bitval = bitbuf.getbits(nbits);
            if (bitval) {
                o.set(args[0]);
                args.shift();
            }
            /* Otherwise just load the bits directly */
        } else if (o.bits) {
            nbits = typeof (o.bits) === 'function' ? o.bits() : o.bits;
            bitval = bitbuf.getbits(nbits);
            o.set(bitval);
        } else {
            return;
        }
        /* Create the argument string part if dirty bit is set */
    }
}

//===========================
//    Lets build
//===========================

build('init');
$('currency_code_select').onchange = function () { changeCurrency(this); };
$('form').addEventListener('change', build, false);
