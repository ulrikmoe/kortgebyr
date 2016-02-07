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

var table = $('table');
function $(s){ return document.getElementById(s); }
function C(s){ return document.getElementsByClassName(s); }

// var l, sort, card, acquirer;
var gccode = 'DKK';
var settings;

function set_ccode(c){
   if (currency_map.hasOwnProperty(c)){
      gccode = c;
   }
}


function Currency(amt, code){
   this.amounts = {};
   this.amounts[code] = amt;
}

Currency.prototype.type = "currency";

Currency.prototype.print = function(){
   var number = Math.round((this.dkk() * 100) / currency_value[gccode]) / 100;
   var parts = number.toString().split(".");
   parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
   if (parts.length === 2 && parts[1].length === 1){
      parts[1] += "0";
   }
   return parts.join(",") + " " + currency_map[gccode];
};

Currency.prototype.represent = function(){
   if (this.length() === 1){
      for (var code in this.amounts){
         //if (currency_map.hasOwnProperty(code)){
         //    return this.amounts[code] + ' ' + currency_map[code];
         //}
         return this.amounts[code] + ' ' + code;
      }
   }
   return this.dkk() / currency_value[gccode] + ' ' + gccode; //currency_map[gccode];
};

Currency.prototype.string = function(){
   if (this.length() === 1){
      for (var code in this.amounts){
         return this.amounts[code] + code;
      }
   }
   return this.dkk() / currency_value[gccode] + gccode; //currency_map[gccode];
};

Currency.prototype.length = function(){
   var k, n = 0;
   for (k in this.amounts){
      if (this.amounts.hasOwnProperty(k)){
         n++;
      }
   }
   return n;
};

Currency.prototype.dkk = function(){
   var sum = 0;
   for (var code in this.amounts){
      if (this.amounts.hasOwnProperty(code) &&
         currency_value.hasOwnProperty(code)){
         sum += currency_value[code] * this.amounts[code];
      }
   }
   return sum;
};


Currency.prototype.add = function(rhs){

   // typeof(object) === 'function';

   var n = new Currency(0, 'DKK');
   var code;

   for (code in this.amounts){
      if (this.amounts.hasOwnProperty(code)){
         n.amounts[code] = this.amounts[code];
      }
   }

   for (code in rhs.amounts){
      if (rhs.amounts.hasOwnProperty(code)){
         if (!n.amounts.hasOwnProperty(code)){
            n.amounts[code] = 0;
         }
         n.amounts[code] += rhs.amounts[code];
      }
   }
   return n;
};

Currency.prototype.is_equal_to = function(other_currency_object){
   for (var code in this.amounts){
      if (this.amounts.hasOwnProperty(code)){
         if (this.amounts[code] !== other_currency_object.amounts[code]){
            return false;
         }
      }
   }
   return true;
};

Currency.prototype.scale = function(rhs){
   var n = new Currency(0, 'DKK');

   for (var code in this.amounts){
      if (this.amounts.hasOwnProperty(code)){
         n.amounts[code] = this.amounts[code] * rhs;
      }
   }
   return n;
};


function getInt(elem, action){

   if (action === 'init'){ elem.addEventListener("input", build, false); }

   var str = elem.value.trim();
   if (!isNaN(parseFloat(str)) && isFinite(str) &&
      parseFloat(str) === parseInt(str, 10)){
      elem.classList.remove('error');
      return parseInt(str, 10);
   }
   $(k).classList.add('error');
   return null;
}

function setInt(k, v){
   $(k).value = parseInt(v, 10);
   $(k).classList.remove('error');
}

function mkcurregex(){
   var k, a = [];
   for (k in currency_map){
      a.push(currency_map[k]);
   }
   for (k in currency_value){
      a.push(k);
   }
   return RegExp("^ *([0-9][0-9., ]*)(" + a.join("|") + ")? *$", "i");
}
var curregex = mkcurregex();

function _getCurrency(currency){
   var a = currency.match(curregex);
   if (a === null){
      return null;
   }
   var c = a[2] ? a[2] : currency_map[gccode];
   if (c.toLowerCase() === currency_map[gccode].toLowerCase()){
      /* there are a lot of currencies named kr and we should prefer the kr
       * that has been selected */
      c = gccode;
   } else {
      /* if that's not what's selected, find the currency */
      for (var k in currency_map){
         if (currency_map[k].toLowerCase() === c.toLowerCase() ||
            k.toLowerCase() === c.toLowerCase()){
            c = k;
            break;
         }
      }
   }
   return new Currency(parseFloat(a[1].replace('.', '').replace(',', '.')), c);
}

function getCurrency(currency, action){

   if (action === 'init'){ $(currency).addEventListener("input", build, false); }

   var a = _getCurrency($(currency).value);
   if (a === null){
      $(currency).classList.add('error');
      return null;
   }
   $(currency).classList.remove('error');
   return a;
}

function changeCurrency(option){
   $('currency_code').innerHTML = option.value;
   set_ccode(option.value);
   build();
   //save_url();
}

function setCurrency(k, v){
   $(k).value = v.represent();
   $(k).classList.remove('error');
}

function getPercent(k){
   var elem = $(k);
   var str = elem.value.replace('%', '').replace(',', '.').trim();
   if (!isNaN(parseFloat(str)) && isFinite(str)){
      $(k).classList.remove('error');
      return parseFloat(str);
   }
   $(k).classList.add('error');
   return null;
}

function setPercent(k, v){
   $(k).value = (parseFloat(v) + "%").replace('.', ',');
   $(k).classList.remove('error');
}


var opts = {
   'cards': {
      type: "bits",
      bits: function(){ return C("ocards").length; },
      get: function(action){
         // Get all selected payment methods from .ocards
         var object = {};
         var ocards = C("ocards");
         var bitval = 0;
         for(i = 0; i < ocards.length; i++){
            var checkbox = ocards[i];
            if (checkbox.checked){
               object[checkbox.id] = 1;
               if (checkbox.id === "visa"){ object.mastercard = 1; }
               bitval += 1 << i;
            }
         }
         return object;
      },
      set: function(bitval){
         var ocards = C("ocards");
         for(i = 0; i < ocards.length; i++){
            var checkbox = ocards[i];
            checkbox.checked = (bitval & (1 << i)) !== 0;
         }
      }
   },
   'features': {
      type: "bits",
      bits: function(){ return C("ofeatures").length; },
      get: function(action){
         // Get all selected features
         var object = {};
         var ofeatures = C("ofeatures");
         var bitval = 0;
         for(i = 0; i < ofeatures.length; i++){
            var checkbox = ofeatures[i];
            if ( checkbox.checked ){
                object[checkbox.id] = 1;
                bitval += 1 << i;
            }
         }
         //if (action === "url"){ return bitval; }
         return object;
      },
      set: function(bitval){
         var ofeatures = C("ofeatures");
         for(i = 0; i < ofeatures.length; i++){
             var checkbox = ofeatures[i];
             checkbox.checked = (bitval & (1 << i)) !== 0;
         }
      }
   },
   // Misc
   'acquirers': {
      type: "bits",
      bits: function(){
         var len = $("acquirer").length;
         var nbits = 0;
         while (len > 0){
            len = len >>> 1;
            nbits++;
         }
         return nbits;
      },
      get: function(action){
         // Return the selected acquirers
         var name = $("acquirer").value;
         //if (action === "url" ){ return $("acquirer").selectedIndex; }
         if (name === "auto"){ return null; }
         else {
            var obj = {};
            obj.nets = ACQs.nets;
            obj[name] = ACQs[name];
            return obj;
         }
      },
      set: function(bitval){
         if (bitval < $("acquirer").length){ $("acquirer").selectedIndex = bitval; }
      },
   },
   'transactions': {
      type: "string",
      dirty_bits: 1,
      get_dirty_bits: function(){ return +(this.get() !== parseInt($('transactions').defaultValue)); },
      get: function(action){ return getInt($('transactions'), action); },
      set: function(v){ setInt('transactions', v); }
   },
   'avgvalue': {
      type: "currency",
      dirty_bits: 1,
      get_dirty_bits: function(){
         return +(!this.get().is_equal_to(_getCurrency($('avgvalue').defaultValue))); },
      get: function(action){ return getCurrency('avgvalue', action); },
      set: function(v){ setCurrency('avgvalue', _getCurrency(v)); }
   },
   'currency': {
      type: "string",
      dirty_bits: 1,
      get_dirty_bits: function(){ return +(this.get() !== $('currency_code_select').options[0].value); },
      get: function(){ return gccode; },
      set: function(v){
         var select = $("currency_code_select");
         for (var i = 0; i < select.length; i++){
            if (select.options[i].value === v){
               select.selectedIndex = i;
               $('currency_code').innerHTML = v;
               break;
            }
         }
         set_ccode(v);
      }
   }
};

// Check if object-x' properties is in object-y.
function x_has_y(objx, objy){
   for (var prop in objy){
      if( !objx[prop] ){ return false; }
   }
   return true;
}

// To do: Settings skal forenes med opts()
var Settings = function (action){
   if (action === 'init'){ loadurl(); }

   for (var key in opts){
      if (key !== "dirty_bits"){ this[key] = opts[key].get(action); }
   }
};


function sum(){
   var sumobj = new Currency(0, 'DKK');
   for (var i = 0; i < arguments.length; i++) {
      // Combine costs
      for (var z in arguments[i]){
         sumobj = sumobj.add(arguments[i][z]);
      }
   }
   return sumobj;
}

// Find combination of acquirers that support all cards
function acqcombo(psp, settings){

   var i, acqs = [];
   for (i = 0; i < ACQs.length; i++){

      // Skip if PSP doesn't support acquirer
      if ( !psp.acquirers[ACQs[i].name] ) continue;

      // Return acq if it support all settings.cards.
      if ( x_has_y(ACQs[i].cards, settings.cards) ) return [i];
      acqs.push(i);
   }

   var len = acqs.length;
   for (i = 0; i < len; i++){

      var missingCards = {};
      for (var card in settings.cards ){ if(!ACQs[i].cards[card]) missingCards[card] = true; }

      // Find secondary acquirer with the missing cards.
      for (var j = 0; j < len; j++){
         if (j == i) continue;

         // Skip if it doesn't support missing cards.
         if (!x_has_y(ACQs[j].cards, missingCards)){ continue; }
         return [ acqs[i], acqs[j] ];
      }
      return null;
   }
}


// Build table
function build(action){
   var x,i,j,k,sort,acq,img,link,card;
   var t0 = performance.now();
   settings = new Settings(action);
   var data = [];
   var tbody = document.createElement("tbody");
   tbody.id = "tbody";

   var dankortscale = (settings.cards.dankort) ? 0.77 : 0;
   if (!settings.cards.visa){ dankortscale = 1; }

   // Calculate acquirer costs and sort by Total Costs.
   for (x in ACQs){
      acq = ACQs[x];
      var cardscale = (acq.name==="Nets") ? dankortscale : 1-dankortscale;
      acq.trnfees = acq.fees.trn(settings).scale(settings.transactions).scale(cardscale);
      acq.TC = acq.trnfees.add(acq.fees.monthly);
   }
   ACQs.sort(function(obj1, obj2){ return obj1.TC.dkk() - obj2.TC.dkk(); });

   psploop:
   for (x = 0, xlen = PSPs.length; x < xlen; x++){
      var psp = PSPs[x];
      var cardobj = psp.cards, acqArr = [], setup = {}, monthly = {}, trnfee = {};

      setup[psp.name] = psp.fees.setup;
      monthly[psp.name] = psp.fees.monthly;
      trnfee[psp.name] = psp.fees.trn(settings);

      // Check if psp support all enabled payment methods
      for (card in settings.cards) { if( !psp.cards[card] ){ continue psploop; } }

      // Check if psp support all enabled features
      for (i in settings.features) {
         if( !psp.features || !psp.features[i] ){ continue psploop; }
         var feature = psp.features[i];
         if (feature.setup){
            setup[i] = feature.setup;
            monthly[i] = feature.monthly;
            trnfee[i] = feature.trn;
         }
      }

      var acqfrag = document.createDocumentFragment();
      if( psp.acquirers ){
         acqArr = acqcombo(psp, settings); // Find acq with full card support
         if (!acqArr){ continue; } // If no acquirers support all cards
         cardobj = {};

         for (i in acqArr){
            acq = ACQs[ acqArr[i] ];

            setup[acq.name] = acq.fees.setup;
            monthly[acq.name] = acq.fees.monthly;
            trnfee[acq.name] = acq.trnfees;

            link = document.createElement('a');
            link.href = acq.link;
            link.className = "acq";
            img = new Image(acq.w, acq.h);
            img.src = "/img/psp/" + acq.logo;
            img.alt = acq.name;
            link.appendChild(img);
            acqfrag.appendChild(link);

            // Construct a new cardobj
            for (card in acq.cards){ cardobj[card] = acq.cards[card]; }
         }
      }

      var cardfrag = document.createDocumentFragment();
      for (card in cardobj){
         //  Some cards/methods (e.g. mobilepay) add extra costs.
         if ( cardobj[card].setup ){
            if ( !settings.cards[card] ){ continue; }  // Skip if not enabled.

            setup[card] = cardobj[card].setup;
            monthly[card] = cardobj[card].monthly;
            trnfee[card] = cardobj[card].trnfee;
         }

         var cardicon = new Image(22, 15);
         cardicon.src = "/img/cards/" + card + ".svg";
         cardicon.alt = card;
         cardicon.className = "card";
         cardfrag.appendChild(cardicon);
      }

      var total = sum(monthly, trnfee);

      // Save calc for tooltips
      psp.setup = setup;
      psp.monthly = monthly;
      psp.trnfee = trnfee;

      // Sort psp after total.dkk()
      for (sort = 0; sort < data.length; ++sort){
         if (total.dkk() < data[sort]){ break; }
      }
      data.splice(sort, 0, total.dkk());

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

      // Create cardfee calc.
      var cardfeefrag = document.createDocumentFragment();
      var p1 = document.createElement('p');
      var p2 = document.createElement('p');
      var cardfee = total.scale(1 / settings.transactions);
      p1.textContent = cardfee.print();
      p2.textContent = "("+ (cardfee.scale( 1/settings.avgvalue.dkk()).dkk()*100).toFixed(3).replace('.', ',') + "%)";
      p2.className = "procent";
      cardfeefrag.appendChild(p1);
      cardfeefrag.appendChild(p2);

      var row = tbody.insertRow(sort);
      row.insertCell(-1).appendChild(pspfrag);
      row.insertCell(-1).appendChild(acqfrag);
      row.insertCell(-1).appendChild(cardfrag);
      row.insertCell(-1).textContent = sum(setup).print();
      row.insertCell(-1).textContent = sum(monthly).print();
      row.insertCell(-1).textContent = total.print();
      row.insertCell(-1).appendChild(cardfeefrag);
   }
   table.replaceChild(tbody, $('tbody'));

   if (action !== "init"){ saveurl(); }

   var t1 = performance.now();
   console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
}


//===========================
//            URL
//===========================

var base64_chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/";

function Base64Array(initsize){
    this.bitpos = 0; // from 0 - 5
    this.array = [];
    this.pos = 0;
}

Base64Array.prototype.pushbit = function(bit){
    if (this.array.length === 0){this.array.push(0);}
    if (this.bitpos > 5){
        this.bitpos = 0;
        this.array.push(0);
    }
    this.array[this.array.length - 1] += bit << this.bitpos;
    this.bitpos++;
};

Base64Array.prototype.getbit = function(){
    if (this.bitpos > 5){
        this.bitpos = 0;
        this.pos++;
    }
    var bitval = (this.array[this.pos] & (1 << this.bitpos)) >>> this.bitpos;
    this.bitpos++;
    return bitval;
};

Base64Array.prototype.pushbits = function(bitval, nbits){
    for(var i = 0; i < nbits; i++){
        this.pushbit((bitval & (1 << i)) >>> i);
    }
};

Base64Array.prototype.encode = function(){
   var encstr = "";
   for (var i = 0; i < this.array.length; i++){
      encstr += base64_chars[this.array[i]];
   }
   return encstr;
};

Base64Array.prototype.pushbase64char = function(b64char){
    var index = base64_chars.indexOf(b64char);
    if (index < 0){
        //console.log("Unexpected query character " + b64char);
        return -1;
    }
    this.array.push(index);
    return 0;
};

Base64Array.prototype.getbits = function(nbits){
    var val = 0;
    for (var i = 0; i < nbits; i++){
        val += this.getbit() << i;
    }
    return val;
};


/* Save the url to the following structure URL = kortgebyr.dk?{BITS}{ARGUMENT STRING}*/
function saveurl(){
    var argstr = ""; // The optional arguments string which follows the base64 enc. bits
    var nbits; // the number of bits for the current option
    var optbits; // The bits for the current option
    var bitbuf = new Base64Array(); // The buffer used for containing bits until they are flushed
    var o;

    /* Loop through the options and construct the url */
    for (var key in opts){
        o = opts[key];

        /* Depending on whether dirty bits are used or not, react accordingly */
        if (o.dirty_bits){
            nbits = o.dirty_bits;
            optbits = o.get_dirty_bits("url");
            var ret = o.get();
            /* Create the argument string part if dirty bit is set */
            if (optbits){
                if (ret instanceof Currency){
                    argstr += ";" + ret.string();
                } else {
                    argstr += ";" + ret;
                }
            }

        } else if (o.bits){
            nbits = typeof(o.bits) === "function" ? o.bits() : o.bits;
            optbits = o.get("url");
        } else {
            //console.log("opt " + key + " neither has a bits field or a dirty_bits field");
            return;
        }
        bitbuf.pushbits(optbits, nbits);
    }


    history.replaceState({
       foo: "bar"
    }, "", "?" + bitbuf.encode() + argstr);
}

function loadurl(){
    var querystring = location.search.replace("?", "");
    if (!querystring){ return; }

    var encbits = ""; // The base64 encoded bits
    var args; // The optional arguments string which follows the base64 enc. bits
    var nbits; // the number of bits for the current option
    var bitval;
    var bitbuf = new Base64Array(); // The buffer used for containing bits until they are flushed
    var o;

    /* Check if any additional args after the bits and
       create the arg array if that is the case */
    var nb64chars = querystring.indexOf(";");
    if (nb64chars < 0){
        nb64chars = querystring.length;
    } else {
        args = querystring.slice(nb64chars + 1).split(";");
    }

    /* Load the base64 representation of the bits into a base64array type */
    for (var i = 0; i < nb64chars; i++){
        if (bitbuf.pushbase64char(querystring[i]) !== 0){
            //console.log("error parsing bits");
            return -1;
        }
    }

    /* Loop through the opts set the fields with values loaded from the url */
    for (var key in opts){
        o = opts[key];
        /* Check if opt has dirty bits, if so load arg */
        if (o.dirty_bits){
            nbits = o.dirty_bits;
            bitval = bitbuf.getbits(nbits);
            if (bitval > 0){
                o.set(args[0]);
                args.shift();
            }
        /* Otherwise just load the bits directly */
        } else if (o.bits){
            nbits = typeof(o.bits) === "function" ? o.bits() : o.bits;
            bitval = bitbuf.getbits(nbits);
            o.set(bitval);
        } else {
            //console.log("opt " + key + " neither has a bits field or a dirty_bits field");
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
