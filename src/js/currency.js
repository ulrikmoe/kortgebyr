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
        'EUR': 0.13442,
        'NOK': 1.3221,
        'SEK': 1.4509,
        'USD': 0.14691
    },
    // https://api.frankfurter.app/latest?from=SEK&to=DKK,NOK,EUR,USD
    'SEK': {
        'DKK': 0.68925,
        'EUR': 0.09265,
        'NOK': 0.91127,
        'USD': 0.10126
    }
};

function Currency(value, code) {
    this.amounts = {};
    if (code) { this.amounts[code] = value; }
}

Currency.prototype.print = function (cur) {
    const n = this.order(cur).toFixed(2).split('.');
    const ints = [];
    const frac = (parseInt(n[1], 10) === 0) ? '' : currency_map[cur].d + n[1];

    for (let i = n[0].length; i > 0; i -= 3) {
        ints.unshift(n[0].substring(i - 3, i));
    }
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
