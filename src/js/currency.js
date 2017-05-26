/**
*   @author Ulrik Moe, Christian Blach, Joakim Sindholt
*   @license GPLv3
**/

const currency_value = {
    DKK: 1,
    SEK: 0.781,
    NOK: 0.827,
    EUR: 7.434,
    USD: 7.123,
    GBP: 8.752
};

const currency_map = {
    DKK: 'kr',
    SEK: 'kr',
    NOK: 'kr',
    EUR: '€',
    USD: '$',
    GBP: '£'
};

function Currency(value, code) {
    this.amounts = {};
    this.amounts[code] = value;
}

Currency.prototype.print = function () {
    const number = Math.round((this.dkk() * 100) / currency_value[$currency]) / 100;
    const parts = number.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    if (parts.length === 2 && parts[1].length === 1) {
        parts[1] += '0';
    }
    return parts.join(',') + ' ' + currency_map[$currency];
};

Currency.prototype.represent = function () {
    if (this.length() === 1) {
        for (let code in this.amounts) {
            return this.amounts[code] + ' ' + code;
        }
    }
    return this.dkk() / currency_value[$currency] + ' ' + $currency; //currency_map[$currency];
};

Currency.prototype.string = function () {
    if (this.length() === 1) {
        for (let code in this.amounts) {
            return this.amounts[code] + code;
        }
    }
    return this.dkk() / currency_value[$currency] + $currency; //currency_map[$currency];
};

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

/*
Currency.prototype.add = function (o) {
    if (this.code !== o.code) { throw 'differentCurrencyCodes'; }

    const ret = this.zero();
    let carry = 0;
    let i = currencyDigits;
    while (i--) {
        const sum = this.value[i] + o.value[i] + carry;
        if (sum > 9) {
            carry = 1;
            ret.value[i] = sum - 10;
        }
        else {
            carry = 0;
            ret.value[i] = sum;
        }
    }
    if (carry > 0) { throw 'currencySumOverflow'; }
    return ret;
};
*/

Currency.prototype.add = function (o) {
    const n = new Currency(0, 'DKK');
    for (let code in this.amounts) {
        if (this.amounts.hasOwnProperty(code)) {
            n.amounts[code] = this.amounts[code];
        }
    }

    for (let code in o.amounts) {
        if (o.amounts.hasOwnProperty(code)) {
            if (!n.amounts.hasOwnProperty(code)) {
                n.amounts[code] = 0;
            }
            n.amounts[code] += o.amounts[code];
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
    const n = new Currency(0, 'DKK');
    for (let code in this.amounts) {
        if (this.amounts.hasOwnProperty(code)) {
            n.amounts[code] = this.amounts[code] * rhs;
        }
    }
    return n;
};




function set_ccode(c) {
    if (currency_map.hasOwnProperty(c)) {
        $currency = c;
    }
}

function mkcurregex() {
    const arr = [];
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

    let c = a[2] ? a[2] : currency_map[$currency];
    if (c.toLowerCase() === currency_map[$currency].toLowerCase()) {
        /* there are a lot of currencies named kr and we should prefer the kr
        * that has been selected */
        c = $currency;
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

    if (action === 'init') { $(currency).addEventListener('input', build); }

    const a = _getCurrency($(currency).value);
    if (a === null) {
        $(currency).classList.add('error');
        return null;
    }
    $(currency).classList.remove('error');
    return a;
}

function changeCurrency() {
    $('currency_code').innerHTML = this.value;
    set_ccode(this.value);
    build();
    //save_url();
}

function setCurrency(k, v) {
    $(k).value = v.represent();
    $(k).classList.remove('error');
}
