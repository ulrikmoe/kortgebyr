/* @author Ulrik Moe, Christian Blach, Joakim Sindholt */
/* global Currency, ACQs, PSPs, updateCurrency, showTooltip, currency_map, form2obj, obj2form */

const country = 'DK';
let opts = {
    acquirer: 'auto',
    currency: 'DKK',
    qty: 200,
    avgvalue: 645,
    cards: { dankort: 1, visa: 1, mastercard: 1 },
    features: { MobilePay: 1 },
    modules: {}
};
let $dankortscale;
let $acqs;
let $avgvalue;
let $currency;
let $revenue;
let $qty;

function settings(o) {
    $qty = o.qty;
    $avgvalue = new Currency(o.avgvalue, o.currency);
    $revenue = $avgvalue.scale($qty);
    $acqs = (o.acquirer === 'auto') ? ACQs.slice(0) : (country === 'DK')
        ? [ACQs[0], ACQs[o.acquirer]] : [ACQs[o.acquirer]];

    if (!o.cards.visa) {
        $dankortscale = 1;
        disableCards(['diners', 'jcb', 'amex']);

        if (!o.cards.dankort) {
            document.getElementById('tbody').innerHTML = '';
            return disableCards(['forbrugsforeningen', 'diners', 'jcb', 'amex', 'mobilepay']);
        }
    } else if (!o.cards.dankort) {
        $dankortscale = 0;
        disableCards(['forbrugsforeningen']);
    } else {
        $dankortscale = 0.72;
        disableCards([]);
    }

    if ($currency === o.currency) {
        build();
    } else {
        $currency = o.currency;
        updateCurrency().then(() => build());
        document.getElementById('currency_code').textContent = $currency;
    }
}

// Check if object-x' properties is in object-y.
function x_has_y(objx, objy) {
    for (const prop in objy) {
        if (!objx[prop]) { return false; }
    }
    return true;
}

function sum(obj) {
    let ret = new Currency();
    for (const fee in obj) {
        ret = ret.add(obj[fee]);
    }
    return ret;
}

function merge(o1, o2) {
    const obj = {};
    for (let i = 0; i < arguments.length; i++) {
        const costobj = arguments[i];
        for (const z in costobj) {
            if (obj[z]) {
                obj[z] = obj[z].add(costobj[z]);
            } else {
                obj[z] = costobj[z];
            }
        }
    }
    return obj;
}

// Find combination of acquirers that support all cards
function acqcombo(psp) {
    const A = $acqs;
    const acqarr = [];

    // Check if a single acq support all cards.
    for (let i = 0; i < A.length; i++) {
        const acq = A[i];
        if (psp.acquirers[acq.name]) {
            // Return acq if it support all cards.
            if (x_has_y(acq.cards, opts.cards)) { return [acq]; }
            acqarr.push(acq);
        }
    }

    // Nope. Then we'll need to search for a combination of acquirers.
    const len = acqarr.length;
    for (let i = 0; i < len; i++) {
        const primary = acqarr[i];
        const missingCards = {};

        for (const card in opts.cards) {
            if (!primary.cards[card]) { missingCards[card] = true; }
        }

        // Find secondary acquirer with the missing cards.
        for (let j = i + 1; j < len; j++) {
            const secondary = acqarr[j];
            if (x_has_y(secondary.cards, missingCards)) {
                return [primary, secondary];
            }
        }
    }
    return null;
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

// Build table
function build(action) {
    const data = [];
    const frag = document.createDocumentFragment();

    // Calculate acquirer costs and sort by Total Costs.
    for (let i = 0; i < $acqs.length; i++) {
        const acq = $acqs[i];
        const cardscale = (acq.name === 'Dankort') ? $dankortscale : 1 - $dankortscale;
        acq.TC = acq.trnfees = acq.fees.trn().scale($qty).scale(cardscale);

        if (acq.fees.monthly) {
            let monthly = acq.fees.monthly;
            if (typeof monthly === 'function') { monthly = monthly(); }
            acq.TC = acq.TC.add(monthly);
        }
    }
    $acqs.sort((obj1, obj2) => obj1.TC.order($currency) - obj2.TC.order($currency));

    psploop:
    for (let i = 0; i < PSPs.length; i++) {
        const psp = PSPs[i];
        const fees = { setup: {}, monthly: {}, trn: {} };

        // Check if psp support all enabled payment methods
        for (const card in opts.cards) {
            if (!psp.cards[card]) { continue psploop; }
        }

        // Check if psp support all enabled features
        for (const i in opts.features) {
            const feature = psp.features[i];
            if (!feature) { continue psploop; }
            cost2obj(feature, fees, i);
        }

        // If an acquirer has been selected then hide the Stripes
        if ($acqs.length < 3 && !psp.acquirers) { continue; }

        const acqfrag = document.createDocumentFragment();
        const acqcards = {};
        let acqArr = [];
        if (psp.acquirers) {
            acqArr = acqcombo(psp); // Find acq with full card support

            if (!acqArr) { continue; }
            for (let j = 0; j < acqArr.length; j++) {
                const acq = acqArr[j];
                cost2obj({
                    setup: acq.fees.setup,
                    monthly: acq.fees.monthly,
                    trn: acq.trnfees
                }, fees, acq.name);

                const acqlink = document.createElement('a');
                acqlink.href = acq.link;
                acqlink.className = 'acq';
                const acqlogo = new Image();
                acqlogo.src = '/img/psp/' + acq.logo;
                acqlogo.alt = acq.name;
                acqlink.appendChild(acqlogo);
                acqfrag.appendChild(acqlink);
                acqfrag.appendChild(document.createElement('br'));

                // Construct a new acqcards
                for (const card in acq.cards) { acqcards[card] = acq.cards[card]; }
            }
        } else {
            const acqtext = document.createElement('p');
            acqtext.classList.add('acquirer-included');
            acqtext.textContent = 'Inkluderet';
            acqfrag.appendChild(acqtext);
        }

        const cardfrag = document.createDocumentFragment();
        for (const card in psp.cards) {
            if (psp.acquirers && !acqcards[card]) { continue; }

            //  Some cards/methods (e.g. mobilepay) add extra costs.
            if (typeof psp.cards[card] === 'object') {
                if (!opts.cards[card]) { continue; }
                cost2obj(psp.cards[card], fees, card);
            }

            const cardicon = new Image(22, 15);
            cardicon.src = '/img/cards/' + card + '.svg';
            cardicon.alt = card;
            cardicon.className = 'card';
            cardfrag.appendChild(cardicon);
        }
        cost2obj(psp.fees, fees, psp.name);

        // Calculate TC and sort psps
        const totals = merge(fees.monthly, fees.trn);
        const totalcost = sum(totals);
        let sort;
        for (sort = 0; sort < data.length; ++sort) {
            if (totalcost.order($currency) < data[sort]) { break; }
        }
        data.splice(sort, 0, totalcost.order($currency));

        // Create PSP logo.
        const pspfrag = document.createDocumentFragment();
        const psplink = document.createElement('a');
        psplink.target = '_blank';
        psplink.href = psp.link;
        psplink.className = 'psp';
        const psplogo = new Image();
        psplogo.src = '/img/psp/' + psp.logo;
        psplogo.alt = psp.name;
        const pspname = document.createElement('span');
        pspname.textContent = psp.name;
        psplink.appendChild(psplogo);
        psplink.appendChild(pspname);
        pspfrag.appendChild(psplink);
        if (psp.reseller) {
            const reseller = document.createElement('p');
            reseller.className = 'reseller';
            reseller.textContent = 'Reseller af ' + psp.reseller;
            pspfrag.appendChild(reseller);
        }

        // cardfee calc.
        const cardfeefrag = document.createDocumentFragment();
        const p1 = document.createElement('p');
        const cardfee = totalcost.scale(1 / ($qty || 1));
        const cardfeepct = String(Math.round(cardfee.order($currency) * 10000 / $avgvalue
            .order($currency)) / 100);
        cardfeefrag.textContent = cardfee.print($currency);
        p1.textContent = '(' + cardfeepct.replace('.', currency_map[$currency].d) + '%)';
        p1.className = 'procent';
        cardfeefrag.appendChild(p1);

        const tr = document.createElement('tr');
        tr.insertCell(-1).appendChild(pspfrag);
        tr.insertCell(-1).appendChild(acqfrag);

        const cardtd = tr.insertCell(-1);
        cardtd.appendChild(cardfrag);
        cardtd.className = 'cardtd';

        tr.insertCell(-1).appendChild(sumTxt(fees.setup));
        tr.insertCell(-1).appendChild(sumTxt(fees.monthly));
        tr.insertCell(-1).appendChild(sumTxt(fees.trn));
        tr.insertCell(-1).appendChild(sumTxt(totals));
        tr.insertCell(-1).appendChild(cardfeefrag);
        frag.insertBefore(tr, frag.childNodes[sort]);
    }
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';
    tbody.appendChild(frag);
}

function disableCards(arr) {
    const o = {};
    for (let card of arr) { o[card] = 1; }

    const ocards = document.getElementsByClassName('ocards');
    for (let elem of ocards) {
        if (o[elem.value]) {
            if (opts.cards[elem.value]) {
                // Deselect the card and remove from opts
                elem.checked = false;
                delete opts.cards[elem.value];
            }
            elem.disabled = true;
        } else {
            elem.disabled = false;
        }
    }
}

let cachedString;
function formEvent(evt) {
    opts = form2obj(this);
    const optsString = JSON.stringify(opts);
    if (optsString !== cachedString) {
        settings(opts);
    }
    cachedString = optsString;
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
