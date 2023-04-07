/* @author Ulrik Moe, Christian Blach, Joakim Sindholt */

const $currency = 'DKK';
let opts = {
    acquirer: 'auto',
    module: '',
    currency: 'DKK',
    qty: 200,
    avgvalue: 645,
    cards: {},
    features: {},
    shopify: 'Basic'
};
const $dankortscale = 0.72;
const $mobilepay = 0.60; // https://quickpay.net/dk/quickpay-index/dk
let $avgvalue;
let $revenue;
let $qty;


function settings(o) {
    // o.module === 'shopify'
    document.getElementById('shopify').classList.toggle('hide', o.module !== 'shopify');
    document.getElementById('shopify-infobox').classList.toggle('hide', o.module !== 'shopify');
    if (o.module === 'shopify') {
        const tier = (opts.shopify === 'Basic') ? 2 : (opts.shopify === 'Shopify') ? 1 : 0.5;
        document.getElementById('shopify-tier').textContent = tier.toString().replace('.', ',') + '%';
        document.getElementById('shopify-subscription').textContent = 'Shopify ' + opts.shopify;
    }
    $qty = o.qty || 0;
    $avgvalue = new Currency(o.avgvalue, $currency);
    $revenue = $avgvalue.scale($qty);
    build();
}

function cost2obj(cost, obj, name) {
    for (const i in cost) {
        const value = (typeof cost[i] === 'function') ? cost[i](obj) : cost[i];
        if (!value) continue;
        if (!Object.keys(value.amounts).length) continue;
        obj[i][name] = value;
    }
}

function sumTxt(obj) {
    const frag = document.createDocumentFragment();
    frag.textContent = sum(obj).print($currency);
    if (Object.keys(obj).length) {
        const info = document.createElement('div');
        info.textContent = '[?]';
        info.className = 'info';
        info.ttdata = obj;
        frag.appendChild(info);
    }
    return frag;
}


function calc(x) {
    if (!x) return new Currency();
    return (typeof x === 'function') ? x() : x;
}


function acqCalc(name, qty) {
    const acq = ACQs[name];

    // Skip if card not supported
    for (const card in opts.cards) {
        if (!acq.cards.has(card)) return false;
    }

    const obj = {
        name: name,
        ref: acq,
        calc: {
            monthly: calc(acq.fees.monthly),
            trn: calc(acq.fees.trn).scale(qty),
            setup: calc(acq.fees.setup)
        }
    };
    obj.calc.total = obj.calc.trn.add(obj.calc.monthly);
    return obj;
}


function acqSort(qty) {
    const arr = [];
    if (opts.acquirer === 'auto') {
        for (const name in ACQs) {
            const obj = acqCalc(name, qty);
            if (!obj) continue;
            arr.push(obj);
        }
        arr.sort((o1, o2) => o1.calc.total.order($currency) -
            o2.calc.total.order($currency));
    } else {
        const obj = acqCalc(opts.acquirer, qty);
        if (obj) arr.push(obj);
    }
    return arr;
}


function build() {
    // 1) Calculate acquirer costs and sort by total cost.
    const acqArr = acqSort($qty);
    // TODO: round dankortscale
    const acqArrDK = acqSort($qty * (1 - $dankortscale));
    const dankortFees = DankortFees.trn().scale($qty * $dankortscale);

    // 2) Create array of PSPs with full support
    const pspArr = PSPs.filter((psp) => {
        // Skip if PSP does not support shopping cart (module)
        if (opts.module !== '') {
            if (!psp.modules.has(opts.module)) return false;
        }

        // Skip if PSP does not support all features
        for (const feature in opts.features) {
            if (!psp.features.has(feature)) return false;
        }

        if (psp.acqs) {
            // Dankort: Pick the optimal acquirer array.
            const arr = (psp.dankort) ? acqArrDK : acqArr;

            // Skip if PSP does not support any acq in acqArr
            psp.acq = arr.find(acq => psp.acqs.has(acq.name));

            // TMP fix for shopify
            if (opts.module === 'shopify' && psp.logo[0] === 'quickpay.svg') {
                psp.acq = arr.find(acq => acq.name === 'clearhaus');
            }
            if (!psp.acq) return false;
        } else {
            // skip if acq is selected (all-in-ones have no acqs)
            if (opts.acquirer !== 'auto') return false;

            // Skip if card not supported
            for (const card in opts.cards) {
                if (!psp.cards.has(card)) return false;
            }
        }
        return true;
    });

    // 3) Calculate PSP costs
    for (const psp of pspArr) {
        const calc = { setup: {}, monthly: {}, trn: {} };
        // Tmp. fix for Shopify
        if (opts.module === 'shopify' && psp.logo[0] !== 'shopify.svg') {
            const tier = (opts.shopify === 'Basic') ? 2 : (opts.shopify === 'Shopify') ? 1 : 0.5;
            cost2obj({
                trn: $revenue.scale(tier / 100)
            }, calc, `Shopify gebyr (${tier}%)`);
        }
        if (psp.acq) {
            if (psp.dankort) {
                cost2obj({
                    trn: dankortFees
                }, calc, 'Dankortaftale');
            }
            cost2obj({
                setup: psp.acq.calc.setup,
                monthly: psp.acq.calc.monthly,
                trn: psp.acq.calc.trn
            }, calc, psp.acq.ref.name);
        }

        // TODO: Move to dk.js
        if (opts.features.mobilepay) {
            cost2obj({
                monthly: new Currency(49, 'DKK'),
                trn: new Currency($qty * $mobilepay, 'DKK')
            }, calc, 'MobilePay');
        }
        cost2obj(psp.fees, calc, psp.title);
        psp.calc = calc;
        psp.calc.total = sum(merge(calc.monthly, calc.trn));
    }

    // 4) Sort PSP array.
    pspArr.sort((o1, o2) => o1.calc.total.order($currency) - o2.calc.total.order($currency));

    // 5) Build table
    const tbody = document.createElement('tbody');
    tbody.id = 'tbody';
    for (const psp of pspArr) {
        const acq = psp.acq;
        const tr = document.createElement('tr');

        // PSP logo
        const pspCell = tr.insertCell(-1);
        pspCell.className = 'td--psp';
        pspCell.innerHTML = `
        <a rel="nofollow" target="_blank" href="${psp.link}">
            <img class="td--psp--img" width="${psp.logo[1]}" height="${psp.logo[2]}"
                src="/img/betalingsløsning/${psp.logo[0]}" alt="${psp.name} logo"
                title="${psp.name} logo">
            <br>
            <span>${psp.title}</span>
        </a>`;

        if (psp.note) {
            pspCell.innerHTML += `<p class="td--psp--note">${psp.note}</p>`;
        }

        // Acquirer
        const acqCell = tr.insertCell(-1);
        if (psp.acq) {
            acqCell.innerHTML = `<img width="${acq.ref.logo[1]}" height="${acq.ref.logo[2]}"
                src="/img/indløser/${acq.ref.logo[0]}" alt="${acq.ref.name}" title="${acq.ref.name} indløsningsaftale">`;
        } else {
            acqCell.innerHTML = '<p class="acquirer-included">Inkluderet</p>';
        }

        // Card icons
        const cardCell = tr.insertCell(-1);
        const cardsArr = (psp.acq) ? acq.ref.cards : psp.cards;
        cardCell.className = 'td--cards';
        if (psp.dankort) cardCell.appendChild(addCard('dankort'));
        for (const card of cardsArr) {
            cardCell.appendChild(addCard(card));
        }

        // Monthly fees
        tr.insertCell(-1).appendChild(sumTxt(psp.calc.monthly));

        // Transaction fees
        tr.insertCell(-1).appendChild(sumTxt(psp.calc.trn));

        // Total per month
        tr.insertCell(-1).textContent = psp.calc.total.print($currency);

        // Total cost per transaction
        const kortgebyr = psp.calc.total.scale(1 / ($qty || 1));
        const kortgebyrPct = String(Math.round(kortgebyr.order($currency) * 10000 / $avgvalue
            .order($currency)) / 100);
        const totalCell = tr.insertCell(-1);
        totalCell.className = 'td--total';
        totalCell.innerHTML = `${kortgebyr.print($currency)} <p class="td--total--pct">
        (&asymp; ${kortgebyrPct.replace('.', currency_map[$currency].d)}%)</p>`;
        tbody.appendChild(tr);
    }
    document.getElementById('tbody').replaceWith(tbody);
}

function addCard(name) {
    const img = new Image(22, 15);
    img.className = 'card';
    img.alt = name;
    img.src = '/img/betalingskort/' + name + '.svg';
    return img;
}


function showTooltip(e) {
    const infobox = document.createElement('ul');
    infobox.className = 'info--ul';
    infobox.style.left = e.clientX + 'px';
    infobox.style.bottom = (15 + window.innerHeight - window.scrollY - e.clientY) + 'px';

    let nameMaxLen = 0;
    let priceMaxLen = 0;
    const arr = [];
    const obj = e.target.ttdata;
    for (const prop in obj) {
        const o = {
            name: prop,
            price: obj[prop].print($currency, true)
        };
        if (prop === 'Dankortaftale') {
            o.name = 'Dankortaftale (0,32%)';
        } else if (ACQs[prop.toLowerCase()]) {
            o.name = prop + ' indløsning';
        }
        arr.push(o);
        nameMaxLen = Math.max(o.name.length, nameMaxLen);
        priceMaxLen = Math.max(o.price.length, priceMaxLen);
    }

    for (const o of arr) {
        const li = document.createElement('li');
        const str = o.name + ': ' + ' '.repeat((nameMaxLen - o.name.length) + (priceMaxLen - o.price.length));
        li.textContent = str + ' ' + o.price;
        infobox.appendChild(li);
    }
    document.body.appendChild(infobox);
}


function formEvent(evt) {
    if (evt.type === 'input' && evt.target.type !== 'number') return;
    if (evt.type === 'change' && evt.target.type === 'number') return;
    opts = form2obj(this);
    settings(opts);
}

(() => {
    const params = (new URL(document.location)).searchParams;
    for (const arr of params) {
        if (arr[0] in opts) opts[arr[0]] = arr[1];
    }

    const form = document.getElementById('form');
    if (form) {
        settings(opts);
        form.addEventListener('change', formEvent);
        form.addEventListener('input', formEvent);
        obj2form(opts, form);
    }

    document.body.addEventListener('click', (e) => {
        const elems = document.querySelectorAll('.info--ul');
        for (const elem of elems) {
            elem.remove();
        }
        if (e.target.className === 'info') {
            showTooltip(e);
        }
    });

    document.body.addEventListener('touchstart', () => {
        const elems = document.querySelectorAll('.info--ul');
        for (const elem of elems) {
            elem.remove();
        }
    });

})();
