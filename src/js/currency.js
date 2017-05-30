/**
*   @author Ulrik Moe, Christian Blach, Joakim Sindholt
*   @license GPLv3
**/

const currency_value = {
    DKK: 1,
    SEK: 0.764,
    NOK: 0.793,
    EUR: 7.441,
    USD: 6.648,
    GBP: 8.619
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
    const str = '' + Math.round(this.dkk() * 100 / currency_value[$currency]) / 100;
    const sepIndex = str.indexOf('.');
    const ints = (sepIndex === -1) ? str.length : sepIndex;
    const curr = ' ' + currency_map[$currency];
    let ret = '';

    for (let i = 0; i < ints; i++) {
        ret += (i > 0 && (ints - i) % 3 === 0) ? '.' + str[i] : str[i];
    }
    return (sepIndex === -1) ? ret + curr : ret + ',' + str.substring(sepIndex + 1) + curr;
};

Currency.prototype.dkk = function () {
    let sum = 0;
    for (let code in this.amounts) {
        sum += currency_value[code] * this.amounts[code];
    }
    return sum;
};

Currency.prototype.add = function (o) {
    const n = new Currency(0, 'DKK');
    for (let code in this.amounts) {
        n.amounts[code] = this.amounts[code];
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

Currency.prototype.scale = function (rhs) {
    const n = new Currency(0, 'DKK');
    for (let code in this.amounts) {
        n.amounts[code] = this.amounts[code] * rhs;
    }
    return n;
};
