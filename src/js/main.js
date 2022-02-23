/* @author Ulrik Moe, Christian Blach, Joakim Sindholt */

const country = 'DK';
const $currency = 'DKK';
let opts = {
    acquirer: 'auto',
    module: '',
    currency: 'DKK',
    qty: 200,
    avgvalue: 645,
    cards: { visa: 1 },
    features: {}
};
let $dankortscale;
let $avgvalue;
let $revenue;
let $qty;


function settings(o) {
    $qty = o.qty;
    $avgvalue = new Currency(o.avgvalue, $currency);
    $revenue = $avgvalue.scale($qty);
    $dankortscale = 0; //(o.cards.dankort) ? 0.72 : 0;
    build();
}


function cost2obj(cost, obj, name) {
    for (const i in cost) {
        let value = cost[i];
        const type = typeof value;
        if (typeof value === 'function') {
            value = value(obj);
        }
        if (!value || typeof value !== 'object') { continue; }
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
        info.addEventListener('mouseover', showTooltip);
        frag.appendChild(info);
    }
    return frag;
}


function acqSort() {
    const arr = [];
    if (opts.acquirer === 'auto') {
        for (const name in ACQs) {
            const acq = ACQs[name];
            const scale = (acq.name === 'Dankort') ? $dankortscale : 1 - $dankortscale;
            const obj = {
                name: name,
                ref: acq
            };

            obj.TC = obj.trn = acq.fees.trn().scale($qty * scale);

            if (acq.fees.monthly) {
                obj.TC = obj.TC.add((typeof acq.fees.monthly === 'function')
                    ? acq.fees.monthly() : acq.fees.monthly);
            }
            arr.push(obj);
        }
        arr.sort((o1, o2) => o1.TC.order($currency) - o2.TC.order($currency));
    } else {
        const acq = ACQs[opts.acquirer];
        const scale = (acq.name === 'Dankort') ? $dankortscale : 1 - $dankortscale;
        const obj = {
            name: opts.acquirer,
            ref: acq
        };
        obj.TC = obj.trn = acq.fees.trn().scale($qty * scale);
        if (acq.fees.monthly) {
            obj.TC = obj.TC.add((typeof acq.fees.monthly === 'function')
                ? acq.fees.monthly() : acq.fees.monthly);
        }
        arr.push(obj);
    }
    return arr;
}


function build() {
    // 1) Calculate acquirer costs and sort by TC.
    const acqArr = acqSort();

    // 2) Create array of PSPs with full support
    const pspArr = PSPs.filter((psp) => {
        if (opts.acquirer !== 'auto') {
            if (!psp.acquirers) return false;
            if (!psp.acquirers[opts.acquirer]) return false;
        }

        if (psp.acquirers) {
            // Regular PSP: skip if no supported acq.
            // TODO: Improve this!
            let found;
            for (const acq of acqArr) {
                if (psp.acquirers[acq.name]) {
                    found = true;
                    break;
                }
            }
            if (!found) return false;
        } else {
            // All-in-ones: Skip if card not supported
            for (const card in opts.cards) {
                if (!psp.cards[card]) return false;
            }
        }

        // Skip if PSP does not support all features
        for (const feature in opts.features) {
            if (!psp.features[feature]) return false;
        }
        return true;
    });

    // 3) Calculate PSP costs
    for (const psp of pspArr) {
        const fees = { setup: {}, monthly: {}, trn: {} };

        if (psp.acquirers) {
            const acq = acqArr.find(o => psp.acquirers[o.name]);
            fees.acq = acq;
            cost2obj({
                setup: acq.setup,
                monthly: acq.monthly,
                trn: acq.trn
            }, fees, acq.name);
        }

        for (const i in psp.features) {
            cost2obj(psp.features[i], fees, i);
        }

        for (const card in psp.cards) {
            cost2obj(psp.cards[card], fees, card);
        }

        cost2obj(psp.fees, fees, psp.name);
        fees.TC = sum(merge(fees.monthly, fees.trn));
        psp.fees = fees;
    }

    // 4) Sort PSP array.
    pspArr.sort((o1, o2) => o1.fees.TC.order($currency) - o2.fees.TC.order($currency));

    // 5) Build table
    const tbody = document.createElement('tbody');
    tbody.id = 'tbody';
    for (const psp of pspArr) {
        const acq = psp.fees.acq;
        const tr = document.createElement('tr');

        // PSP logo
        const pspCell = tr.insertCell(-1);
        pspCell.innerHTML = `<a href="${psp.link}" class="psp"><img width="${psp.wh[0]}"
            height="${psp.wh[1]}" src="/img/psp/${psp.logo}" alt="${psp.name}"><span>${psp.name}</span></a>`;

        if (psp.reseller) {
            pspCell.innerHTML += `<p class="reseller">Reseller af ${psp.reseller}</p>`;
        }

        // Acquirer
        const acqCell = tr.insertCell(-1);
        if (psp.acquirers) {
            acqCell.innerHTML = `<img width="${acq.ref.wh[0]}" height="${acq.ref.wh[1]}"
                class="acqlogo" src="/img/psp/${acq.ref.logo}" alt="${acq.ref.name}">`;
        } else {
            acqCell.innerHTML = '<p class="acquirer-included">Inkluderet</p>';
        }

        // Card icons
        const cards = (psp.acquirers) ? acq.ref.cards : psp.cards;
        const cardCell = tr.insertCell(-1);
        cardCell.className = 'cardtd';
        for (const card in cards) {
            cardCell.innerHTML += `<img width="22" height="15" class="card"
                src="/img/cards/${card}.svg">`;
        }

        // Monthly fees
        tr.insertCell(-1).appendChild(sumTxt(psp.fees.monthly));

        // Transaction fees
        tr.insertCell(-1).appendChild(sumTxt(psp.fees.trn));

        // Total per month
        tr.insertCell(-1).appendChild(sumTxt(psp.fees.TC));

        // Cost per transaction
        const tcCell = tr.insertCell(-1);




        // cardfee calc.
        const cardfee = psp.fees.TC.scale(1 / ($qty || 1));
        const cardfeepct = String(Math.round(cardfee.order($currency) * 10000 / $avgvalue
            .order($currency)) / 100);

        const cardfeefrag = document.createDocumentFragment();
        cardfeefrag.textContent = cardfee.print($currency);
        const p1 = document.createElement('p');
        p1.textContent = '(' + cardfeepct.replace('.', currency_map[$currency].d) + '%)';
        p1.className = 'procent';
        cardfeefrag.appendChild(p1);

        tcCell.appendChild(cardfeefrag);
        tbody.appendChild(tr);
    }
    document.getElementById('tbody').replaceWith(tbody);
}


function showTooltip() {
    if (!this.firstElementChild) {
        const infobox = document.createElement('ul');
        const obj = this.ttdata;
        for (const prop in obj) {
            const li = document.createElement('li');
            li.textContent = prop + ': ' + obj[prop].print($currency);
            infobox.appendChild(li);
        }
        this.appendChild(infobox);
    }
}


function formEvent(evt) {
    if (evt.type === 'input' && evt.target.type !== 'number') return;
    if (evt.type === 'change' && evt.target.type === 'number') return;
    opts = form2obj(this);
    settings(opts);
}

(() => {
    const form = document.getElementById('form');
    if (form) {
        settings(opts);
        form.addEventListener('change', formEvent);
        form.addEventListener('input', formEvent);
        obj2form(opts, form);
    }
})();
