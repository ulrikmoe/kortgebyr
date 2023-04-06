/* @author Ulrik Moe, Christian Blach, Joakim Sindholt */

const currency_map = {
    DKK: { cur: '% kr.', t: '.', d: ',' },
    SEK: { cur: '% kr.', t: '.', d: ',' },
    NOK: { cur: '% kr.', t: '.', d: ',' },
    EUR: { cur: '€%', t: '.', d: ',' },
    USD: { cur: '$%', t: ',', d: '.' },
    GBP: { cur: '£%', t: '.', d: ',' }
};


const currency_value = {
    // https://api.frankfurter.app/latest?from=DKK&to=SEK,NOK,EUR,USD
    'DKK': {
        'EUR': 0.1342,
        'NOK': 1.5077,
        'SEK': 1.5101,
        'USD': 0.1463
    },
    // https://api.frankfurter.app/latest?from=SEK&to=EUR,DKK,NOK,USD
    'SEK': {
        'DKK': 0.66219,
        'EUR': 0.08887,
        'NOK': 0.9984,
        'USD': 0.09688
    },
    // https://api.frankfurter.app/latest?from=EUR&to=DKK,NOK,SEK,USD
    'EUR': {
        'DKK': 7.4513,
        'NOK': 11.2345,
        'SEK': 11.2525,
        'USD': 1.0901
    }
};

function Currency(value, code) {
    this.amounts = {};
    if (code) { this.amounts[code] = value; }
}

Currency.prototype.print = function (cur, showDec) {
    const n = this.order(cur).toFixed(2).split('.');
    const neg = (n[0][0] === '-');
    if (neg) n[0] = n[0].substring(1);
    const ints = [];
    const frac = (!showDec && parseInt(n[1], 10) === 0) ? '' : currency_map[cur].d + n[1];

    for (let i = n[0].length; i > 0; i -= 3) {
        ints.unshift(n[0].substring(i - 3, i));
    }
    if (neg) ints[0] = '-' + ints[0];
    return currency_map[cur].cur.replace('%', ints.join(currency_map[cur].t) + frac);
};

Currency.prototype.order = function (currency) {
    let sum = 0;
    for (const code in this.amounts) {
        if (code === currency) {
            sum += this.amounts[code];
        } else {
            sum += this.amounts[code] / currency_value[currency][code];
        }
    }
    return sum;
};

Currency.prototype.add = function (rhs) {
    if (!rhs) return this;
    const n = new Currency();
    for (const code in this.amounts) {
        n.amounts[code] = this.amounts[code];
    }
    for (const code in rhs.amounts) {
        const c = n.amounts[code] ? n.amounts[code] : 0;
        n.amounts[code] = c + rhs.amounts[code];
    }
    return n;
};

Currency.prototype.scale = function (rhs) {
    const n = new Currency();
    for (const code in this.amounts) {
        n.amounts[code] = this.amounts[code] * rhs;
    }
    return n;
};
