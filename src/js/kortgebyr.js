/**
*  First shalt thou take out the Holy Pin. Then...
*  @author Ulrik Moe, Christian Blach, Joakim Sindholt
*  @license GPLv3
*
*  Indentation: 3 spaces
*  Conventions: https://github.com/airbnb/javascript
*
*  Ugly fixes:
*  1) Nets needs to be the first acquirer in acquirersort. The problem is that
*     we don't iterate through acquirers properly when we try to find the
*     cheapest combination of acquirers.
*
*  To do:
*  1) 'psp.features.multiacquirer'
*
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
   if (parts.length === 2 && parts[1].length === 1) {
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

Currency.prototype.string = function() {
   if (this.length() === 1) {
      for (var code in this.amounts) {
         return this.amounts[code] + code;
      }
   }
   return this.dkk() / currency_value[gccode] + gccode; //currency_map[gccode];
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
        if (obj.hasOwnProperty(attr)) { copy[attr] = obj[attr]; }
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
      parseFloat(str) === parseInt(str, 10)) {
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

function tooltip() {}



var opts = {
   'cards': {
      type: "bits",
      bits: function() {
          return C("ocards").length;
      },
      get: function(action) {
         // Get all selected payment methods from .ocards
         var object = {};
         var ocards = C("ocards");
         var bitval = 0;
         for(i = 0; i < ocards.length; i++) {
            var checkbox = ocards[i];
            if (action === 'init') { checkbox.addEventListener("click", build, false); }

            if (checkbox.checked) {
               object[checkbox.id] = CARDs[checkbox.id];
               if (checkbox.id === "visa") { object.mastercard = CARDs.mastercard; }
               bitval += 1 << i;
            }
         }
         if (action === "url") { return bitval; }
         return object;
      },
      set: function(bitval) {
         var ocards = C("ocards");
         for(i = 0; i < ocards.length; i++) {
            var checkbox = ocards[i];
            checkbox.checked = (bitval & (1 << i)) !== 0;
         }
      }
   },
   'features': {
      type: "bits",
      bits: function() {
          return C("ofeatures").length;
      },
      get: function(action) {
         // Get all selected features
         var object = {};
         var ofeatures = C("ofeatures");
         var bitval = 0;
         for(i = 0; i < ofeatures.length; i++) {
            var checkbox = ofeatures[i];
            if (action === 'init') { checkbox.addEventListener("click", build, false); }
            if ( checkbox.checked ) {
                object[checkbox.id] = 1;
                bitval += 1 << i;
            }
            //if (action === "url") console.log(ofeatures[i].id + ": " + checkbox.checked);
         }
         if (action === "url") {return bitval;}
         return object;
      },
      set: function(bitval) {
         var ofeatures = C("ofeatures");
         for(i = 0; i < ofeatures.length; i++) {
             var checkbox = ofeatures[i];
             checkbox.checked = (bitval & (1 << i)) !== 0;
         }
      }
   },
   // Misc
   'acquirers': {
      type: "bits",
      bits: function() {
          var len = $("acquirer").length;
          var nbits = 0;
          while (len > 0) {
              len = len >>> 1;
              nbits++;
          }
          return nbits;
      },
      get: function(action) {
         if (action === 'init') { $('acquirer').addEventListener("change", build, false); }

         // Return the selected acquirers
         var name = $("acquirer").value;
         if (action === "url" ){
             return $("acquirer").selectedIndex;
         }
         if ($("acquirer").value === 'auto') {
            return ACQs;
         }
         else {
            var objekt = {};
            objekt[name] = ACQs[name];
            return objekt;
         }
      },
      set: function(bitval) {
         if (bitval < $("acquirer").length) { $("acquirer").selectedIndex = bitval; }
      },
   },
   'transactions': {
      type: "string",
      dirty_bits: 1,
      get_dirty_bits: function() { return +(this.get() !== parseInt($('transactions').defaultValue)); },
      get: function(action) { return getInt($('transactions'), action); },
      set: function(v) { setInt('transactions', v); }
   },
   'avgvalue': {
      type: "currency",
      dirty_bits: 1,
      get_dirty_bits: function() { console.log("?????");console.log(this.get());console.log(_getCurrency($('avgvalue').defaultValue));
          return +(!this.get().is_equal_to(_getCurrency($('avgvalue').defaultValue))); },
      get: function(action) { return getCurrency('avgvalue', action); },
      set: function(v) { setCurrency('avgvalue', _getCurrency(v)); }
   },
   'currency': {
      type: "string",
      dirty_bits: 1,
       get_dirty_bits: function() { return +(this.get() !== $('currency_code_select').options[0].value); },
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
   },
   // Dirty bits: bit0 = er der ændret i antal/gns, bit 1..N_acquirers+1 er der ændret i acquirer costs?  --- Objekter der bruger dirty-bits skal være EFTER
   /*'dirty_bits': {
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
   }*/
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
   //console.log( (performance.now()-stopwatch).toFixed(4) +"ms ::: build() start");

   if (action === 'init') {
      //init_dirty_bits(); // 0.3 ms
      loadurl(); // 0.4 ms
   }

   // Get settings
   var settings = {};
   for (var key in opts) { if (key !== "dirty_bits") { settings[key] = opts[key].get(action); }}
   var acquirers = clone(settings.acquirers);

   settings.acquirersort = [];

   if ( !settings.cards.dankort ) {

      delete acquirers.nets;
      settings.dankort_scale = 0;

      if ( !settings.cards.visa ) {
         $('tbody').innerHTML = "";
         alert("Venligst vælg enten Dankort, Visa eller MasterCard.");
         return;
      }
      if ( settings.cards.forbrugsforeningen ) {
         $('tbody').innerHTML = "";
         alert("Forbrugsforeningens kontokort kræver en Dankort aftale.");
         return;
      }
   }
   else {
      acquirers.nets = ACQs.nets;
      settings.dankort_scale = (!settings.cards.visa) ? 1 : 0.77;
   }

   var costs = {};
   var data = [];
   var tbody = document.createElement("tbody");
   tbody.id = "tbody";

   for (i in acquirers) {

      // Calculate individual acquirer costs
      acquirers[i].fee = acquirers[i].costfn(settings);

      if (i === "nets") { continue; } // uglyfix[1]

      for (sort = 0; sort < settings.acquirersort.length; sort++){
         if ( acquirers[i].fee.total.dkk() < acquirers[settings.acquirersort[sort]].fee.total.dkk() ) {
            break;
         }
      }

      settings.acquirersort.splice(sort, 0, i);
   }
   if (acquirers.nets) { settings.acquirersort.splice(0, 0, "nets"); } // uglyfix[1]

   for (i in settings.cards) {
      // Some payment methods have extra costs. Lets calculate them.
      if (settings.cards[i].costfn){
         settings.cards[i].fee = settings.cards[i].costfn(settings);
      }
   }

   //console.log( (performance.now()-stopwatch).toFixed(3) +"ms ::: time to build PSPs.");

   var klik = function(psp, acquirers, acqlabels, settings) {
      return function() {
         buildInfoModal(psp, acquirers, acqlabels, settings);
      };
   };

   psploop:
   for (k in PSPs) {

      var psp = PSPs[k];
      var acq = clone(psp.acquirers || {});
      var setup = new Currency(0, 'DKK'), recurring = new Currency(0, 'DKK'), total = new Currency(0, 'DKK');
      var cardobj = {};

      // Check if psp support all cards
      for (i in settings.cards) {
         if( !psp.cards[i] ){ continue psploop; }
      }
      // Check if psp support all features
      for (i in settings.features) {
         if( !psp.features[i] ){ continue psploop; }
      }

      // If a specific acquirer has been chosen (select dropdown)
      if ( Object.keys(settings.acquirers).length === 1 ){

         // Skip psp if it does not support selected acquirer
         if( !acq[Object.keys(settings.acquirers)[0]] ){
            continue psploop;
         }
      }

      if( Object.getOwnPropertyNames(acq).length === 0) {
         // All-in-one solutions, e.g. Stripe.

         for (var x in psp.cards ) {
            //  Some cards/methods (e.g. mobilepay) add extra costs.
            //  They will only be included if enabled in settings.cards.
            if (CARDs[x].costfn){
               if (!settings.cards[x]) { continue; }
               setup = setup.add(CARDs[x].fee.setup);
               recurring = recurring.add(CARDs[x].fee.monthly);
            }
            cardobj[x] = 1;
         }

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

               if ( cardsCovered(newacq, settings) ) { break; }
               else if ((newacq.nets && objlength < 2) || (objlength === 0)) { continue; }
               else if ( i+1 === settings.acquirersort.length ) { newacq = false; break; }
               else { delete newacq[_acq]; } // Delete and try with next acquirer
            }
         }

         // Challenge newacq ( coming soon! )
         if (psp.features.multiacquirer) {}

         // Skip PSP if acquirer does not support cards
         if ( Object.getOwnPropertyNames(newacq).length === 0) { continue psploop; }
         acq = newacq;

         for (var ac in acq) {
            // Merge acquirer card lists
            for (var card in acquirers[ac].cards ) {

               // Some cards/methods (e.g. mobilepay) add extra costs.
               // They will only be included if enabled in settings.cards.
               if ( cardobj[card] || (!settings.cards[card] && CARDs[card].costfn) ){ continue; }

               if (CARDs[card].costfn){
                  setup = setup.add(CARDs[card].fee.setup);
                  recurring = recurring.add(CARDs[card].fee.monthly);
               }
               cardobj[card] = 1;
            }

            var scale = (ac === "nets") ? settings.dankort_scale :  1-settings.dankort_scale;

            setup = setup.add(acquirers[ac].fee_setup);
            recurring = recurring.add( acquirers[ac].fee_monthly);
            total = total.add( acquirers[ac].fee.trans.scale(scale));
         }
      }

      psp.costs = psp.costfn(settings);

      setup = setup.add(psp.costs.setup);
      recurring = recurring.add(psp.costs.monthly);
      total = total.add(psp.costs.trans).add(recurring);

      var cardfrag = document.createDocumentFragment();
      var wrapper, svg, use;

      for (l in cardobj) {
         wrapper = document.createElement("p");
         wrapper.classList.add("card");
         // wrapper.addEventListener("mouseover", tooltip);
         // el.addEventListener("click", function(){modifyText("four")}, false);
         svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
         use = document.createElementNS("http://www.w3.org/2000/svg",'use');
         use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", CARDs[l].logo);
         use.setAttribute('x','0');
         use.setAttribute('y','0');
         use.setAttribute('height','15');
         svg.appendChild(use);
         wrapper.appendChild(svg);
         cardfrag.appendChild(wrapper);
      }

      var more = document.createElement("p");
      var rand = Math.floor(Math.random() * 6) + 1;
      more.innerHTML = "<a href='#'>"+ rand + "</a>";
      // cardfrag.appendChild(more);

      var acqfrag = document.createDocumentFragment();
      for (l in acq) {
         wrapper = document.createElement("p");
         wrapper.className = "acquirer";
         //wrapper.addEventListener("mouseover", tooltip);

         wrapper.innerHTML = '<a target="_blank" href="' + ACQs[l].link + '"><img class="'+l+'" src="/img/psp/' + ACQs[l].logo + '" alt="' + ACQs[l].name +
         '" title="' + ACQs[l].name + '" /></a>';
         acqfrag.appendChild(wrapper);
      }

      // Sort psp after total.dkk()
      for (sort = 0; sort < data.length; ++sort) {
         if (total.dkk() < data[sort]) { break; }
      }
      data.splice(sort, 0, total.dkk());

      var row = tbody.insertRow(sort);
      //row.className = psp.name.toLowerCase().replace(/[0-9\s]/g, '');
      row.className = psp.logo.split('.')[0].replace(/[^a-z]/g, '');

      row.insertCell(-1).innerHTML = '<a target="_blank" class="psp" href=' + psp.link + '><img src="/img/psp/' + psp.logo + '" alt="' + psp.name +
         '" title="' + psp.name +'" /><p>' + psp.name +'</p></a>';
      row.insertCell(-1).appendChild(acqfrag);
      row.insertCell(-1).appendChild(cardfrag);
      row.insertCell(-1).textContent = setup.print();
      row.insertCell(-1).textContent = recurring.print();
      row.insertCell(-1).textContent = total.print();

      var kortgebyr = total.scale(1 / settings.transactions);
      var kortprocent = kortgebyr.scale( 1/settings.avgvalue.dkk()).dkk()*100;

      row.insertCell(-1).innerHTML = "<p class='kortgebyr'>"+total.scale(1 / settings.transactions).print() + "</p><p class='procent'>≈ " + kortprocent.toFixed(3).replace('.', ',') + " %</p>";

      var infoButton = document.createElement("div");
      infoButton.classList.add("infobutton");
      /* construct acq list */
      infoButton.addEventListener("click", klik(psp, acquirers, acq, settings));

      infoButton.textContent = "Se mere";
      row.insertCell(-1).appendChild(infoButton);
   }
   table.replaceChild(tbody, $('tbody'));

   if (action !== "init") { saveurl(); }

   //console.log( (performance.now()-stopwatch).toFixed(3) +"ms ::: done building \n ");

}

//===========================
//            Modal
//===========================

function buildInfoModal(psp, acquirers, acqlabels, settings) {
   var overlay = document.querySelector(".overlay.pspinfo");
   var content = overlay.getElementsByClassName("content")[0];
   var frag = document.createDocumentFragment();
   content.innerHTML = "";
   /*var h = document.createElement("h1");
   frag.appendChild(h).textContent = "Oversigt over " + psp.name;*/

   var psptitle = document.createElement("h3");
   frag.appendChild(psptitle).textContent = "Omkostninger til payment gateway:";

   var psph = document.createElement("h4");
   var pspBlock = document.createElement("div");
   var pspSetup = document.createElement("div");
   var pspMonthly = document.createElement("div");
   var pspTrans = document.createElement("div");

   pspBlock.classList.add("costblock");

   pspBlock.appendChild(psph).textContent = psp.name + ":";
   pspBlock.appendChild(pspSetup).textContent = "Oprettelse: " + psp.costs.setup.print();
   pspBlock.appendChild(pspMonthly).textContent = "Abonnement per måned: " + psp.costs.monthly.print();
   pspBlock.appendChild(pspTrans).textContent = "Transaktionsgebyrer: " + psp.costs.trans.print();
   frag.appendChild(pspBlock);

   if (Object.keys(acqlabels).length > 0) {
      frag.appendChild(document.createElement("hr"));
      var acqtitle = document.createElement("h3");
      frag.appendChild(acqtitle).textContent = "Indløseromkostninger:";
      if (acqlabels.nets && Object.keys(acqlabels).length > 1) {
         var acqdescription = document.createElement("div");
         frag.appendChild(acqdescription).textContent = "Det antages jævnfør FDIH's statistikker at Nets modtager 77% af transaktionerne (fra visa/dankort samt rene dankort), mens den sekundære indløser modtager 23%.";
      }
   }
   for (var label in acqlabels) {
      var acq = acquirers[label];
      var acqblock = document.createElement("div");
      var acqh = document.createElement("h4");

      var acqSetup = document.createElement("div");
      var acqMonthly = document.createElement("div");
      var acqTrans = document.createElement("div");

      acqblock.classList.add("costblock");

      acqblock.appendChild(acqh).textContent = acq.name + ":";
      acqblock.appendChild(acqSetup).textContent = "Oprettelse: " + acq.fee_setup.print();
      acqblock.appendChild(acqMonthly).textContent = "Abonnement per måned: " + acq.fee_monthly.print();
      var scale = (label === "nets") ? settings.dankort_scale : 1 - settings.dankort_scale;
      acqblock.appendChild(acqTrans).textContent = "Transaktionsgebyrer: " + acq.fee.trans.scale(scale).print();
      frag.appendChild(acqblock);
   }

   if (settings.cards.mobilepay) {
      var mpayblock = document.createElement("div");
      var mpayh = document.createElement("h4");
      var mpaySetup = document.createElement("div");
      var mpayMonthly = document.createElement("div");
      var mpayTrans = document.createElement("div");
      mpayblock.classList.add("costblock");
      mpayblock.appendChild(mpayh).textContent = "Extra til Mobilepay oven i indløseromkostninger:";
      mpayblock.appendChild(mpaySetup).textContent = "Oprettelse: " + settings.cards.mobilepay.fee.setup.print();
      mpayblock.appendChild(mpayMonthly).textContent = "Abonnement per måned: " + settings.cards.mobilepay.fee.monthly.print();
      mpayblock.appendChild(mpayTrans).textContent = "Transaktionsgebyrer: 1kr ekstra pr. mobilepay transaktion";
      frag.appendChild(mpayblock);
   }

   content.appendChild(frag);
   overlay.classList.add("active");
}

document.onkeydown = function(e) {
   e = e || window.event;
   if ((e.keyCode || e.which) === 27) {
      var containers = document.querySelectorAll('.overlay.active');
      for (var i in containers) {
         if (!isNaN(i)) {
            containers[i].classList.remove('active');
         }
      }
   }
};



//===========================
//            URL
//===========================

var base64_chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/";

function Base64Array(initsize) {
    this.bitpos = 0; // from 0 - 5
    this.array = [];
    this.pos = 0;
}

Base64Array.prototype.pushbit = function(bit) {
    if (this.array.length === 0) {this.array.push(0);}
    if (this.bitpos > 5) {
        this.bitpos = 0;
        this.array.push(0);
    }
    this.array[this.array.length - 1] += bit << this.bitpos;
    this.bitpos++;
};

Base64Array.prototype.getbit = function() {
    if (this.bitpos > 5) {
        this.bitpos = 0;
        this.pos++;
    }
    var bitval = (this.array[this.pos] & (1 << this.bitpos)) >>> this.bitpos;
    this.bitpos++;
    return bitval;
};

Base64Array.prototype.pushbits = function(bitval, nbits) {
    for(var i = 0; i < nbits; i++) {
        this.pushbit((bitval & (1 << i)) >>> i);
    }
};

Base64Array.prototype.encode = function() {
    var encstr = "";
    for (var i = 0; i < this.array.length; i++) {
        console.log("arr[" + i + "] = " + this.array[i]);
        encstr += base64_chars[this.array[i]];
    }
    return encstr;
};

Base64Array.prototype.pushbase64char = function(b64char) {
    var index = base64_chars.indexOf(b64char);
    if (index < 0) {
        console.log("Unexpected query character " + b64char);
        return -1;
    }
    this.array.push(index);
    return 0;
};

Base64Array.prototype.getbits = function(nbits) {
    var val = 0;
    for (var i = 0; i < nbits; i++) {
        val += this.getbit() << i;
    }
    return val;
};


/* Save the url to the following structure URL = kortgebyr.dk?{BITS}{ARGUMENT STRING}*/
function saveurl() {
    var argstr = ""; // The optional arguments string which follows the base64 enc. bits
    var nbits; // the number of bits for the current option
    var optbits; // The bits for the current option
    var bitbuf = new Base64Array(); // The buffer used for containing bits until they are flushed
    var o;

    /* Loop through the options and construct the url */
    for (var key in opts) {
        o = opts[key];

        /* Depending on whether dirty bits are used or not, react accordingly */
        if (o.dirty_bits) {
            nbits = o.dirty_bits;
            optbits = o.get_dirty_bits("url");
            var ret = o.get();
            /* Create the argument string part if dirty bit is set */
            if (optbits) {
                if (ret instanceof Currency) {
                    argstr += ";" + ret.string();
                } else {
                    argstr += ";" + ret;
                }
            }

        } else if (o.bits) {
            nbits = typeof(o.bits) === "function" ? o.bits() : o.bits;
            optbits = o.get("url");
        } else {
            console.log("opt " + key + " neither has a bits field or a dirty_bits field");
            return;
        }
        bitbuf.pushbits(optbits, nbits);
    }


    history.replaceState({
       foo: "bar"
    }, "", "?" + bitbuf.encode() + argstr);
}

function loadurl() {
    var querystring = location.search.replace("?", "");
    if (!querystring) { return; }

    var encbits = ""; // The base64 encoded bits
    var args; // The optional arguments string which follows the base64 enc. bits
    var nbits; // the number of bits for the current option
    var bitval;
    var bitbuf = new Base64Array(); // The buffer used for containing bits until they are flushed
    var o;

    /* Check if any additional args after the bits and
       create the arg array if that is the case */
    var nb64chars = querystring.indexOf(";");
    if (nb64chars < 0) {
        nb64chars = querystring.length;
    } else {
        args = querystring.slice(nb64chars + 1).split(";");
    }

    /* Load the base64 representation of the bits into a base64array type */
    for (var i = 0; i < nb64chars; i++) {
        if (bitbuf.pushbase64char(querystring[i]) !== 0) {
            console.log("error parsing bits");
            return -1;
        }
    }

    /* Loop through the opts set the fields with values loaded from the url */
    for (var key in opts) {
        o = opts[key];
        /* Check if opt has dirty bits, if so load arg */
        if (o.dirty_bits) {
            nbits = o.dirty_bits;
            bitval = bitbuf.getbits(nbits);
            if (bitval > 0) {
                o.set(args[0]);
                args.shift();
            }
        /* Otherwise just load the bits directly */
        } else if (o.bits){
            nbits = typeof(o.bits) === "function" ? o.bits() : o.bits;
            bitval = bitbuf.getbits(nbits);
            o.set(bitval);
        } else {
            console.log("opt " + key + " neither has a bits field or a dirty_bits field");
            return;
        }
        /* Create the argument string part if dirty bit is set */
    }
}

build('init');
