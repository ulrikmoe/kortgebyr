/**
 *   First shalt thou take out the Holy Pin. Then...
 *   @author Ulrik Moe, Christian Blach, Joakim Sindholt
 *   @license GPLv3
 *
 *   Indentation: 3 spaces
 *   Conventions: https://github.com/airbnb/javascript
 *
 *   1) Opdele i danske, svenske og norske priser.
 *   7) Forklaring
 *   8) Løsninger uden priser: Wirecard, Payex, Worldpay
 *   9) Authorize.net
 **/

// Constants
var info_icon = '<p class="tooltip"><img src="/assets/img/tooltip.gif"><span>';
var info_icon_end = '</span></p>';
var table = $('table');

// Global variables
var i, k, l, sort;
var stopwatch;

var default_acquirer_fees = {};
var default_currency = "DKK";
var default_transactions = 500;
var default_amount = 450;
var color_error = "#f88";
var color_good = null;

// Functions
function $(s) { return document.getElementById(s); }
function C(s) { return document.getElementsByClassName(s); }

function set_ccode(c) {
   if (currency_map.hasOwnProperty(c)) {
      gccode = c;
   }
}

function Currency(amt, code) {
   this.amounts = {};
   this.amounts[code] = amt;
}

Object.size = function(obj) {
   var size = 0,
      key;
   for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
   }
   return size;
};

Currency.prototype.type = "currency";

Currency.prototype.print = function() {
   var number = Math.round((this.dkk() * 100) / currency_value[gccode]) / 100;
   var parts = number.toString().split(".");
   parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
   if (parts.length == 2 && parts[1].length == 1) {
      parts[1] += "0";
   }
   return parts.join(",") + " " + currency_map[gccode];
};

Currency.prototype.represent = function() {
   if (this.length() === 1) {
      for (var code in this.amounts) {
         //if (currency_map.hasOwnProperty(code)) {
         //    return this.amounts[code] + ' ' + currency_map[code];
         //}
         return this.amounts[code] + ' ' + code;
      }
   }
   return this.dkk() / currency_value[gccode] + ' ' + gccode; //currency_map[gccode];
};

Currency.prototype.length = function() {
   var k, n = 0;
   for (k in this.amounts) {
      if (this.amounts.hasOwnProperty(k)) {
         n++;
      }
   }
   return n;
};

Currency.prototype.dkk = function() {
   var sum = 0;
   for (var code in this.amounts) {
      if (this.amounts.hasOwnProperty(code) &&
         currency_value.hasOwnProperty(code)) {
         sum += currency_value[code] * this.amounts[code];
      }
   }
   return sum;
};

Currency.prototype.add = function(rhs) {
   var n = new Currency(0, 'DKK');
   var code;

   for (code in this.amounts) {
      if (this.amounts.hasOwnProperty(code)) {
         n.amounts[code] = this.amounts[code];
      }
   }

   for (code in rhs.amounts) {
      if (rhs.amounts.hasOwnProperty(code)) {
         if (!n.amounts.hasOwnProperty(code)) {
            n.amounts[code] = 0;
         }
         n.amounts[code] += rhs.amounts[code];
      }
   }
   return n;
};

Currency.prototype.is_equal_to = function(other_currency_object) {
   for (var code in this.amounts) {
      if (this.amounts.hasOwnProperty(code)) {
         if (this.amounts[code] !== other_currency_object.amounts[code]) {
            return false;
         }
      }
   }
   return true;
};

Currency.prototype.scale = function(rhs) {
   var n = new Currency(0, 'DKK');

   for (var code in this.amounts) {
      if (this.amounts.hasOwnProperty(code)) {
         n.amounts[code] = this.amounts[code] * rhs;
      }
   }
   return n;
};

function clone(obj) {
    if (obj === null || "object" != typeof obj) { console.log("clone error"); return obj; }
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}


function acq_cost_default(o) {
   var _t = o.avgvalue.scale(this.fee_variable / 100).add(this.fee_fixed).scale(o.transactions);
   return {
      trans: _t,
      total: _t.add(this.fee_monthly)
   };
}

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
   var k, a = [];
   for (k in currency_map) {
      a.push(currency_map[k]);
   }
   for (k in currency_value) {
      a.push(k);
   }
   return RegExp("^ *([0-9][0-9., ]*)(" + a.join("|") + ")? *$", "i");
}

var curregex = mkcurregex();

function _getCurrency(currency) {
   var a = currency.match(curregex);
   if (a === null) {
      return null;
   }

   var c = a[2] ? a[2] : currency_map[gccode];
   if (c.toLowerCase() === currency_map[gccode].toLowerCase()) {
      /* there are a lot of currencies named kr and we should prefer the kr
       * that has been selected */
      c = gccode;
   } else {
      /* if that's not what's selected, find the currency */
      for (var k in currency_map) {
         if (currency_map[k].toLowerCase() === c.toLowerCase() ||
            k.toLowerCase() === c.toLowerCase()) {
            c = k;
            break;
         }
      }
   }

   return new Currency(parseFloat(a[1].replace('.', '').replace(',', '.')), c);
}

function getCurrency(currency) {
   var a = _getCurrency($(currency).value);
   if (a === null) {
      $(k).style.background = color_error;
      return null;
   }
   $(currency).style.background = color_good;
   return a;
}

function changeCurrency(option) {
   $('currency_code').innerHTML = option.value;
   set_ccode(option.value);
   build();
   save_url();
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
   'cards': {
      type: "bits",
      bits: 8,
      get: function() {
         // Get all selected payment methods from .ocards (0.2ms)
         var object = {};
         var ocards = C("ocards");
         for(i = 0; i < ocards.length; i++)
         {
            var ocards_name = ocards[i].id;

            if ( ocards[i].checked ) {
               object[ocards_name] = 1;
               if ( ocards_name == "visa" ) { object.mastercard = 1; }
            }
         }
         return object;
      },
      set: function(name, value) {}
   },
   // Misc
   'acquirers': {
      type: "bits",
      bits: 4,
      get: function() {
         // Return the selected acquirers
         var name = $("acquirer").value;
         if ($("acquirer").value == 'auto') {
            return ACQs;
         }
         else {
            var objekt = {};
            objekt[name] = ACQs[name];
            return objekt;
         }
      },
      set: function(v) {
         /*
         if (typeof v === "number") {
            for (var i = 0; i < $("acquirer").length; i++) {
               if (parseInt($("acquirer")[i].value) === v) {
                  $("acquirer")[i].selected = true;
               }
            }
            return;
         }
         setOption(v, 'acq_');
         */
      },
      def: 'auto'
   },
   'visasecure': {
      type: "bits",
      bits: 1,
      get: function() { return +getBool('visasecure'); },
      set: function(v) { setBool('visasecure', v); },
      def: true
   },
   'antifraud': {
      type: "bits",
      bits: 1,
      get: function() { return +getBool('antifraud'); },
      set: function(v) { setBool('antifraud', v); },
      def: false
   },
   'recurring': {
      type: "bits",
      bits: 1,
      get: function() { return +getBool('recurring'); },
      set: function(v) { setBool('recurring', v); },
      def: false
   },
   'multiacquirer': {
      type: "bits",
      bits: 1,
      get: function() { return +getBool('multiacquirer'); },
      set: function(v) { setBool('multiacquirer', v); },
      def: false
   },
   'transactions': {
      type: "string",
      dirty_bits: 1,
      get_dirty_bits: function() { return +(this.get() !== this.def); },
      get: function() { return getInt('transactions'); },
      set: function(v) { setInt('transactions', v); },
      def: default_transactions
   },
   'avgvalue': {
      type: "currency",
      dirty_bits: 1,
      get_dirty_bits: function() { return +!this.get().is_equal_to(this.def); },
      get: function() { return getCurrency('avgvalue'); },
      set: function(v) { setCurrency('avgvalue', v); },
      def: new Currency(default_amount, default_currency)
   },
   'acquirer_opts': {
      type: "string",
      dirty_bits: 10,
      get_dirty_bits: function() {
         /*
         var sum = 0,
            i = 0;
         for (var k in ACQs) {
            if (ACQs.hasOwnProperty(k) && k !== "nets") {
               sum = sum << 1;
               if (!ACQs[k].fee_fixed.is_equal_to(default_acquirer_fees[k].fee_fixed)) {
                  sum += 1;
               }
               sum = sum << 1;
               if (ACQs[k].fee_variable !== default_acquirer_fees[k].fee_variable) {
                  sum += 1;
               }
               i++;
            }
         }
         return sum;
         */
      },
      get: function() {
         /*
         var str = "";
         for (var k in ACQs) {
            if (ACQs.hasOwnProperty(k) && k !== "nets") {
               if (!ACQs[k].fee_fixed.is_equal_to(default_acquirer_fees[k].fee_fixed)) {
                  var amount = ACQs[k].fee_fixed.amounts;
                  for (var cur in amount) {
                     str += amount[cur] + cur + ",";
                  }
               }
               if (ACQs[k].fee_variable !== default_acquirer_fees[k].fee_variable) {
                  str += ACQs[k].fee_variable + ",";
               }
            }
         }
         if (str.length > 0) {
            str = str.substring(0, str.length - 1);
         }
         return str;
         */
      },
      set: function(v, bits) {
         /*
         var i = 0,
            array_position = 0;
         var value_array = v.split(",");

         for (var k in ACQs) {
            if (ACQs.hasOwnProperty(k) && k !== "nets") {
               if (get_bit_range(bits, i, i, this.dirty_bits)) {
                  ACQs[k].fee_fixed = _getCurrency(value_array[array_position]);
                  array_position++;
               }
               i++;
               if (get_bit_range(bits, i, i, this.dirty_bits)) {
                  ACQs[k].fee_variable = parseFloat(value_array[array_position].replace(',', '.'));
                  array_position++;
               }
               i++;
            }
         }
         */
      }
   },
   'currency': {
      type: "string",
      dirty_bits: 1,
      get_dirty_bits: function() { return +(this.get() !== this.def); },
      get: function() { return gccode; },
      set: function(v) {
         var select = $("currency_code_select");
         for (var i = 0; i < select.length; i++) {
            if (select.options[i].value === v) {
               select.selectedIndex = i;
               $('currency_code').innerHTML = v;
               break;
            }
         }
         set_ccode(v);
      },
      def: "DKK"
   },
   // Dirty bits: bit0 = er der ændret i antal/gns, bit 1..N_acquirers+1 er der ændret i acquirer costs?  --- Objekter der bruger dirty-bits skal være EFTER
   'dirty_bits': {
      type: "bits",
      bits: 0, //sættes on the fly
      get: function() {
         var sum = 0;
         for (var k in opts) {
            if (opts.hasOwnProperty(k) && opts[k].dirty_bits) {
               sum = (sum << opts[k].dirty_bits) + opts[k].get_dirty_bits();
            }
         }
         return sum; //17;// detect de acquirers der er ændret i og konverter til binary
         // 17 => nummber 1 og nummer 5
      },
      set: function(i) {},
      def: ""
   }
};



/*
Acquirer options panel.
*/
var sopts = {
   'acquirer_fixed': {
      get: function() { return getCurrency('acquirer_fixed'); },
      set: function(v) { setCurrency('acquirer_fixed', v); },
      def: function() { return ACQs[opts.acquirer.get()].fee_fixed; }
   },
   'acquirer_variable': {
      get: function() { return getPercent('acquirer_variable'); },
      set: function(v) { setPercent('acquirer_variable', v); },
      def: function() { return ACQs[opts.acquirer.get()].fee_variable; }
   },
   'acquirer_setup': {
      get: function() { return getCurrency('acquirer_setup'); },
      set: function(v) { setCurrency('acquirer_setup', v); },
      def: function() { return ACQs[opts.acquirer.get()].fee_setup; }
   },
   'acquirer_monthly': {
      get: function() { return getCurrency('acquirer_monthly'); },
      set: function(v) { setCurrency('acquirer_monthly', v); },
      def: function() { return ACQs[opts.acquirer.get()].fee_monthly; }
   }
};


function rnf(n) {
   return (typeof n == 'function') ? n() : n;
}



function init_defaults() {
   for (var k in opts) {
      if (opts[k].def) {
         opts[k].set(rnf(opts[k].def));
      }
   }
}

function price_total(v, s) {
   return v.trans.scale(s).add(v.monthly);
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

function cardlist(list) {
   var objekt = {};
   for (i = 0; i < list.length; i++)
   {
      objekt[list[i]] = 1;
   }
   return objekt;
}

function cardSupported(pcards, scards) {

   // Iterate through scards and see if they are present in pcards.

   for (var key in scards) {

   }

   return true;
}

function build(action) {
   stopwatch = performance.now();
   console.log( (performance.now()-stopwatch).toFixed(4) +"ms ::: build() start");

   if (action == 'init') {
      init_defaults(); // 1.8 ms
      init_dirty_bits(); // 0.3 ms
      load_url(location.search); // 0.4 ms
   }

   // Get settings
   var settings = {};
   for (var key in opts) { settings[key] = opts[key].get(); }

   settings.acquirersort = [];
   settings.require = {};
   if (settings.cards.dankort || settings.cards.forbrugsforeningen){
      settings.require.nets = true;
   }

   var dankort_scale = (!settings.cards.dankort) ? 0 : (!settings.cards.visa) ? 1 : 0.8;

   if ( !settings.cards.dankort && !settings.cards.visa ) {
      alert("Venligst vælg betalingskort");
      return;
   }
   if (settings.forbrugsforeningen && !settings.dankort) {
      console.log("Forbrugsforeningen kræver en Dankort aftale.");
      opts.dankort.set(1);
   }

   var data = [];
   var tbody = document.createElement("tbody");
   tbody.id = "tbody";

   console.log( (performance.now()-stopwatch).toFixed(3) +"ms ::: removing some acquirers");

   var tmpobj = {};
   var tmparr = [];
   settings.acquirersort = [];
   // Time to remove some acquirers before we loop.

   acqloop:
   for (var a in settings.acquirers) {
      if (a == "nets") { tmpobj[a] = settings.acquirers[a]; continue; }

      // Ugly fix: We can't use the Delete operator due to pointers (settings->ACQ)
      for (var x in settings.cards) {
         if( settings.cards.hasOwnProperty(x) ) {
            if (x == "dankort" || x == 'forbrugsforeningen') { continue; }

            if (!settings.acquirers[a].cards[x]) {
               continue acqloop;
            }
         }
      }
      // Add acquirer and calculate individual acquirer costs
      tmpobj[a] = settings.acquirers[a];
      tmpobj[a].fee = settings.acquirers[a].costfn(settings);

      // Check if tmpobj[a].fee.total.dkk() > settings.acquirersort[index]
      for (sort = 0; sort < settings.acquirersort.length; sort++){

         if ( tmpobj[a].fee.total.dkk() < tmpobj[settings.acquirersort[sort]].fee.total.dkk() ) {
            break;
         }
      }
      settings.acquirersort.splice(sort, 0, a);
   }
   settings.acquirers = tmpobj;

   console.log( (performance.now()-stopwatch).toFixed(3) +"ms ::: time to build...");

   psploop:
   for (k in PSPs) {

      var psp = PSPs[k];
      var acq = clone(psp.acquirers || {});
      var setup = {}, subscription = {}, transfee = {}, kortgebyr = {};

      // Check if psp support any required acq (-> loop)
      // this is used for dankort, forbrugsforeningen, mobilepay
      if(settings.require.nets && !acq.nets){
         console.log("Nets is required so we have to skip: " + psp.id);
         continue;
      }

      // Skip psp if doesn't support settings.cards
      for (i in settings.cards) {
         if(!psp.cards[i]){
            console.log(psp.id + " does not support " + i);
            continue psploop;
         }
      }

      // Skip psp if its acquirers were deleted from settings.acquirers
      if( Object.getOwnPropertyNames(acq).length > 0 ) {

         for (i in acq) {
            if ( !settings.acquirers[i] ) {
               delete acq[i];
            }
         }
         if( Object.getOwnPropertyNames(acq).length === 0 ) {
            console.log(psp.id + " has run out of acquirers! Delete!");
            continue;
         }

         // Find cheapest (available) acquirer
         for (i = 0; i < settings.acquirersort.length; i++) {

            if (acq[settings.acquirersort[i]]){
               console.log(settings.acquirersort[i] + " is cheapest for " + psp.id);
               acq = {};
               acq[settings.acquirersort[i]] = 1;
               if( settings.require.nets ){ acq.nets = 1; } // ugly
               break;
            }
         }
      }

      psp.costs = psp.costfn(settings);
      if (psp.costs === null) { continue; } // legacy, see PSPs.scannet

      // features skal flyttes til recurring
      if (settings.mobilepay) { subscription.mobilepay = new Currency(49, 'DKK'); }


      var total = new Currency(49, 'DKK');
      /*

      for (l in i_totalmonth) {
         i_trans[l] = i_totalmonth[l].scale(1 / settings.transactions);
      }

      var s_setup = [];
      var t_setup = new Currency(0, 'DKK');
      var s_fixedmonth = [];
      var s_totalmonth = [];
      var t_totalmonth = new Currency(0, 'DKK');
      var s_trans = [];
      var t_trans = new Currency(0, 'DKK');

      for (l in i_setup) {
         s_setup.push(l + ': ' + i_setup[l].print());
         t_setup = t_setup.add(i_setup[l]);
      }
      for (l in i_fixedmonth) {
         s_fixedmonth.push(l + ': ' + i_fixedmonth[l].print());
      }
      for (l in i_totalmonth) {
         s_totalmonth.push(l + ': ' + i_totalmonth[l].print());
         t_totalmonth = t_totalmonth.add(i_totalmonth[l]);
      }
      for (l in i_trans) {
         s_trans.push(l + ': ' + i_trans[l].print());
         t_trans = t_trans.add(i_trans[l]);
      }
      */

      var h_cards = "";
      for (l in psp.cards) {
         h_cards += '<img class="card '+ l +'" src="/assets/img/cards/' + company[l].logo + '" alt="' + company[l].name + '" title="' + company[l].name + '" />';
      }

      var h_acqs = [];
      for (l in acq) {
         h_acqs.push('<a target="_blank" href="' + company[l].link + '"><img class="acquirer '+l+'" src="/assets/img/psp/' + company[l].logo + '" alt="' + company[l].name +
            '" title="' + company[l].name + '" /></a>');
      }
      h_acqs = h_acqs.join("") || "&nbsp;"; // safari empty cell fix


      // Sort psp after t_totalmonth.dkk()
      for (sort = 0; sort < data.length; ++sort) {
         if (t_totalmonth.dkk() < data[sort]) { break; }
      }
      data.splice(sort, 0, t_totalmonth.dkk());

      // Format product name (e.g. Light, Pro, Business ...)
      psp.product = (psp.product) ? " " + psp.product : "";

      var row = tbody.insertRow(sort);
      row.insertCell(-1).innerHTML = '<a target="_blank" class="psp + '+psp.id+'" href=' + company[psp.id].link + '><img src="/assets/img/psp/' + company[psp.id].logo + '" alt="' + company[psp.id].name +
         '" title="' + company[psp.id].name + psp.product +'" /><p>' + company[psp.id].name + psp.product + '</p></a>';
      row.insertCell(-1).innerHTML = h_acqs;
      row.insertCell(-1).innerHTML = h_cards;
      row.insertCell(-1).textContent = total.print();
      row.insertCell(-1).textContent = total.print();
      row.insertCell(-1).textContent = total.print();

   }

   table.replaceChild(tbody, $('tbody'));

   if (action !== "init") { save_url(); }

   console.log( (performance.now()-stopwatch).toFixed(3) +"ms ::: done building \n ");
}

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
   opts.dirty_bits.bits = dirty_bits_count;
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
   dirty_bits_value = opts.dirty_bits.get("url");

   for (i in opts) {
      var obj = opts[i],
         dirty_bits_current = 0;
      if (obj.dirty_bits) {
         dirty_bits_current = get_bit_range(dirty_bits_value, dirty_bits_position, dirty_bits_position + obj.dirty_bits - 1, opts.dirty_bits.bits);
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

   var current_char_num = 0;
   var first_bit = 0;
   var dirty_bits_value = 0;
   var dirty_bits_position = 0;
   var dirty_bits_current; // 0 char is ?

   for (var i in opts) {
      var obj = opts[i],
         sum = 0;
      if (obj.inactive === true) {
         continue;
      }
      if (obj.dirty_bits) {
         dirty_bits_current = get_bit_range(dirty_bits_value, dirty_bits_position, dirty_bits_position + obj.dirty_bits - 1, opts.dirty_bits.bits);
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
            opts[i].set(_getCurrency(str));
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

   var selected_acquirer = opts.acquirer.get();
   if (selected_acquirer !== "auto") {

      C('acquirer_description')[0].style.display = 'none';
      C('acquirer_options')[0].style.display = 'block';

      sopts.acquirer_fixed.set(ACQs[selected_acquirer].fee_fixed);
      sopts.acquirer_variable.set(ACQs[selected_acquirer].fee_variable);
      sopts.acquirer_setup.set(ACQs[selected_acquirer].fee_setup);
      sopts.acquirer_monthly.set(ACQs[selected_acquirer].fee_monthly);

      // return getCurrency('acquirer_fixed');
   } else {
      C('acquirer_description')[0].style.display = 'block';
      C('acquirer_options')[0].style.display = 'none';
   }

   /*
   if (settings.acquirers != prevstate.acquirer) {
      setAcquirerPanel();
   } else if (settings.acquirers != "auto")
   {
      // Denne skal gerne slås sammen med setAcquirerPanel();
      // ACQs[settings.acquirers].fee_fixed = settings.acquirers_fixed;
      // ACQs[settings.acquirers].fee_variable = settings.acquirers_variable;
      // ACQs[settings.acquirers].fee_monthly = settings.acquirers_monthly;
      // ACQs[settings.acquirers].fee_setup = settings.acquirers_setup;
   }
   */

}


build('init');
