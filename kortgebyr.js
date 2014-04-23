function $(s) { return document.getElementById(s); }

var color_error = "#f88";
var color_good = null;

function getint(k)
{
    var elem = $(k);
    var str = elem.value.trim();
    if (!isNaN(parseFloat(str)) && isFinite(str) &&
        parseFloat(str) == parseInt(str, 10)) {
        $(k).style.background = color_good;
        return parseInt(str, 10);
    }
    $(k).style.background = color_error;
    return null;
}

function setint(k, v)
{
    $(k).value = parseInt(v, 10);
    $(k).style.background = color_good;
}

function mkcurregex()
{
    var a = [];
    for (var k in currency_rmap) { a.push(k); }
    for (var k in currency_value) { a.push(k); }
    return RegExp("^ *([0-9][0-9., ]*)(" + a.join("|") + ")? *$", "i");
}

var curregex = mkcurregex();
function getcurrency(k)
{
    var a = $(k).value.match(curregex);
    if (a == null) {
        $(k).style.background = color_error;
        return null;
    }
    $(k).style.background = color_good;

    var c = a[2] ? a[2] : 'DKK';
    for (var k in currency_rmap) {
        if (k.toLowerCase() == c.toLowerCase()) {
            c = currency_rmap[k];
            break;
        }
    }

    return new Currency(parseFloat(a[1].replace('.', '').replace(',', '.')), c);
}

function setcurrency(k, v)
{
    $(k).value = v.represent();
    $(k).style.background = color_good;
}

function getoption(k, prefix)
{
    return $(k).options[$(k).selectedIndex].id.substr(prefix.length);
}

function setoption(v, prefix)
{
    $(prefix + v).selected = true;
}

function getpercent(k)
{
    var elem = $(k);
    var str = elem.value.replace('%', '').replace(',', '.').trim();
    if (!isNaN(parseFloat(str)) && isFinite(str)) {
        $(k).style.background = color_good;
        return parseFloat(str);
    }
    $(k).style.background = color_error;
    return null;
}

function setpercent(k, v)
{
    $(k).value = (parseFloat(v) + "%").replace('.', ',');
    $(k).style.background = color_good;
}

function getbool(k)
{
    return $(k).checked ? true : false;
}

function setbool(k, v)
{
    $(k).checked = v ? true : false;
}

var opts = {
    'transactions': {
        get: function () { return getint('transactions'); },
        set: function (v) { setint('transactions', v); },
        def: 100
    },
    'average_value': {
        get: function () { return getcurrency('average_value'); },
        set: function (v) { setcurrency('average_value', v); },
        def: new Currency(450, 'DKK')
    },
    'acquirer': {
        get: function () { return getoption('acquirer', 'acq_'); },
        set: function (v) { setoption(v, 'acq_'); },
        def: 'auto'
    },
    '3dsecure': {
        get: function () { return true; },
        set: function (v) {},
        def: true
    },
    'fraud_fighter': {
        get: function () { return getbool('fraud_fighter'); },
        set: function (v) { setbool('fraud_fighter', v); },
        def: false
    },
    'dankort': {
        get: function () { return getbool('dankort'); },
        set: function (v) { setbool('dankort', v); },
        def: true
    },
    'visa_mastercard': {
        get: function () { return getbool('visa_mastercard'); },
        set: function (v) { setbool('visa_mastercard', v); },
        def: true
    },
    'paii': {
        get: function () { return false; },
        set: function (v) { },
        def: false
    },
    'bitcoin': {
        get: function () { return false; },
        set: function (v) { },
        def: false
    },
    'setup_loss': {
        get: function () { return 0.16; },
        set: function (v) { },
        def: 0.16
    }
}

var sopts = {
    'acquirer_fee_fixed': {
        get: function () { return getcurrency('acquirer_fee_fixed'); },
        set: function (v) { setcurrency('acquirer_fee_fixed', v); },
        hide: function () { $('acquirer_fee_fixed').parentNode.style.display = 'none'; },
        show: function () { $('acquirer_fee_fixed').parentNode.style.display = 'block'; },
        def: function () { return acqs[opts['acquirer'].get()].fee_fixed; }
    },
    'acquirer_fee_variable': {
        get: function () { return getpercent('acquirer_fee_variable'); },
        set: function (v) { setpercent('acquirer_fee_variable', v); },
        hide: function () { $('acquirer_fee_variable').parentNode.style.display = 'none'; },
        show: function () { $('acquirer_fee_variable').parentNode.style.display = 'block'; },
        def: function () { return acqs[opts['acquirer'].get()].fee_variable; }
    }
}

function rnf(n)
{
    return (typeof n == 'function') ? n() : n;
}

function init_acqs()
{
    var s = '<option id="acq_auto">Automatisk</option>';
    for (var k in acqs) {
        if (acqs.hasOwnProperty(k) && k !== 'nets') {
            s += '<option id="acq_' + k + '">' + acqs[k].name + '</option>'
        }
    }
    $('acquirer').innerHTML = s;

    sopts['acquirer_fee_fixed'].hide();
    sopts['acquirer_fee_variable'].hide();
}

function init_defaults()
{
    for (var k in opts) {
        opts[k].set(rnf(opts[k].def));
    }
}

function price_total(v, s, loss)
{
    return v.trans.scale(s).add(v.monthly).add(v.setup.scale(loss / 12));
}

function intersect(a, b)
{
    var r = [];

    for (var i = 0; i < a.length; i++) {
        if (b.indexOf(a[i]) !== -1) { r.push(a[i]); }
    }

    return r;
}

var prevstate = {};
function build(action)
{
    if (action == 'init') {
        init_acqs();
        init_defaults();
    }

    var newstate = {}
    for (var k in opts)  { newstate[k] = rnf(opts[k].get()); }
    for (var k in sopts) { newstate[k] = rnf(sopts[k].get()); }

    if (action == 'init') { prevstate = newstate; }

    for (var k in newstate) {
        if (newstate[k] == null) { newstate[k] = prevstate[k]; }
    }

    var acq = newstate['acquirer'];
    if (newstate['acquirer'] != prevstate['acquirer']) {
        if (acq == "auto") {
            sopts['acquirer_fee_fixed'].hide();
            sopts['acquirer_fee_variable'].hide();
        } else {
            sopts['acquirer_fee_fixed'].show();
            sopts['acquirer_fee_variable'].show();

            sopts['acquirer_fee_fixed'].set(acqs[acq].fee_fixed);
            sopts['acquirer_fee_variable'].set(acqs[acq].fee_variable);
        }
    } else if (acq != "auto") {
        if (newstate['acquirer_fee_fixed'] != prevstate['acquirer_fee_fixed']) {
            acqs[acq].fee_fixed = newstate['acquirer_fee_fixed'];
        }
        if (newstate['acquirer_fee_variable'] != prevstate['acquirer_fee_variable']) {
            acqs[acq].fee_variable = newstate['acquirer_fee_variable'];
        }
    }

    var o = new Options(newstate['transactions'], newstate['average_value'],
                        newstate['fraud_fighter'], newstate['visa_mastercard']);

    var table = $("data");
    table.innerHTML = "";
    var rows = [];
    var dkpoffset = 0;

    var info_icon ='<p class="tooltip"><img src="tooltip.gif"><span>';
    var info_icon_end='</span></p>';

    for (var k in psps) {
        var use_dankort = newstate['dankort'];
        var use_visamc = newstate['visa_mastercard'];
        var dankort_penalty = false;
        if (use_dankort) {
            if (psps[k].cards.indexOf('dankort') < 0 ||
                (psps[k].acquirers.indexOf('nets') < 0 &&
                !psps[k].is_acquirer)) {
                dankort_penalty = true;
                use_dankort = false;
            }
        }
        if (!use_dankort && !use_visamc) { continue; }
        if (use_visamc && psps[k].cards.length == 1 && psps[k].cards[0] == 'dankort') { continue; }

        if (psps[k].is_acquirer && acq != 'auto') { continue; }

        var visamc_scale = 0.18;
        var dankort_scale = 0.82;
        if (!use_dankort) {
            visamc_scale = 1;
            dankort_scale = 0;
        }
        if (!use_visamc) {
            visamc_scale = 0;
            dankort_scale = 1;
        }

        var tmpacq = acq;
        if (tmpacq == "auto") {
            var best = null;
            for (var a in acqs) {
                if (a == "nets") { continue; }
                if (psps[k].acquirers.indexOf(a) < 0) { continue; }
                if (best == null) {
                    tmpacq = a;
                    best = acqs[a].costfn(o);
                    continue;
                }

                var cmp = acqs[a].costfn(o);
                if (price_total(best, visamc_scale, newstate['setup_loss']).dkk() >
                    price_total(cmp, visamc_scale, newstate['setup_loss']).dkk()) {
                    tmpacq = a;
                    best = cmp;
                }
            }
        }
        if (psps[k].acquirers.indexOf(tmpacq) < 0 && !psps[k].is_acquirer) { continue; }

        var c_psp = psps[k].costfn(o);
        if (c_psp == null) { continue; }

        var i_setup = {};
        var i_fixedmonth = {};
        var i_totalmonth = {};
        var i_trans = {};

        var n_cards = [];
        var n_acqs = [];

        i_setup[psps[k].name] = c_psp.setup;
        i_fixedmonth[psps[k].name] = c_psp.monthly;
        i_totalmonth[psps[k].name] = price_total(c_psp, psps[k].is_acquirer ? visamc_scale : 1, newstate['setup_loss']);

        if (use_dankort) {
            var c_nets = acqs['nets'].costfn(o);
            var netsname = 'nets (' + dankort_scale * 100 + '% tr.)';

            i_setup['nets'] = c_nets.setup;
            i_fixedmonth['nets'] = c_nets.monthly;
            i_totalmonth[netsname] = price_total(c_nets, dankort_scale, newstate['setup_loss']);

            n_cards.push('dankort');
            n_acqs.push('nets');
        }

        if (!psps[k].is_acquirer && use_visamc) {
            var c_acq = acqs[tmpacq].costfn(o);
            var acqname = acqs[tmpacq].name + ' (' + visamc_scale * 100 + '% tr.)';

            i_setup[acqs[tmpacq].name] = c_acq.setup;
            i_fixedmonth[acqs[tmpacq].name] = c_acq.monthly;
            i_totalmonth[acqname] = price_total(c_acq, visamc_scale, newstate['setup_loss']);

            n_cards = n_cards.concat(intersect(psps[k].cards, acqs[tmpacq].cards));
            n_acqs.push(tmpacq);
        } else if (use_visamc) {
            n_cards = n_cards.concat(psps[k].cards);
        }

        for (var l in i_totalmonth) {
            i_trans[l] = i_totalmonth[l].scale(1 / newstate['transactions']);
        }

        var s_setup = [];
        var t_setup = new Currency(0, 'DKK');
        var s_fixedmonth = [];
        var t_fixedmonth = new Currency(0, 'DKK');
        var s_totalmonth = [];
        var t_totalmonth = new Currency(0, 'DKK');
        var s_trans = [];
        var t_trans = new Currency(0, 'DKK');

        for (var l in i_setup) {
            s_setup.push(l + ': ' + i_setup[l].print());
            t_setup = t_setup.add(i_setup[l]);
        }
        for (var l in i_fixedmonth) {
            s_fixedmonth.push(l + ': ' + i_fixedmonth[l].print());
            t_fixedmonth = t_fixedmonth.add(i_fixedmonth[l]);
        }
        for (var l in i_totalmonth) {
            s_totalmonth.push(l + ': ' + i_totalmonth[l].print());
            t_totalmonth = t_totalmonth.add(i_totalmonth[l]);
        }
        for (var l in i_trans) {
            s_trans.push(l + ': ' + i_trans[l].print());
            t_trans = t_trans.add(i_trans[l]);
        }

        var h_cards = "";
        if (dankort_penalty) {
            h_cards += '<img src="cards/dankortCrossed.png" />';
        }
        for (var l in n_cards) {
            var logo = cards[n_cards[l]].logo;
            var name = cards[n_cards[l]].name;
            h_cards += '<img src="cards/' + logo + '" alt="' + name +
                       '" title="' + name + '" />';
        }

        var h_acqs = [];
        for (var l in n_acqs) {
            var logo = acqs[n_acqs[l]].logo;
            var name = acqs[n_acqs[l]].name;
            h_acqs.push('<img src="acquirer/' + logo + '" alt="' + name +
                        '" title="' + name + '" />');
        }
        h_acqs = h_acqs.join("<br />");

        var i;
        if (dankort_penalty) {
            for (i = dkpoffset; i < rows.length; ++i) {
                if (t_totalmonth.dkk() < rows[i]) { break; }
            }
        } else {
            for (i = 0; i < dkpoffset; ++i) {
                if (t_totalmonth.dkk() < rows[i]) { break; }
            }
            dkpoffset++;
        }
        rows.splice(i, 0, t_totalmonth.dkk());

        var row = table.insertRow(i);

        var logo_cell = row.insertCell(0);
        var acq_cell = row.insertCell(1);
        var card_cell = row.insertCell(2);
        var setup_cell = row.insertCell(3);
        var fixedmonth_cell = row.insertCell(4);
        var totalmonth_cell = row.insertCell(5);
        var trans_cell = row.insertCell(6);

        logo_cell.innerHTML = '<div class="psp"><a href=' + psps[k].link +
            '><img src="psp/' + psps[k].logo + '" alt="' + psps[k].name +
            '" title="' + psps[k].name + '" /><br>' + psps[k].name +
            '</a></div>';
        acq_cell.innerHTML = h_acqs;
        acq_cell.className = 'acquirer';
        card_cell.innerHTML = h_cards;
        card_cell.className = 'kort';
        setup_cell.innerHTML = t_setup.print() + info_icon + s_setup.join("<br />") + info_icon_end;
        fixedmonth_cell.innerHTML = t_fixedmonth.print() + info_icon + s_fixedmonth.join("<br />") + info_icon_end;
        totalmonth_cell.innerHTML = t_totalmonth.print() + info_icon + s_totalmonth.join("<br />") + info_icon_end;
        trans_cell.innerHTML = t_trans.print() + info_icon + s_trans.join("<br />") + info_icon_end;
    }

    prevstate = newstate;
}

function save_url()
{
}

function parse_url()
{
}
