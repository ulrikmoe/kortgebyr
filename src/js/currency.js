/**
*   @author Ulrik Moe, Christian Blach, Joakim Sindholt
*   @license GPLv3
**/

const currency_map = {
    DKK: { cur: '% kr', t: '.', d: ',', rate: 1 },
    SEK: { cur: '% kr', t: '.', d: ',', rate: 1.2797 },
    NOK: { cur: '% kr', t: '.', d: ',', rate: 1.2491 },
    EUR: { cur: '€%', t: '.', d: ',', rate: 0.13446 },
    USD: { cur: '$%', t: ',', d: '.', rate: 0.15814 },
    GBP: { cur: '£%', t: '.', d: ',', rate: 0.12278 }
};

const currency_value = {};
const currency_fetched = {};

function initCurrency() {
    for (let cur in currency_map) {
        currency_value[cur] = {};
        for (let o in currency_map) {
            currency_value[cur][o] = currency_map[o].rate / currency_map[cur].rate;
        }
        currency_value[cur][cur] = 1;
    }
}

function updateCurrency() {
    const cur = $currency;

    if (currency_fetched[cur]) { return; }
    currency_fetched[cur] = true;

    const first = (Object.keys(currency_fetched).length == 1);
    if (first) { initCurrency(); }

    const x = new XMLHttpRequest();
    x.onload = function () {
        if (this.status === 200) {
            const j = JSON.parse(this.response);
            if (j && j.rates) {
                if (first) {
                    for (let o in currency_map) {
                        if (j.rates[o]) { currency_map[o].rate = j.rates[o]; }
                    }
                    initCurrency();
                }
                for (let o in currency_map) {
                    if (j.rates[o]) { currency_value[cur][o] = j.rates[o]; }
                }
                if (cur === $currency) { build(); }
            }
        }
    };
    x.open('GET', '/_currency/latest?base=' + cur + '&symbols=' + Object.keys(currency_map).join(','));
    x.send();
}

function Currency(value, code) {
    this.amounts = {};
    if (code !== undefined) { this.amounts[code] = value; }
}

Currency.prototype.print = function (cur) {
    const n = this.order(cur).toFixed(2).split('.');
    const ints = [];
    const frac = (parseInt(n[1]) != 0) ? currency_map[cur].d + n[1] : '';
    for (let i = n[0].length; i > 0; i -= 3) {
        ints.unshift(n[0].substring(i - 3, i));
    }
    return currency_map[cur].cur.replace('%', ints.join(currency_map[cur].t) + frac);
};

Currency.prototype.order = function (cur) {
    let sum = 0;
    for (let code in this.amounts) {
        sum += this.amounts[code] / currency_value[cur][code];
    }
    return sum;
};

Currency.prototype.add = function (rhs) {
    const n = new Currency();
    for (let code in this.amounts) {
        n.amounts[code] = this.amounts[code];
    }
    for (let code in rhs.amounts) {
        const c = n.amounts[code] ? n.amounts[code] : 0;
        n.amounts[code] = c + rhs.amounts[code];
    }
    return n;
};

Currency.prototype.scale = function (rhs) {
    const n = new Currency();
    for (let code in this.amounts) {
        n.amounts[code] = this.amounts[code] * rhs;
    }
    return n;
};
