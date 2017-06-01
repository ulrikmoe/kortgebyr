/**
*   @author Ulrik Moe, Christian Blach, Joakim Sindholt
*   @license GPLv3
**/

function $(s) { return document.getElementById(s); }

let $currency = 'DKK';
let $qty = 200;
let $avgvalue = new Currency(500, $currency);
let $revenue = $avgvalue.scale($qty);
let $acqs = ACQs.slice(0); // Create copy
let $cards = { dankort: 1, visa: 1 };
let $features = {};
let $dankortscale = 0.77; // 77% to Dankort. 23% to Visa/MC etc.

function updateSettings() {
    const elems = this.elements;
    $currency = elems.currency.value;
    $avgvalue = new Currency(elems.avgvalue.value | 0, $currency);
    $qty = elems.qty.value | 0;
    $revenue = $avgvalue.scale($qty);
    $cards = {};
    $features = {};
    $acqs = elems.acquirer.value; // Index

    if ($acqs === 'auto') {
        $acqs = ACQs.slice(0); // Copy of ACQs
    } else {
        $acqs = [ACQs[0], ACQs[$acqs]];
    }

    const cards = elems['cards[]'];
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].checked) {
            $cards[cards[i].value] = 1;
        }
    }

    const features = elems['features[]'];
    for (let i = 0; i < features.length; i++) {
        if (features[i].checked) {
            $features[features[i].value] = 1;
        }
    }

    $dankortscale = (!$cards.visa) ? 1 : ($cards.dankort || $cards.forbrugsforeningen) ? 0.77 : 0;

    $('tbody').innerHTML = '';
    if ($cards.dankort || $cards.visa) {
        build();
    }
    $('currency_code').textContent = $currency;
}


// Check if object-x' properties is in object-y.
function x_has_y(objx, objy) {
    for (let prop in objy) {
        if (!objx[prop]) { return false; }
    }
    return true;
}

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
function acqcombo(psp) {
    const A = $acqs;
    const acqarr = [];

    // Check if a single acq support all cards.
    for (let i = 0; i < A.length; i++) {
        const acq = A[i];
        if (psp.acquirers[acq.name]) {
            // Return acq if it support all $cards.
            if (x_has_y(acq.cards, $cards)) { return [acq]; }
            acqarr.push(acq);
        }
    }

    // Nope. Then we'll need to search for a combination of acquirers.
    const len = acqarr.length;
    for (let i = 0; i < len; i++) {
        const primary = acqarr[i];
        let missingCards = {};

        for (let card in $cards) {
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


function sumTxt(obj) {
    const frag = document.createDocumentFragment();
    frag.textContent = sum(obj).print();
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
        const cardscale = (acq.name === 'Nets') ? $dankortscale : 1 - $dankortscale;
        acq.trnfees = acq.fees.trn().scale($qty).scale(cardscale);
        acq.TC = acq.trnfees;
        if (acq.fees.monthly) { acq.TC = acq.TC.add(acq.fees.monthly); }
    }
    $acqs.sort(function (obj1, obj2) { return obj1.TC.dkk() - obj2.TC.dkk(); });

    psploop:
    for (let i = 0; i < PSPs.length; i++) {
        const psp = PSPs[i];
        const setup = {};
        const monthly = {};
        const trnfee = {};

        if (psp.fees.setup) { setup[psp.name] = psp.fees.setup; }
        if (psp.fees.monthly) { monthly[psp.name] = psp.fees.monthly; }
        if (psp.fees.trn && psp.fees.trn()) { trnfee[psp.name] = psp.fees.trn(); }

        // Check if psp support all enabled payment methods
        for (let card in $cards) {
            if (!psp.cards[card]) { continue psploop; }
        }

        // Check if psp support all enabled features
        for (let i in $features) {
            const feature = psp.features[i];
            if (!feature) { continue psploop; }
            if (feature.setup) { setup[i] = feature.setup; }
            if (feature.monthly) { monthly[i] = feature.monthly; }
            if (feature.trn) { trnfee[i] = feature.trn; }
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
                if (acq.fees.setup) { setup[acq.name] = acq.fees.setup; }
                if (acq.fees.monthly) { monthly[acq.name] = acq.fees.monthly; }
                trnfee[acq.name] = acq.trnfees;

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
                for (let card in acq.cards) { acqcards[card] = acq.cards[card]; }
            }
        } else {
            const acqtext = document.createElement('p');
            acqtext.classList.add('acquirer-included');
            acqtext.textContent = 'Inkluderet';
            acqfrag.appendChild(acqtext);
        }

        const cardfrag = document.createDocumentFragment();
        for (let card in psp.cards) {
            if (psp.acquirers && !acqcards[card]) { continue; }

            //  Some cards/methods (e.g. mobilepay) add extra costs.
            if (typeof psp.cards[card] === 'object') {
                if (!$cards[card]) { continue; }
                if (psp.cards[card].setup) { setup[card] = psp.cards[card].setup; }
                if (psp.cards[card].monthly) { monthly[card] = psp.cards[card].monthly; }
                if (psp.cards[card].trn) { trnfee[card] = psp.cards[card].trn; }
            }

            const cardicon = new Image(22, 15);
            cardicon.src = '/img/cards/' + card + '.svg?1';
            cardicon.alt = card;
            cardicon.className = 'card';
            cardfrag.appendChild(cardicon);
        }

        // Calculate TC and sort psps
        const totalcost = sum(monthly, trnfee);
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
        const psplogo = new Image();
        psplogo.src = '/img/psp/' + psp.logo + '?{{ imgtoken }}';
        psplogo.alt = psp.name;
        const pspname = document.createElement('span');
        pspname.textContent = psp.name;
        psplink.appendChild(psplogo);
        psplink.appendChild(pspname);
        pspfrag.appendChild(psplink);

        // cardfee calc.
        const cardfeefrag = document.createDocumentFragment();
        const p1 = document.createElement('p');
        const cardfee = totalcost.scale(1 / ($qty || 1));
        cardfeefrag.textContent = cardfee.print();
        p1.textContent = '(' + (cardfee.scale(1 / $avgvalue.dkk()).dkk() * 100).toFixed(3).replace('.', ',') + '%)';
        p1.className = 'procent';
        cardfeefrag.appendChild(p1);

        const tr = document.createElement('tr');
        tr.insertCell(-1).appendChild(pspfrag);
        tr.insertCell(-1).appendChild(acqfrag);
        tr.insertCell(-1).appendChild(cardfrag);
        tr.insertCell(-1).appendChild(sumTxt(setup));
        tr.insertCell(-1).appendChild(sumTxt(monthly));
        tr.insertCell(-1).appendChild(sumTxt(trnfee));
        tr.insertCell(-1).textContent = totalcost.print();
        tr.insertCell(-1).appendChild(cardfeefrag);
        frag.insertBefore(tr, frag.childNodes[sort]);
    }
    $('tbody').appendChild(frag);
}

//===========================
//    Lets build
//===========================

build('init');
// TODO: Fix 2x build on some input changes.
$('form').addEventListener('change', updateSettings);
$('form').addEventListener('input', updateSettings);
