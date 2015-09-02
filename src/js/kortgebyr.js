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
var table = $('table');

// Global variables
var i, k, l, sort;
var stopwatch;
var gccode = 'DKK';

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

function cardsCovered(acqs, s) {
   // Check if all cards in settings.cards are covered
   // with the selected acquirers (acqs).

   for (var _card in s.cards) {

      var cardfound = false;
      for (var _acq in acqs) {

         if( ACQs[_acq].cards[_card] ){
            cardfound = true;
            break;
         }
      }
      if (!cardfound) { return false; }
   }
   return true;
}

function clone(obj) {
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

function getInt(elem, action) {

   if (action === 'init') { elem.addEventListener("input", build, false); }

   var str = elem.value.trim();
   if (!isNaN(parseFloat(str)) && isFinite(str) &&
      parseFloat(str) == parseInt(str, 10)) {
      elem.classList.remove('error');
      return parseInt(str, 10);
   }
   $(k).classList.add('error');
   return null;
}

function setInt(k, v) {
   $(k).value = parseInt(v, 10);
   $(k).classList.remove('error');
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

function getCurrency(currency, action) {

   if (action === 'init') { $(currency).addEventListener("input", build, false); }

   var a = _getCurrency($(currency).value);
   if (a === null) {
      $(currency).classList.add('error');
      return null;
   }
   $(currency).classList.remove('error');
   return a;
}

function changeCurrency(option) {
   $('currency_code').innerHTML = option.value;
   set_ccode(option.value);
   build();
   //save_url();
}

function setCurrency(k, v) {
   $(k).value = v.represent();
   $(k).classList.remove('error');
}

function getPercent(k) {
   var elem = $(k);
   var str = elem.value.replace('%', '').replace(',', '.').trim();
   if (!isNaN(parseFloat(str)) && isFinite(str)) {
      $(k).classList.remove('error');
      return parseFloat(str);
   }
   $(k).classList.add('error');
   return null;
}

function setPercent(k, v) {
   $(k).value = (parseFloat(v) + "%").replace('.', ',');
   $(k).classList.remove('error');
}

var opts = {
   'cards': {
      type: "bits",
      bits: 8,
      get: function(action) {
         // Get all selected payment methods from .ocards
         var object = {};
         var ocards = C("ocards");
         for(i = 0; i < ocards.length; i++)
         {
            var checkbox = ocards[i];
            if (action === 'init') { checkbox.addEventListener("click", build, false); }

            if ( checkbox.checked ) {
               object[checkbox.id] = CARDs[checkbox.id];
               if ( checkbox.id == "visa" ) { object.mastercard = CARDs.mastercard; }
            }
         }
         return object;
      },
      set: function(name, value) {
         $(name).checked = value;
      }
   },
   'features': {
      type: "bits",
      bits: 3,
      get: function(action) {
         // Get all selected features
         var object = {};
         var ofeatures = C("ofeatures");
         for(i = 0; i < ofeatures.length; i++)
         {
            var checkbox = ofeatures[i];
            if (action === 'init') { checkbox.addEventListener("click", build, false); }
            if ( checkbox.checked ) { object[checkbox.id] = 1; }
         }
         return object;
      },
      set: function(name, value) {
         $(name).checked = value;
      }
   },
   // Misc
   'acquirers': {
      type: "bits",
      bits: 4,
      get: function(action) {
         if (action === 'init') { $('acquirer').addEventListener("change", build, false); }

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
      set: function(v) {}
   },
   'transactions': {
      type: "string",
      dirty_bits: 1,
      // get_dirty_bits: function() { return +(this.get()); },
      get: function(action) { return getInt($('transactions'), action); },
      set: function(v) { setInt('transactions', v); }
   },
   'avgvalue': {
      type: "currency",
      dirty_bits: 1,
      // get_dirty_bits: function() { return +!this.get(); },
      get: function(action) { return getCurrency('avgvalue', action); },
      set: function(v) { setCurrency('avgvalue', v); }
   },
   'currency': {
      type: "string",
      dirty_bits: 1,
      // get_dirty_bits: function() { return +(this.get()); },
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
      }
   }
   /*
   ,
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
      set: function(i) {}
   }
   */
};

function objectize(arr) {
   // Array to object
   var objekt = {};
   for (i = 0; i < arr.length; i++)
   {
      objekt[arr[i]] = 1;
   }
   return objekt;
}

function build(action) {
   stopwatch = performance.now();
   console.log( (performance.now()-stopwatch).toFixed(4) +"ms ::: build() start");

   if (action == 'init') {
      //init_dirty_bits(); // 0.3 ms
      load_url(); // 0.4 ms
   }

   // Get settings
   var settings = {};
   for (var key in opts) { settings[key] = opts[key].get(action); }
   var acquirers = clone(settings.acquirers);

   settings.acquirersort = [];

   if ( !settings.cards.dankort ) {

      delete acquirers.nets;
      settings.dankort_scale = 0;

      if ( !settings.cards.visa ) {
         alert("Venligst vælg betalingskort");
         return;
      }
      if ( settings.forbrugsforeningen ) {
         alert("Forbrugsforeningen kræver en Dankort aftale.");
         return;
      }
   }
   else {
      acquirers.nets = ACQs.nets;
      settings.dankort_scale = (!settings.cards.visa) ? 1 : 0.8;
   }

   var costs = {};
   var data = [];
   var tbody = document.createElement("tbody");
   tbody.id = "tbody";

   for (i in acquirers) {
      // Calculate individual acquirer costs
      acquirers[i].fee = acquirers[i].costfn(settings);

      for (sort = 0; sort < settings.acquirersort.length; sort++){
         if ( acquirers[i].fee.total.dkk() < acquirers[settings.acquirersort[sort]].fee.total.dkk() ) {
            break;
         }
      }
      settings.acquirersort.splice(sort, 0, i);
   }

   for (i in settings.cards) {
      // Some payment methods have extra costs. Lets calculate them.
      if (settings.cards[i].costfn){
         settings.cards[i].fee = settings.cards[i].costfn(settings);
      }
   }
   console.log( (performance.now()-stopwatch).toFixed(3) +"ms ::: time to build PSPs.");

   psploop:
   for (k in PSPs) {

      var psp = PSPs[k];
      var acq = clone(psp.acquirers || {});
      var setup = new Currency(0, 'DKK'), total = new Currency(0, 'DKK');
      var cardobj = {};

      // Check if psp support all cards
      for (i in settings.cards) {
         if( !psp.cards[i] ){ continue psploop; }
      }
      // Check if psp support all features
      for (i in settings.features) {
         if( !psp.features[i] ){ continue psploop; }
      }

      // Check if a specific acquirer has been chosen
      if ( Object.keys(settings.acquirers).length === 1 ){

         if( !acq[Object.keys(settings.acquirers)[0]] ){
            continue psploop;
         }
      }

      if( Object.getOwnPropertyNames(acq).length === 0) {
         // All-in-one solutions, e.g. Stripe.
         cardobj = psp.cards;
      }
      else {
         // Payment Gateways, e.g. DIBS.
         var newacq = {};

         // Find cheapest acquirer that support all cards
         for (i = 0; i < settings.acquirersort.length; i++) {

            var _acq = settings.acquirersort[i];
            var secondopinion = {};

            if( acq[_acq] ){
               newacq[_acq] = 1; // replace '1' with the costs.
               var objlength = Object.getOwnPropertyNames(newacq).length;

               if( cardsCovered(newacq, settings) ) { break; }
               else if ((newacq.nets && objlength < 2) || (objlength === 0)) { continue; }
               else if ( i+1 == settings.acquirersort.length ) { newacq = false; break; }
               else { delete newacq[_acq]; } // Delete and try with next acquirer
            }
         }
         if (psp.features.multiacquirer) {
         /*
            Challenge newacq ( coming soon! )
         */
         }
         if (!newacq) { continue psploop; }
         acq = newacq;


         for (var ac in acq) {
            // Merge acquirer card lists
            for (var card in acquirers[ac].cards ) {

               // Some cards/methods (e.g. mobilepay) add extra costs.
               // They will only be included if enabled in settings.cards.
               if ( !settings.cards[card] && CARDs[card].costfn ){ continue; }
               cardobj[card] = 1;

               // Add extra costs
               if (CARDs[card].costfn){
                  setup = setup.add(CARDs[card].fee.setup);
                  total = total.add(CARDs[card].fee.monthly);
               }
            }

            var scale = (ac == "nets") ? settings.dankort_scale :  1-settings.dankort_scale;

            setup = setup.add(acquirers[ac].fee_setup);
            total = total
               .add( acquirers[ac].fee.trans.scale(scale))
               .add( acquirers[ac].fee_monthly);
         }
      }

      psp.costs = psp.costfn(settings);

      setup = setup.add(psp.costs.setup);
      total = total
         .add(psp.costs.monthly)
         .add(psp.costs.trans);


      var frag1 = document.createDocumentFragment();
      var wrapper, svg, use;

      for (l in cardobj) {
         wrapper = document.createElement("p");
         wrapper.classList.add("card");
         svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
         use = document.createElementNS("http://www.w3.org/2000/svg",'use');
         use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", CARDs[l].logo);
         use.setAttribute('x','0');
         use.setAttribute('y','0');
         use.setAttribute('height','15');
         svg.appendChild(use);
         wrapper.appendChild(svg);
         frag1.appendChild(wrapper);
      }

      var frag2 = document.createDocumentFragment();
      for (l in acq) {
         wrapper = document.createElement("p");
         wrapper.innerHTML = '<a target="_blank" href="' + ACQs[l].link + '"><img class="acquirer '+l+'" src="/assets/img/psp/' + ACQs[l].logo + '" alt="' + ACQs[l].name +
         '" title="' + ACQs[l].name + '" /></a>';
         frag2.appendChild(wrapper);
      }

      // Sort psp after total.dkk()
      for (sort = 0; sort < data.length; ++sort) {
         if (total.dkk() < data[sort]) { break; }
      }
      data.splice(sort, 0, total.dkk());

      var row = tbody.insertRow(sort);
      row.insertCell(-1).innerHTML = '<a target="_blank" class="psp '+ psp.name.substring(0,4).toLowerCase() +'" href=' + psp.link + '><img src="/assets/img/psp/' + psp.logo + '" alt="' + psp.name +
         '" title="' + psp.name +'" /><p>' + psp.name +'</p></a>';
      row.insertCell(-1).appendChild(frag2);
      row.insertCell(-1).appendChild(frag1);
      row.insertCell(-1).textContent = setup.print();
      row.insertCell(-1).textContent = total.print();
      row.insertCell(-1).textContent = total.scale(1 / settings.transactions).print();

   }
   table.replaceChild(tbody, $('tbody'));

   // if (action !== "init") { save_url(); }

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


/*
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
      first_bit = 0, // from left
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
*/

function get_bit_range(n, from, to, length) {
   // from the left --- only up to 6 bits
   return (n & (MAX_INT32 >>> (31 - length + from))) >>> length - 1 - to;
}

function load_url() {

   var querystring = location.search.replace("?", "");
   if (!querystring) { return; }

   alert("Link-funktionaliteten er midlertidigt fjernet (02/09/2015).");

/*
   var current_char_num = 0;
   var first_bit = 0;
   var dirty_bits_value = 0;
   var dirty_bits_position = 0;
   var dirty_bits_current; // 0 char is ?

   for (i in opts) {
      var obj = opts[i], sum = 0;

      if (obj.dirty_bits) {
         // Wtf does this do...?
         dirty_bits_current = get_bit_range(dirty_bits_value, dirty_bits_position, dirty_bits_position + obj.dirty_bits - 1, opts.dirty_bits.bits);
         dirty_bits_position += obj.dirty_bits;

         if (dirty_bits_current === 0) { continue; }
      }
      if (obj.type === "bits") {
         var remaining_bits = obj.bits;

         while (1) {
            if (current_char_num > querystring.length - 1) { return; } // error querystring too short
            var current_char = querystring.charAt(current_char_num);

            if (current_char === ";") { break; }
            var n = base64_chars.indexOf(current_char);

            if (n === -1) { return; } // error invalid char
            var last_bit = first_bit + remaining_bits - 1;

            if (last_bit > 5) { last_bit = 5; }
            remaining_bits -= 1 + last_bit - first_bit;
            sum += get_bit_range(n, first_bit, last_bit, 6) << remaining_bits;

            if (remaining_bits > 0) {
               first_bit = 0;
               current_char_num++;
            }
            else {
               first_bit = last_bit + 1;

               if (first_bit > 5) {
                  first_bit = 0;
                  current_char_num++;
               }
               break;
            }
         }
         obj.set(sum);

         if (i === "dirty_bits") { dirty_bits_value = sum; }

         if (first_bit > 0) {
            first_bit = 0;
            current_char_num++;
         }
         if (querystring.charAt(current_char_num) === ";") { current_char_num++; }
         var next_separator_index = querystring.indexOf(";", current_char_num);

         if (next_separator_index === -1) { next_separator_index = querystring.length; }
         var str = querystring.substring(current_char_num, next_separator_index);
         current_char_num += str.length;

         if (obj.type === "string") { opts[i].set(str); }
         else if (obj.type === "currency") { opts[i].set(_getCurrency(str)); }
      }
   }
   */
}

build('init');
