
const $currency = 'DKK';
let opts = {
    acquirer: 'auto',
    module: '',
    currency: 'DKK',
    qty: 200,
    avgvalue: 715,
    cards: {},
    features: {},
    shopify: 'Basic'
};
const $dankortscale = 0.60;
let $avgvalue;
let $revenue;
let $revenueIntl;
let $qty;
let $qtyDankort;
let $qtyIntl;
let $qtyMobilepay; // https://quickpay.net/quickpay-index/
let $trnfeeDankort;

function settings(o) {
    document.getElementById('shopify-field').classList.toggle('hide', o.module !== 'shopify');
    document.getElementById('shopify-infobox').classList.toggle('hide', o.module !== 'shopify');
    if (o.module === 'shopify') {
        const tier = (opts.shopify === 'Basic') ? 2 : (opts.shopify === 'Shopify') ? 1 : 0.6;
        document.getElementById('shopify-tier').textContent = tier.toString().replace('.', ',') + '%';
        document.getElementById('shopify-subscription').textContent = 'Shopify ' + opts.shopify;
    }
    $qty = o.qty || 0;
    $qtyDankort = Math.ceil($dankortscale * $qty);
    $qtyIntl = $qty - $qtyDankort;
    $qtyMobilepay = (o.features.mobilepay) ? Math.ceil(0.6 * $qty) : 0;
    $avgvalue = new Currency(o.avgvalue, $currency);
    $revenue = $avgvalue.scale($qty);
    $revenueIntl = $revenue.scale(1 - $dankortscale);
    $trnfeeDankort = $revenue.scale($dankortscale).scale(0.32 / 100);
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
    if (Object.keys(obj).length) {
        const info = document.createElement('div');
        info.className = 'info';
        info.ttdata = obj;
        info.textContent = sum(obj).print($currency);
        return info;
    } else {
        return document.createTextNode(sum(obj).print($currency));
    }
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
    const acqArrDK = acqSort($qtyIntl);
    const dankortFees = DankortFees.trn().scale($qtyDankort);

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
            const tier = (opts.shopify === 'Basic') ? 2 : (opts.shopify === 'Shopify') ? 1 : 0.6;
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
        <a target="_blank" href="${psp.link}">
            <img class="td--psp--img" width="${Math.round(psp.logo[1])}" height="${Math.round(psp.logo[2])}"
                src="/img/betalingsløsning/${psp.logo[0]}" alt="${psp.name} betalingsløsning"
                title="${psp.name} logo">
            <br>
            <span>${psp.title}</span>
        </a>`;

        if (psp.note) {
            pspCell.innerHTML += `<p class="td--psp--note">${psp.note}</p>`;
        }

        // Acquirer
        const ol = document.createElement('ol');
        ol.classList.add('td--acq-list');
        if (psp.dankort) {
            ol.classList.add('td--acq-list-plus');
            ol.innerHTML += `<li><a target="_blank" href="https://www.dankort.dk/dk/betaling-i-webshop/" title="Tag imod Dankort med en Dankortaftale">Dankort</a></li>`;
        }
        if (psp.acq) {
            ol.innerHTML += `<li><a target="_blank" href="${acq.ref.link}" title="Tag imod internationale kort med ${acq.ref.name}">${acq.ref.name}</a></li>`;
        } else {
            ol.innerHTML += `<li class="acquirer-included">${psp.name}</li>`;
        }
        const acqCell = tr.insertCell(-1);
        acqCell.className = 'td--acq';
        acqCell.appendChild(ol);

        /*
        const img = new Image(18, 18);
        img.src = '/img/info.svg';
        img.className = 'info1 td--acq-info';
        acqCell.appendChild(img);
        */

        // Card icons
        const cardCell = tr.insertCell(-1);
        const cardsArr = (psp.acq) ? acq.ref.cards : psp.cards;
        cardCell.className = 'td--cards';
        if (psp.dankort) cardCell.appendChild(addCard('dankort'));
        for (const card of cardsArr) {
            cardCell.appendChild(addCard(card));
        }

        // Binding period (term)
        const termCell = tr.insertCell(-1);
        switch (psp.term) {
            case undefined:
                termCell.innerHTML = '<i>Ukendt</i>';
                break;
            case 0:
                termCell.innerHTML = 'Nej';
                break;
            case 1:
                termCell.innerHTML = '1 md.';
                break;
            default:
                termCell.innerHTML = (psp.term > 12) ? `<span class="term-warn">${psp.term} mdr.</span>` : `${psp.term} mdr.`;
                break;
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
        (${kortgebyrPct.replace('.', currency_map[$currency].d)}%)</p>`;
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

    const obj = e.target.ttdata;
    for (const prop in obj) {
        let name = (prop === 'Dankortaftale') ? 'Dankortaftale (0,32%)' : prop;
        if (ACQs[name.toLowerCase()]) name = name + ' indløsning';
        const li = document.createElement('li');
        li.innerHTML = `<div class="info--ul--div1">${name}:</div> <div>${obj[prop].print($currency, true)}</div>`;
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
    settings(opts); // TODO: remove
    const form = document.getElementById('form');
    form.addEventListener('change', formEvent);
    form.addEventListener('input', formEvent);

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
