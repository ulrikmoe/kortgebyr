// $('html-id');
function $(s) {
  return document.getElementById(s);
}

// $('html-className');
function C(s) {
  return document.getElementsByClassName(s);
}


var default_acquirer_fees = {};
var default_currency = "DKK";
var default_transactions = 250;
var default_amount = 500;
var color_error = "#f88";
var color_good = null;

function getInt(k) {
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

function setInt(k, v) {
  $(k).value = parseInt(v, 10);
  $(k).style.background = color_good;
}

function mkcurregex() {
  var a = [],
    k;
  for (k in currency_rmap) {
    a.push(k);
  }
  for (k in currency_value) {
    a.push(k);
  }
  return RegExp("^ *([0-9][0-9., ]*)(" + a.join("|") + ")? *$", "i");
}

var curregex = mkcurregex();

function getCurrency(currency) {
  var a = $(currency).value.match(curregex);
  if (a === null) {
    $(k).style.background = color_error;
    return null;
  }
  $(currency).style.background = color_good;

  var c = a[2] ? a[2] : 'DKK';
  for (var k in currency_rmap) {
    if (k.toLowerCase() == c.toLowerCase()) {
      c = currency_rmap[k];
      break;
    }
  }

  return new Currency(parseFloat(a[1].replace('.', '').replace(',', '.')), c);
}

function getCurrencystring(string) {
  var a = string.match(curregex);
  if (a === null) {
    return null;
  }

  var c = a[2] ? a[2] : 'DKK';
  for (var k in currency_rmap) {
    if (k.toLowerCase() == c.toLowerCase()) {
      c = currency_rmap[k];
      break;
    }
  }

  return new Currency(parseFloat(a[1].replace('.', '').replace(',', '.')), c);
}


function changeCurrency(select) {
  // Når en user ændrer currency via select dropdown.
  alert(select.value);

}


function setCurrency(k, v) {
  $(k).value = v.represent();
  $(k).style.background = color_good;
}

function getOption(k, prefix) {
  return $(k).options[$(k).selectedIndex].id.substr(prefix.length);
}

function setOption(v, prefix) {
  $(prefix + v).selected = true;
}

function getPercent(k) {
  var elem = $(k);
  var str = elem.value.replace('%', '').replace(',', '.').trim();
  if (!isNaN(parseFloat(str)) && isFinite(str)) {
    $(k).style.background = color_good;
    return parseFloat(str);
  }
  $(k).style.background = color_error;
  return null;
}

function setPercent(k, v) {
  $(k).value = (parseFloat(v) + "%").replace('.', ',');
  $(k).style.background = color_good;
}

function getBool(k) {
  return $(k).checked ? true : false;
}

function setBool(k, v) {
  if (typeof v === "number") {
    v = v && 1;
  }
  $(k).checked = v ? true : false;
}

var opts = {
  'acquirer': {
    type: "bits",
    bits: 4,
    get: function (a) {
      if (a === "url") {
        return parseInt($("acquirer")[$("acquirer").selectedIndex].value);
      }
      return getOption('acquirer', 'acq_');
    },
    set: function (v) {
      if (typeof v === "number") {
        for (var i = 0; i < $("acquirer").length; i++) {
          if (parseInt($("acquirer")[i].value) === v) {
            $("acquirer")[i].selected = true;
          }
        }
        return;
      }
      setOption(v, 'acq_');
    },
    def: 'auto'
  },
  'visasecure': {
    type: "bits",
    bits: 1,
    get: function () {
      return +getBool('visasecure');
    },
    set: function (v) {
      setBool('visasecure', v);
    },
    def: true
  },
  'fraud_fighter': {
    type: "bits",
    bits: 1,
    get: function () {
      return +getBool('fraud_fighter');
    },
    set: function (v) {
      setBool('fraud_fighter', v);
    },
    def: false
  },
  'recurring': {
    type: "bits",
    bits: 1,
    get: function () {
      return +getBool('recurring');
    },
    set: function (v) {
      setBool('recurring', v);
    },
    def: false
  },
  'multiacquirer': {
    type: "bits",
    bits: 1,
    get: function () {
      return +getBool('multiacquirer');
    },
    set: function (v) {
      setBool('multiacquirer', v);
    },
    def: false
  },
  'dankort': {
    type: "bits",
    bits: 1,
    get: function () {
      return +getBool('dankort');
    },
    set: function (v) {
      setBool('dankort', v);
    },
    def: true
  },
  'visa_mastercard': {
    type: "bits",
    bits: 1,
    get: function () {
      return +getBool('visa_mastercard');
    },
    set: function (v) {
      setBool('visa_mastercard', v);
    },
    def: true
  },
  'mobilepay': {
    type: "bits",
    bits: 1,
    get: function () {
      return +getBool('mobilepay');
    },
    set: function (v) {
      setBool('mobilepay', v);
    },
    def: false
  },

  // Dirty bits: bit0 = er der ændret i antal/gns, bit 1..N_acquirers+1 er der ændret i acquirer costs?  --- Objekter der bruger dirty-bits skal være EFTER
  'dirty_bits': {
    type: "bits",
    bits: 0, //sættes on the fly
    get: function () {
      var sum = 0;
      for (var k in opts) {
        if (opts.hasOwnProperty(k) && opts[k].dirty_bits) {
          sum = (sum << opts[k].dirty_bits) + opts[k].get_dirty_bits();
        }
      }
      return sum; //17;// detect de acquirers der er ændret i og konverter til binary
      // 17 => nummber 1 og nummer 5
    },
    set: function (i) {

    },
    def: ""
  },
  'transactions': {
    type: "string",
    dirty_bits: 1,
    get_dirty_bits: function () {
      return +(this.get() !== this.def);
    },
    get: function () {
      return getInt('transactions');
    },
    set: function (v) {
      setInt('transactions', v);
    },
    def: default_transactions
  },
  'average_value': {
    type: "currency",
    dirty_bits: 1,
    get_dirty_bits: function () {
      return +!this.get().is_equal_to(this.def);
    },
    get: function () {
      return getCurrency('average_value');
    },
    set: function (v) {
      setCurrency('average_value', v);
    },
    def: new Currency(default_amount, default_currency)
  },
  'acquirer_opts': {
    type: "string",
    dirty_bits: undefined, // sættes af init_acqs()
    get_dirty_bits: function () {
      var sum = 0,
        i = 0;
      for (var k in acqs) {
        if (acqs.hasOwnProperty(k) && k !== "nets") {
          sum = sum << 1;
          if (!acqs[k].fee_fixed.is_equal_to(default_acquirer_fees[k].fee_fixed)) {
            sum += 1;
          }
          sum = sum << 1;
          if (acqs[k].fee_variable !== default_acquirer_fees[k].fee_variable) {
            sum += 1;
          }
          i++;
        }
      }
      return sum;
    },
    get: function () {
      var str = "";
      for (var k in acqs) {
        if (acqs.hasOwnProperty(k) && k !== "nets") {
          if (!acqs[k].fee_fixed.is_equal_to(default_acquirer_fees[k].fee_fixed)) {
            var amount = acqs[k].fee_fixed.amounts;
            for (var cur in amount) {
              str += amount[cur] + cur + ",";
            }
          }
          if (acqs[k].fee_variable !== default_acquirer_fees[k].fee_variable) {
            str += acqs[k].fee_variable + ",";
          }
        }
      }
      if (str.length > 0) {
        str = str.substring(0, str.length - 1);
      }
      return str;
    },
    set: function (v, bits) {
      var i = 0,
        array_position = 0;
      var value_array = v.split(",");

      for (var k in acqs) {
        if (acqs.hasOwnProperty(k) && k !== "nets") {
          if (get_bit_range(bits, i, i, this.dirty_bits)) {
            acqs[k].fee_fixed = getCurrencystring(value_array[array_position]);
            array_position++;
          }
          i++;
          if (get_bit_range(bits, i, i, this.dirty_bits)) {
            acqs[k].fee_variable = parseFloat(value_array[array_position].replace(',', '.'));
            array_position++;
          }
          i++;
        }
      }
    }
  },
  //==========
  // INACTIVE
  //==========
  'paii': {
    inactive: true,
    type: "bits",
    bits: 1,
    get: function () {
      return false;
    },
    set: function (v) {},
    def: false
  },
  'bitcoin': {
    inactive: true,
    type: "bits",
    bits: 1,
    get: function () {
      return false;
    },
    set: function (v) {},
    def: false
  },
  'setup_loss': {
    inactive: true,
    type: "bits",
    bits: 1,
    get: function () {
      return 0.16;
    },
    set: function (v) {},
    def: 0.16
  }
};


/*
Acquirer options panel.
*/
var sopts = {
  'acquirer_fixed': {
    get: function () {
      return getCurrency('acquirer_fixed');
    },
    set: function (v) {
      setCurrency('acquirer_fixed', v);
    },
    def: function () {
      return acqs[opts['acquirer'].get()].fee_fixed;
    }
  },
  'acquirer_variable': {
    get: function () {
      return getPercent('acquirer_variable');
    },
    set: function (v) {
      setPercent('acquirer_variable', v);
    },
    def: function () {
      return acqs[opts['acquirer'].get()].fee_variable;
    }
  },
  'acquirer_setup': {
    get: function () {
      return getCurrency('acquirer_setup');
    },
    set: function (v) {
      setCurrency('acquirer_setup', v);
    },
    def: function () {
      return acqs[opts['acquirer'].get()].fee_setup;
    }
  },
  'acquirer_monthly': {
    get: function () {
      return getCurrency('acquirer_monthly');
    },
    set: function (v) {
      setCurrency('acquirer_monthly', v);
    },
    def: function () {
      return acqs[opts['acquirer'].get()].fee_monthly;
    }
  }
};



function rnf(n) {
  return (typeof n == 'function') ? n() : n;
}

function init_acqs() {
  var s = '<option id="acq_auto" value="0">Automatisk</option>';
  var i = 0;
  for (var k in acqs) {
    if (acqs.hasOwnProperty(k) && k !== 'nets') {

      i++;
      s += '<option id="acq_' + k + '" value="' + i + '">' + acqs[k].name + '</option>';
      default_acquirer_fees[k] = {};
      default_acquirer_fees[k].fee_fixed = acqs[k].fee_fixed;
      default_acquirer_fees[k].fee_variable = acqs[k].fee_variable;
      default_acquirer_fees[k].fee_monthly = acqs[k].fee_monthly;
      default_acquirer_fees[k].fee_setup = acqs[k].fee_setup;
    }
  }
  opts.acquirer_opts.dirty_bits = 2 * i;
  $('acquirer').innerHTML = s;

  // C('acquirer_description')[0].style.display = 'block';
  // C('acquirer_options')[0].style.display = 'none';

}

function init_defaults() {
  for (var k in opts) {
    if (opts[k].def) {
      opts[k].set(rnf(opts[k].def));
    }
  }
}

function price_total(v, s, loss) {
  return v.trans.scale(s).add(v.monthly).add(v.setup.scale(loss / 12));
}

function intersect(a, b) {
  var r = [];

  for (var i = 0; i < a.length; i++) {
    if (b.indexOf(a[i]) !== -1) {
      r.push(a[i]);
    }
  }

  return r;
}

var prevstate = {};

function build(action) {
  if (action == 'init') {
    init_acqs();
    init_defaults();
    init_dirty_bits();
    load_url(location.search);
  }

  var counter = 0;
  var k;
  var newstate = {};
  for (k in opts) {
    newstate[k] = rnf(opts[k].get());
  }
  for (k in sopts) {
    newstate[k] = rnf(sopts[k].get());
  }

  if (action == 'init') {
    prevstate = newstate;
  }

  for (k in newstate) {
    if (newstate[k] === null) {
      newstate[k] = prevstate[k];
    }
  }

  var acq = newstate['acquirer'];
  if (newstate['acquirer'] != prevstate['acquirer']) {

    setAcquirerPanel();

  } else if (acq != "auto") {

    // Denne skal gerne slås sammen med setAcquirerPanel();
    acqs[acq].fee_fixed = newstate['acquirer_fixed'];
    acqs[acq].fee_variable = newstate['acquirer_variable'];
    acqs[acq].fee_monthly = newstate['acquirer_monthly'];
    acqs[acq].fee_setup = newstate['acquirer_setup'];
  }

  var o = new Options(newstate['transactions'], newstate['average_value'],
    newstate['fraud_fighter'], newstate['visasecure'], newstate['recurring'], newstate['multiacquirer'], newstate['mobilepay']);

  var table = $("data");
  table.innerHTML = "";
  var rows = [];
  var dkpoffset = 0;

  var info_icon = '<p class="tooltip"><img src="/img/tooltip.gif"><span>';
  var info_icon_end = '</span></p>';

  for (k in psps) {
    var use_dankort = newstate['dankort'];
    var use_visamc = newstate['visa_mastercard'];
    var forbrugsforeningen = newstate['forbrugsforeningen'];
    var diners_amex_jcb = newstate['diners_amex_jcb'];
    var mobilepay = newstate['mobilepay'];
    var paii = newstate['paii'];

    var dankort_penalty = false;
    if (use_dankort) {
      if (psps[k].cards.indexOf('dankort') < 0 || (psps[k].acquirers.indexOf('nets') < 0 && !psps[k].is_acquirer)) {
        continue;
      }
    }

    if (!use_dankort && !use_visamc) {
      continue;
    }
    if (use_visamc && psps[k].cards.length == 1 && psps[k].cards[0] == 'dankort') {
      continue;
    }

    if (psps[k].is_acquirer && acq != 'auto') {
      continue;
    }

    var tmpacq = acq;
    var tmpo = o;

    var visamc_scale = 0.18;
    var dankort_scale = 0.82;
    if (!use_dankort) {
      visamc_scale = 1;
      dankort_scale = 0;
    }
    if (!use_visamc) {
      visamc_scale = 0;
      dankort_scale = 1;
      tmpo.visasecure = false;
    }
    if (k === "yourpay") {
      visamc_scale = 1;
      dankort_scale = 0;
    }

    if (tmpacq == "auto") {
      var best = null;
      for (var a in acqs) {
        if (a == "nets") {
          continue;
        }
        if (psps[k].acquirers.indexOf(a) < 0) {
          continue;
        }
        if (best === null) {
          tmpacq = a;
          best = acqs[a].costfn(tmpo);
          continue;
        }

        var cmp = acqs[a].costfn(tmpo);
        if (price_total(best, visamc_scale, newstate['setup_loss']).dkk() >
          price_total(cmp, visamc_scale, newstate['setup_loss']).dkk()) {
          tmpacq = a;
          best = cmp;
        }
      }
    }
    if (use_visamc && psps[k].acquirers.indexOf(tmpacq) < 0 && !psps[k].is_acquirer) {
      continue;
    }

    var c_psp = psps[k].costfn(tmpo);
    if (c_psp === null) {
      continue;
    }

    var i_setup = {};
    var i_fixedmonth = {};
    var i_totalmonth = {};
    var i_trans = {};

    var n_cards = [];
    var n_acqs = [];

    i_setup[psps[k].name] = c_psp.setup;
    i_fixedmonth[psps[k].name] = c_psp.monthly;
    i_totalmonth[psps[k].name] = price_total(c_psp, psps[k].is_acquirer ? visamc_scale : 1, newstate['setup_loss']);

    if (use_dankort && psps[k].acquirers.indexOf("nets") >= 0) {
      var c_nets = acqs['nets'].costfn(tmpo);
      var netsname = 'nets (' + dankort_scale * 100 + '% tr.)';

      i_setup['nets'] = c_nets.setup;
      i_fixedmonth['nets'] = c_nets.monthly;
      i_totalmonth[netsname] = price_total(c_nets, dankort_scale, newstate['setup_loss']);
      n_acqs.push('nets');
      n_cards.push('dankort');
    }

    if (!psps[k].is_acquirer && use_visamc) {
      var c_acq = acqs[tmpacq].costfn(tmpo);
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
    for (var l in n_cards) {
      var logo = cards[n_cards[l]].logo;
      var name = cards[n_cards[l]].name;
      h_cards += '<img src="/img/cards/' + logo + '" alt="' + name +
        '" title="' + name + '" />';
    }

    var h_acqs = [];
    for (var l in n_acqs) {
      var logo = acqs[n_acqs[l]].logo;
      var name = acqs[n_acqs[l]].name;
      h_acqs.push('<img src="/img/acquirer/' + logo + '" alt="' + name +
        '" title="' + name + '" />');
    }
    h_acqs = h_acqs.join("");

    // Safari har en bug hvor empty cells ikke bliver vist, selv
    // med [empty-cells: show;]. Derfor indsætter vi et nb-space.
    if (h_acqs.length === 0) {
      var h_acqs = "&nbsp;"
    };

    var i;
    if (dankort_penalty) {
      for (i = dkpoffset; i < rows.length; ++i) {
        if (t_totalmonth.dkk() < rows[i]) {
          break;
        }
      }
    } else {
      for (i = 0; i < dkpoffset; ++i) {
        if (t_totalmonth.dkk() < rows[i]) {
          break;
        }
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

    logo_cell.innerHTML = '<a target="_blank" href=' + psps[k].link + '><img src="/img/psp/' + psps[k].logo + '" alt="' + psps[k].name +
      '" title="' + psps[k].name + '" />' + psps[k].name +
      '</a>';
    acq_cell.innerHTML = h_acqs;
    card_cell.innerHTML = h_cards;
    setup_cell.innerHTML = t_setup.print() + info_icon + s_setup.join("<br />") + info_icon_end;
    fixedmonth_cell.innerHTML = t_fixedmonth.print() + info_icon + s_fixedmonth.join("<br />") + info_icon_end;
    totalmonth_cell.innerHTML = t_totalmonth.print() + info_icon + s_totalmonth.join("<br />") + info_icon_end;
    trans_cell.innerHTML = t_trans.print() + info_icon + s_trans.join("<br />") + info_icon_end;

    counter++;
  }

  prevstate = newstate;

  if (action !== "init") {
    save_url();
  }
}

Object.size = function (obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

//===========================
//            URL
//===========================

var base64_chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/";

function base64_encode(n) {
  if (n < 0) {
    return "";
  }

  var str = "",
    curr_n = n;
  do {
    str = base64_chars[curr_n % 64] + str;
    curr_n = Math.floor(curr_n / 64);
  } while (curr_n !== 0);

  return str;
}

var MAX_INT32 = 0x7FFFFFFF;

function init_dirty_bits() {
  var dirty_bits_count = 0;
  for (var i in opts) {
    if (opts[i].dirty_bits && !opts[i].inactive) {
      dirty_bits_count += opts[i].dirty_bits;
    }
  }
  opts["dirty_bits"].bits = dirty_bits_count;
}

function save_url() {
  var url = "",
    first_bit = 0,
    /* from left */
    sum = 0,
    last_index, dirty_bits_value = 0,
    dirty_bits_position = 0;
  for (var i in opts) {
    if (!opts[i].inactive && !opts[i].dirty_bits) {
      last_index = i;
    }
  }
  dirty_bits_value = opts["dirty_bits"].get("url");

  for (var i in opts) {
    var obj = opts[i],
      dirty_bits_current = 0;
    if (obj.dirty_bits) {
      dirty_bits_current = get_bit_range(dirty_bits_value, dirty_bits_position, dirty_bits_position + obj.dirty_bits - 1, opts["dirty_bits"].bits);
      dirty_bits_position += obj.dirty_bits;
    }
    if (obj.inactive === true || (obj.dirty_bits && dirty_bits_current === 0)) {
      continue;
    }

    if (obj.type === "bits") {
      var remainder = obj.get("url"),
        remainder_bits = obj.bits;
      //console.log(i + " : " + remainder);
      do {
        var last_bit = Math.min(first_bit + remainder_bits - 1, 5);
        sum += remainder >>> Math.max(remainder_bits - (1 + last_bit - first_bit), 0) << (5 - last_bit);
        remainder_bits -= 1 + last_bit - first_bit;
        remainder = remainder & (MAX_INT32 >>> (31 - remainder_bits));
        if (last_bit === 5 || i === last_index) {
          url += base64_chars.charAt(sum);
          first_bit = 0;
          sum = 0;
        } else {
          first_bit += last_bit - first_bit + 1;
        }
      } while (remainder_bits > 0);
    } else {
      if (sum > 0) {
        url += base64_chars.charAt(sum);
        first_bit = 0;
        sum = 0;
      }

      if (obj.type === "string") {

        url += ";" + obj.get("url");
      } else if (obj.type === "currency") {

        var amount = obj.get("url").amounts;
        for (var cur in amount) {
          url += ";" + amount[cur] + cur;
        }
      }
    }

    //console.log(i+" : "+sum);
  }

  history.replaceState({
    foo: "bar"
  }, "", "?" + url);
}

function get_bit_range(n, from, to, length) {
  // from the left --- only up to 6 bits
  return (n & (MAX_INT32 >>> (31 - length + from))) >>> length - 1 - to;
}

function load_url(url_query) {
  url_query = url_query.replace("?", "");
  if (url_query === "") {
    return;
  }

  var current_char_num = 0,
    first_bit = 0,
    dirty_bits_value = 0,
    dirty_bits_position = 0,
    dirty_bits_current; // 0 char is ?
  for (var i in opts) {
    var obj = opts[i],
      sum = 0;
    if (obj.inactive === true) {
      continue;
    }
    if (obj.dirty_bits) {
      dirty_bits_current = get_bit_range(dirty_bits_value, dirty_bits_position, dirty_bits_position + obj.dirty_bits - 1, opts["dirty_bits"].bits);
      dirty_bits_position += obj.dirty_bits;
      if (dirty_bits_current === 0) {
        continue;
      }
    }
    if (obj.type === "bits") {
      var remaining_bits = obj.bits;
      while (1) {
        if (current_char_num > url_query.length - 1) {
          return; // error url_query too short
        }
        var current_char = url_query.charAt(current_char_num);
        if (current_char === ";") {
          break;
        }
        var n = base64_chars.indexOf(current_char);
        if (n === -1) {
          return; // error invalid char
        }
        var last_bit = first_bit + remaining_bits - 1;
        if (last_bit > 5) {
          last_bit = 5;
        }
        remaining_bits -= 1 + last_bit - first_bit;
        sum += get_bit_range(n, first_bit, last_bit, 6) << remaining_bits;
        if (remaining_bits > 0) {
          first_bit = 0;
          current_char_num++;
        } else {
          first_bit = last_bit + 1;
          if (first_bit > 5) {
            first_bit = 0;
            current_char_num++;
          }
          break;
        }
      }
      obj.set(sum);
      if (i === "dirty_bits") {
        dirty_bits_value = sum;
      }
    } else {
      if (first_bit > 0) {
        first_bit = 0;
        current_char_num++;
      }
      if (url_query.charAt(current_char_num) === ";") {
        current_char_num++;
      }
      var next_separator_index = url_query.indexOf(";", current_char_num);
      if (next_separator_index === -1) {
        next_separator_index = url_query.length;
      }
      var str = url_query.substring(current_char_num, next_separator_index);
      current_char_num += str.length;

      if (obj.type === "string") {
        if (i === "acquirer_opts") {
          opts[i].set(str, dirty_bits_value);
        } else {
          opts[i].set(str);
        }
      } else if (obj.type === "currency") {
        opts[i].set(getCurrencystring(str));
      }
    }

  }

  /*
    On page refresh, check if acquirer != automatisk. If this is the case
    then hide .acquirer_description, show .acquirer_options and reset
    fields to default values.
  */

  setAcquirerPanel();

}

function setAcquirerPanel() {

  var selected_acquirer = opts["acquirer"].get();
  if (selected_acquirer !== "auto") {

    C('acquirer_description')[0].style.display = 'none';
    C('acquirer_options')[0].style.display = 'block';

    sopts['acquirer_fixed'].set(acqs[selected_acquirer].fee_fixed);
    sopts['acquirer_variable'].set(acqs[selected_acquirer].fee_variable);
    sopts['acquirer_setup'].set(acqs[selected_acquirer].fee_setup);
    sopts['acquirer_monthly'].set(acqs[selected_acquirer].fee_monthly);

    // return getCurrency('acquirer_fixed');
  } else {
    C('acquirer_description')[0].style.display = 'block';
    C('acquirer_options')[0].style.display = 'none';
  }

}
