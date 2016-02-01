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
function $(s) { return document.getElementById(s); }
function C(s) { return document.getElementsByClassName(s); }

var i, k, l, sort, card, acquirer;
var gccode = 'DKK';

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


var opts = {
   'cards': {
      type: "bits",
      bits: function() { return C("ocards").length; },
      get: function(action) {
         // Get all selected payment methods from .ocards
         var object = {};
         var ocards = C("ocards");
         var bitval = 0;
         for(i = 0; i < ocards.length; i++) {
            var checkbox = ocards[i];
            if (checkbox.checked) {
               object[checkbox.id] = CARDs[checkbox.id];
               if (checkbox.id === "visa") { object.mastercard = CARDs.mastercard; }
               bitval += 1 << i;
            }
         }
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
      bits: function() { return C("ofeatures").length; },
      get: function(action) {
         // Get all selected features
         var object = {};
         var ofeatures = C("ofeatures");
         var bitval = 0;
         for(i = 0; i < ofeatures.length; i++) {
            var checkbox = ofeatures[i];
            if ( checkbox.checked ) {
                object[checkbox.id] = 1;
                bitval += 1 << i;
            }
         }
         //if (action === "url") { return bitval; }
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
         // Return the selected acquirers
         var name = $("acquirer").value;
         //if (action === "url" ){ return $("acquirer").selectedIndex; }
         if (name === "auto") { return null; }
         else {
            var obj = {};
            obj.nets = ACQs.nets;
            obj[name] = ACQs[name];
            return obj;
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
      get_dirty_bits: function() {
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
   }
};


function build(action) {

   if (action === 'init') { loadurl(); }

   // Get settings
   var data = [];
   var tbody = document.createElement("tbody");
   tbody.id = "tbody";

   var settings = {};
   for (var key in opts) {
      if (key !== "dirty_bits") {
         settings[key] = opts[key].get(action);
      }
   }

   var dankortscale = (!settings.cards.visa) ? 1 : 0.77;

   // Calculate acquirer costs.
   for (i in ACQs) {
      var acq = ACQs[i];
      dankortscale = (acq.name==="nets") ? dankortscale : 1-dankortscale;
      acq.trnfees = acq.fees.trn(settings).scale(settings.transactions).scale(dankortscale);
      acq.TC = acq.trnfees.add(acq.fees.monthly);
   }

   // Sort acquirers.
   ACQs.sort(function(obj1, obj2) {
   	return obj1.TC.dkk() - obj2.TC.dkk();
   });

   psploop:
   for (i in PSPs) {
      var psp = PSPs[i];
      var setup = new Currency(0, 'DKK');
      var monthly = new Currency(0, 'DKK');
      var trnfee = new Currency(0, 'DKK');
      var total = new Currency(0, 'DKK');

      // Check if psp support all payment methods
      for (card in settings.cards) { if( !psp.cards[card] ){ continue psploop; } }

      // Check if psp support all features
      for (card in settings.features) { if( !psp.features[card] ){ continue psploop; } }

      // Payment Gateways, e.g. DIBS, ePay, Quickpay.
      if( psp.acquirers ) {

         // Find first combination of acquirers that support all cards
         for (i in ACQs) {

            var acq = ACQs[i];

            if ( psp.acquirers[acq.name] ){


            }

            var objlength = Object.getOwnPropertyNames(acq).length;

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

            if ((acq.nets && objlength < 2) || (objlength === 0)) { continue; }
            else if ( i+1 === acqarr.length ) { acq = false; break; }
            else { delete acq[acquirer]; } // Delete and try with next acquirer

         }

         // Skip PSP if no acquirer support all cards
         if ( Object.keys(acq).length === 0 ) {
            console.log("skip " + psp.name);
            continue psploop;
         }
      }

      //  Some cards/methods (e.g. mobilepay) add extra costs.
      //  They should only be included if enabled in settings.cards.
      var cardfrag = document.createDocumentFragment();
      for (card in psp.cards) {

         if ( CARDs[card].fees ){
            if ( settings.cards[card] ) {
               setup = setup.add(CARDs[card].fees.setup);
               monthly = monthly.add(CARDs[card].fees.monthly);
               //trnfee = trnfee.add(CARDs[card].fees.trnfee);
            }
            else { continue; }
         }

         var cardicon = new Image(22, 15);
         cardicon.src = "/img/cards/" + card + ".svg";
         cardicon.alt = CARDs[card].name || card;
         cardicon.className = "card";
         cardfrag.appendChild(cardicon);
      }

      //
      var link, img;
      var acqfrag = document.createDocumentFragment();
      for (acquirer in acq) {

         setup = setup.add( acqobj[acquirer].fees.setup );
         monthly = monthly.add( acqobj[acquirer].fees.monthly );
         total = total.add( acqobj[acquirer].trnfees );

         link = document.createElement('a');
         link.href = ACQs[acquirer].link;
         link.className = "acq";
         img = new Image(ACQs[acquirer].w, ACQs[acquirer].h);
         img.src = "/img/psp/" + ACQs[acquirer].logo;
         img.alt = ACQs[acquirer].name;
         link.appendChild(img);
         acqfrag.appendChild(link);
      }

      setup = setup.add(psp.fees.setup);
      monthly = monthly.add(psp.fees.monthly);
      total = total.add(psp.fees.trn).add(monthly);

      // Sort psp after total.dkk()
      for (sort = 0; sort < data.length; ++sort) {
         if (total.dkk() < data[sort]) { break; }
      }
      data.splice(sort, 0, total.dkk());

      var row = tbody.insertRow(sort);
      row.className = psp.logo.split('.')[0].replace(/[^a-z]/g, '');

      // Create PSP logo.
      var pspfrag = document.createDocumentFragment();
      link = document.createElement('a');
      link.target = "_blank";
      link.href = psp.link;
      link.className = "psp";
      img = new Image(psp.w, psp.h);
      img.src = "/img/psp/" + psp.logo;
      img.alt = psp.name;
      var p = document.createElement("p");
      p.textContent = psp.name;
      link.appendChild(img);
      link.appendChild(p);
      pspfrag.appendChild(link);

      var kortgebyr = total.scale(1 / settings.transactions);
      var kortprocent = kortgebyr.scale( 1/settings.avgvalue.dkk()).dkk()*100;

      // Modal window
      var klik = function(psp, acqobj, acqlabels, settings) {
         return function() { buildInfoModal(psp, acqobj, acqlabels, settings); };
      };

      var infoButton = document.createElement("div");
      infoButton.classList.add("infobutton");
      /* construct acq list */
      infoButton.addEventListener("click", klik(psp, acqobj, acq, settings));
      infoButton.textContent = "Se mere";

      row.insertCell(-1).appendChild(pspfrag);
      row.insertCell(-1).appendChild(acqfrag);
      row.insertCell(-1).appendChild(cardfrag);
      row.insertCell(-1).textContent = setup.print();
      row.insertCell(-1).textContent = monthly.print();
      row.insertCell(-1).textContent = total.print();
      row.insertCell(-1).innerHTML = "<p class='kortgebyr'>"+total.scale(1 / settings.transactions).print() + "</p><p class='procent'>≈ " + kortprocent.toFixed(3).replace('.', ',') + " %</p>";
      row.insertCell(-1).appendChild(infoButton);
   }
   table.replaceChild(tbody, $('tbody'));

   if (action !== "init") { saveurl(); }

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

   var psph = document.createElement("h4");
   var pspBlock = document.createElement("div");
   var pspSetup = document.createElement("div");
   var pspMonthly = document.createElement("div");
   var pspTrans = document.createElement("div");

   if (acqlabels.nets && Object.keys(acqlabels).length > 1) {
      var acqdescription = document.createElement("div");
      acqdescription.className = "acqdescription";
      frag.appendChild(acqdescription).textContent = "Ved udregning af gebyrerne antages det, jf. statistik fra FDIH, at 77% af betalingerne sker med Visa/Dankort. Disse vil blive håndteret som Dankort transaktioner hos Nets, mens den sekundære indløser håndterer de resterende 23%.";
   }

   pspBlock.classList.add("costblock");
   pspBlock.appendChild(psph).textContent = psp.name + ":";
   pspBlock.appendChild(pspSetup).textContent = "Oprettelse: " + psp.fees.setup.print();
   pspBlock.appendChild(pspMonthly).textContent = "Abonnement per måned: " + psp.fees.monthly.print();
   pspBlock.appendChild(pspTrans).textContent = "Transaktionsgebyrer: " + psp.fees.trn.print();
   frag.appendChild(pspBlock);

   for (var label in acqlabels) {
      var acq = acquirers[label];
      var acqblock = document.createElement("div");
      var acqh = document.createElement("h4");

      var acqSetup = document.createElement("div");
      var acqMonthly = document.createElement("div");
      var acqTrans = document.createElement("div");

      acqblock.classList.add("costblock");
      acqblock.appendChild(acqh).textContent = acq.name + ":";
      acqblock.appendChild(acqSetup).textContent = "Oprettelse: " + acq.fees.setup.print();
      acqblock.appendChild(acqMonthly).textContent = "Abonnement per måned: " + acq.fees.monthly.print();
      var scale = (label === "nets") ? settings.dankort_scale : 1 - settings.dankort_scale;
      acqblock.appendChild(acqTrans).textContent = "Transaktionsgebyrer: " + acq.trnfees.print() + "*";
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

var inputs = document.getElementsByTagName("input");
for (i=0; i<inputs.length; i++){
   inputs[i].addEventListener("change", build, false);
}
$('acquirer').addEventListener("change", build, false);
