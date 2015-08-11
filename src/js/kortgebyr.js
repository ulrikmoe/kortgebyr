/**
 *   First shalt thou take out the Holy Pin. Then...
 *   @author Ulrik Moe, Christian Blach, Joakim Sindholt
 *   @license GPLv3
 *
 *   Indentation: 3 spaces
 *   Conventions: https://github.com/airbnb/javascript
 *
 *   1) Opdele i danske, svenske og norske priser.
 *   2) Vise alle betalingskort, inkl. (JCB, AMEX, UnionPay, Diners)
 *   3) Forbrugsforeningen
 *   4) American Express
 *   5) Swipp
 *   6) Apple Pay / Samsung Pay / Android Pay
 *   7) Forklaring
 *   8) Løsninger uden priser: Wirecard, Payex, Worldpay
 *   9) Authorize.net
 **/

var currency_value = {
   'DKK': 1,
   'SEK': 0.779,
   'NOK': 0.822,
   'EUR': 7.462,
   'USD': 6.750
};

var currency_map = {
   'DKK': 'kr',
   'SEK': 'kr',
   'NOK': 'kr',
   'EUR': '\u20AC',
   'USD': '\u0024'
};

var gccode = 'DKK';

function set_ccode(c) {
   if (currency_map.hasOwnProperty(c)) {
      gccode = c;
   }
}

function get_ccode() {
   return gccode;
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

function Options(n, avgvalue, antifraud, visasecure, recurring, multiacquirer, mobilepay) {
   this.n = n;
   this.avgvalue = avgvalue;
   this.antifraud = antifraud;
   this.visasecure = visasecure;
   this.recurring = recurring;
   this.multiacquirer = multiacquirer;
   this.mobilepay = mobilepay;
}

var cards = {
   "dankort": {
      name: "Dankort",
      logo: "dankort.svg"
   },
   "visa": {
      name: "Visa",
      logo: "visa.svg"
   },
   "mastercard": {
      name: "MasterCard",
      logo: "mastercard.svg"
   },
   "maestro": {
      name: "Maestro",
      logo: "maestro.svg"
   },
   "diners": {
      name: "Diners",
      logo: "diners.svg"
   },
   "amex": {
      name: "American Express",
      logo: "amex.svg"
   },
   "jcb": {
      name: "JCB",
      logo: "jcb.svg"
   },
   "unionpay": {
      name: "UnionPay",
      logo: "unionpay.svg"
   },
   "forbrugsforeningen": {
      name: "Forbrugsforeningen",
      logo: "forbrugsforeningen.svg"
   }
};

function acq_cost_default(o) {
   return {
      setup: this.fee_setup,
      monthly: this.fee_monthly,
      trans: o.avgvalue.scale(this.fee_variable / 100).add(this.fee_fixed).scale(o.n)
   };
}

var acqs = { // alfabetisk rækkefølge

   "teller": {
      name: "Teller",
      logo: "teller.png",
      link: "http://www.teller.com",
      cards: ["visa", "mastercard", "maestro", "amex", "jcb", "unionpay"],
      fee_setup: new Currency(1000, 'DKK'),
      fee_monthly: new Currency(149, 'DKK'),
      fee_fixed: new Currency(0, 'DKK'),
      fee_variable: 1.5,
      costfn: function(o) {
         var fee = this.fee_fixed.add(o.avgvalue.scale(this.fee_variable / 100));
         if (fee.dkk() < 0.7) {
            fee = new Currency(0.7, 'DKK');
         }
         return {
            setup: this.fee_setup,
            monthly: this.fee_monthly,
            trans: fee.scale(o.n)
         };
      }
   },
   "handelsbanken": {
      name: "Handelsbanken",
      logo: "handelsbanken.png",
      link: "http://www.handelsbanken.dk",
      cards: ["visa", "mastercard", "maestro"],
      fee_setup: new Currency(0, 'DKK'),
      fee_monthly: new Currency(0, 'DKK'),
      fee_fixed: new Currency(0, 'DKK'),
      fee_variable: 1.5,
      costfn: acq_cost_default
   },
   "nets": {
      name: "nets",
      logo: "nets.png",
      link: "http://www.nets.eu",
      cards: ["dankort"],
      fee_setup: new Currency(250, 'DKK'),
      fee_monthly: new Currency(1000 / 12, 'DKK'),
      costfn: function(o) {
         var fee = 1.39;
         if (o.avgvalue.dkk() <= 100) {
            fee = 1.1;
         }
         if (o.avgvalue.dkk() <= 50) {
            fee = 0.7;
         }

         return {
            setup: this.fee_setup,
            monthly: this.fee_monthly,
            trans: (new Currency(fee, 'DKK')).scale(o.n)
         };
      }
   },
   "nordea": {
      name: "Nordea",
      logo: "nordea.png",
      link: "http://www.nordea.dk",
      cards: ["visa", "mastercard", "maestro"],
      fee_setup: new Currency(0, 'DKK'),
      fee_monthly: new Currency(0, 'DKK'),
      fee_fixed: new Currency(0, 'DKK'),
      fee_variable: 1.6,
      costfn: acq_cost_default
   },
   "swedbank": {
      name: "Swedbank",
      logo: "swedbank.png",
      link: "http://www.swedbank.dk",
      cards: ["visa", "mastercard", "maestro"],
      fee_setup: new Currency(1900, 'DKK'),
      fee_monthly: new Currency(100, 'DKK'),
      fee_fixed: new Currency(0, 'DKK'),
      fee_variable: 1.6,
      costfn: acq_cost_default
   },
   "valitor": {
      name: "Valitor",
      logo: "valitor.png",
      link: "http://www.valitor.com",
      cards: ["visa", "mastercard", "maestro"],
      fee_setup: new Currency(0, 'DKK'),
      fee_monthly: new Currency(0, 'DKK'),
      fee_fixed: new Currency(0, 'DKK'),
      fee_variable: 1.5,
      costfn: acq_cost_default
   },
   "elavon": {
      name: "Elavon",
      logo: "elavon.png",
      link: "http://www.elavon.com",
      cards: ["visa", "mastercard", "maestro"],
      fee_setup: new Currency(0, 'DKK'),
      fee_monthly: new Currency(0, 'DKK'),
      fee_fixed: new Currency(0, 'DKK'),
      fee_variable: 1.6,
      costfn: acq_cost_default
   },
   "clearhaus": {
      name: "Clearhaus",
      logo: "clearhaus.svg",
      link: "https://www.clearhaus.com",
      cards: ["visa", "mastercard", "maestro"],
      fee_setup: new Currency(0, 'DKK'),
      fee_monthly: new Currency(0, 'DKK'),
      fee_fixed: new Currency(0, 'DKK'),
      fee_variable: 1.45,
      costfn: acq_cost_default
   }
};

var psps = { // alfabetisk rækkefølge

   "braintree": {
      name: "braintree",
      logo: "braintree.png",
      link: "https://www.braintreepayments.com",
      is_acquirer: true,
      acquirers: [],
      cards: ["visa", "mastercard", "maestro"],
      costfn: function(o) {
         if (o.multiacquirer || o.mobilepay) {
            return null;
         }
         return {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(0, 'DKK'),
            trans: o.avgvalue.scale(2.9 / 100).add(new Currency(2.25, 'DKK')).scale(o.n)
         };
      }
   },
   "certitrade": {
      name: "Certitrade",
      logo: "certitrade.png",
      link: "http://www.certitrade.net/kortbetalning.php",
      is_acquirer: false,
      acquirers: ["handelsbanken", "nordea", "euroline", "swedbank"],
      cards: ["visa", "mastercard", "maestro", "diners", "amex"],
      costfn: function(o) {
         if (o.antifraud || o.recurring || o.multiacquirer || o.mobilepay) {
            return null;
         }
         return {
            setup: new Currency(0, 'SEK'),
            monthly: new Currency(192, 'SEK'),
            trans: o.avgvalue.scale(0.9 / 100).add(new Currency(1.5, 'SEK')).scale(o.n)
         };
      }
   },
   "checkout": {
      name: "Checkout.com",
      logo: "checkout.png",
      link: "https://www.checkout.com",
      is_acquirer: true,
      acquirers: [],
      cards: ["visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay"],
      costfn: function(o) {
         if (o.multiacquirer || o.mobilepay) {
            return null;
         }
         return {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(0, 'DKK'),
            trans: o.avgvalue.scale(1.5 / 100).add(new Currency(0.15, 'EUR')).scale(o.n)
         };
      }
   },
   "dandomain": {
      name: "DanDomain",
      logo: "dandomain.png",
      link: "http://www.dandomain.dk/e-handel/betalingssystem/overblik",
      is_acquirer: false,
      acquirers: ["nets", "teller"],
      cards: ["dankort", "visa", "mastercard", "maestro", "forbrugsforeningen", "diners", "jcb", "amex", "unionpay"],
      costfn: function(o) {
         if (o.multiacquirer || o.mobilepay) {
            return null;
         }

         var s = 199;
         var m = 149;
         if (o.visasecure) {
            s += 99;
            m += 49;
         }

         if (o.recurring) {
            s += 299;
            if (o.n < 100) m += 99;
            else if (o.n < 1000) m += 149;
            else m += 399;
         }

         return {
            setup: new Currency(s, 'DKK'),
            monthly: new Currency(m, 'DKK'),
            trans: new Currency(0, 'DKK')
         };
      }
   },
   "dibsstart": {
      name: "DIBS Start",
      logo: "dibs.png",
      link: "http://dibs.dk",
      is_acquirer: false,
      acquirers: ["nets", "euroline", "teller", "swedbank", "valitor", "handelsbanken", "elavon"],
      cards: ["dankort"],
      costfn: function(o) {
         if (o.antifraud || o.recurring || o.visasecure || o.multiacquirer) {
            return null;
         }
         return {
            setup: new Currency(1495, 'DKK'),
            monthly: new Currency(149, 'DKK'),
            trans: (new Currency(0.6, 'DKK')).scale(o.n)
         };
      }
   },
   "dibsmedium": {
      name: "DIBS Medium",
      logo: "dibs.png",
      link: "http://dibs.dk",
      is_acquirer: false,
      acquirers: ["nets", "euroline", "teller", "swedbank", "valitor", "handelsbanken", "elavon"],
      cards: ["dankort", "visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay", "diners"],
      costfn: function(o) {
         if (o.antifraud || o.recurring || o.multiacquirer) {
            return null;
         }
         return {
            setup: new Currency(4995, 'DKK'),
            monthly: new Currency(499, 'DKK'),
            trans: (new Currency(0.55, 'DKK')).scale(o.n)
         };
      }
   },
   "dibspremium": {
      name: "DIBS Premium",
      logo: "dibs.png",
      link: "http://dibs.dk",
      is_acquirer: false,
      acquirers: ["nets", "euroline", "teller", "swedbank", "valitor", "handelsbanken", "elavon"],
      cards: ["dankort", "visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay", "forbrugsforeningen", "diners"],
      costfn: function(o) {
         return {
            setup: new Currency(10995, 'DKK'),
            monthly: new Currency(899, 'DKK'),
            trans: (new Currency(0.5, 'DKK')).scale(o.n)
         };
      }
   },
   "epaylight": {
      name: "ePay Light",
      logo: "epay.png",
      link: "http://epay.dk",
      is_acquirer: false,
      acquirers: ["nets"],
      cards: ["dankort", "forbrugsforeningen"],
      costfn: function(o) {
         if (o.recurring || o.multiacquirer) {
            return null;
         }

         var fee = 0.25;
         var antifraud = 0;
         if (o.antifraud) {
            antifraud = (new Currency(0.3, 'DKK')).scale(o.n);
         }

         return {
            setup: new Currency(399, 'DKK'),
            monthly: new Currency(99, 'DKK'),
            trans: (new Currency(fee, 'DKK')).scale(Math.max(o.n - 250, 0)).add(antifraud)
         };
      }
   },
   "epaypro": {
      name: "ePay Pro",
      logo: "epay.png",
      link: "http://epay.dk",
      is_acquirer: false,
      acquirers: ["nets", "teller"],
      cards: ["dankort", "visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay", "forbrugsforeningen"],
      costfn: function(o) {
         if (o.recurring || o.multiacquirer) {
            return null;
         }

         var fee = 0.25;
         var antifraud = 0;
         if (o.antifraud) {
            antifraud = (new Currency(0.3, 'DKK')).scale(o.n);
         }

         return {
            setup: new Currency(599, 'DKK'),
            monthly: new Currency(199, 'DKK'),
            trans: (new Currency(fee, 'DKK')).scale(Math.max(o.n - 250, 0)).add(antifraud)
         };
      }
   },
   "epaybusiness": {
      name: "ePay Business",
      logo: "epay.png",
      link: "http://epay.dk",
      is_acquirer: false,
      acquirers: ["nets", "euroline", "teller", "swedbank", "handelsbanken", "valitor", "elavon", "clearhaus"],
      cards: ["dankort", "visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay", "forbrugsforeningen"],
      costfn: function(o) {

         var fee = 0.25,
            antifraud = 0,
            recurring = 0;

         if (o.antifraud) {
            antifraud = (new Currency(0.3, 'DKK')).scale(o.n);
         }
         if (o.recurring) {
            recurring = (new Currency(1, 'DKK')).scale(o.n);
         }

         return {
            setup: new Currency(999, 'DKK').add(recurring),
            monthly: new Currency(299, 'DKK'),
            trans: (new Currency(fee, 'DKK')).scale(Math.max(o.n - 500, 0)).add(antifraud)
         };
      }
   },
   "netaxeptstart": {
      name: "Netaxept Start",
      logo: "nets.png",
      link: "https://www.terminalshop.dk/Netaxept/",
      is_acquirer: false,
      acquirers: ["nets", "teller"],
      cards: ["dankort", "visa", "mastercard"],
      costfn: function(o) {
         if (o.recurring || o.multiacquirer || o.mobilepay) {
            return null;
         }

         return {
            setup: new Currency(1005, 'DKK'),
            monthly: new Currency(180, 'DKK'),
            trans: (new Currency(1.5, 'DKK')).scale(o.n)
         };
      }
   },
   "netaxeptplus": {
      name: "Netaxept Plus",
      logo: "nets.png",
      link: "https://www.terminalshop.dk/Netaxept/",
      is_acquirer: false,
      acquirers: ["nets", "teller", "elavon", "euroline", "swedbank", "nordea"],
      cards: ["dankort", "visa", "mastercard", "diners", "jcb", "amex", "unionpay"],
      costfn: function(o) {
         if (o.recurring || o.multiacquirer || o.mobilepay) {
            return null;
         }

         return {
            setup: new Currency(3016, 'DKK'),
            monthly: new Currency(502, 'DKK'),
            trans: (new Currency(1, 'DKK')).scale(o.n)
         };
      }
   },
   "netaxeptadvanced": {
      name: "Netaxept Advanced",
      logo: "nets.png",
      link: "https://www.terminalshop.dk/Netaxept/",
      is_acquirer: false,
      acquirers: ["nets", "teller", "elavon", "euroline", "swedbank", "nordea"],
      cards: ["dankort", "visa", "mastercard", "diners", "jcb", "amex", "unionpay"],
      costfn: function(o) {
         if (o.multiacquirer) {
            return null;
         }

         var recurring = 0;
         if (o.recurring || o.multiacquirer) {
            recurring = (new Currency(250, 'DKK'));
         }

         return {
            setup: new Currency(7540, 'DKK'),
            monthly: new Currency(703, 'DKK').add(recurring),
            trans: (new Currency(0.7, 'DKK')).scale(o.n)
         };
      }
   },
   "payer": {
      name: "Payer.se",
      logo: "payer.png",
      link: "http://payer.se/betallosning/",
      is_acquirer: false,
      acquirers: ["handelsbanken", "euroline", "swedbank", "nordea"],
      cards: ["visa", "mastercard", "maestro", "diners", "amex"],
      costfn: function(o) {
         if (o.antifraud || o.recurring || o.multiacquirer || o.mobilepay) {
            return null;
         }

         return {
            setup: new Currency(1400, 'SEK'),
            monthly: new Currency(400, 'SEK'),
            trans: (new Currency(2, 'SEK')).scale(o.n)
         };
      }
   },
   "paymill": {
      name: "Paymill",
      logo: "paymill.png",
      link: "https://paymill.com",
      is_acquirer: true,
      acquirers: [],
      cards: ["visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay"],
      costfn: function(o) {

         if (o.antifraud || o.multiacquirer || o.mobilepay) {
            return null;
         }

         return {
            setup: new Currency(0, 'EUR'),
            monthly: new Currency(0, 'EUR'),
            trans: o.avgvalue.scale(2.95 / 100).add(new Currency(0.28, 'EUR')).scale(o.n)
         };
      }
   },
   "paypal": {
      name: "paypal",
      logo: "paypal.png",
      link: "https://paypal.com",
      is_acquirer: true,
      acquirers: [],
      cards: ["visa", "mastercard", "maestro", "diners", "jcb", "amex"],
      costfn: function(o) {
         if (o.antifraud || o.multiacquirer || o.mobilepay) {
            return null;
         }

         var oms = o.n * o.avgvalue.dkk();
         var fee = 1.9;
         if (oms <= 800000) {
            fee = 2.4;
         }
         if (oms <= 400000) {
            fee = 2.7;
         }
         if (oms <= 80000) {
            fee = 2.9;
         }
         if (oms <= 20000) {
            fee = 3.4;
         }

         return {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(0, 'DKK'),
            trans: o.avgvalue.scale(fee / 100).add(new Currency(2.6, 'DKK')).scale(o.n)
         };
      }
   },
   "payson": {
      name: "Payson",
      logo: "payson.png",
      link: "https://www.payson.se",
      is_acquirer: true,
      acquirers: [],
      cards: ["visa", "mastercard", "maestro"],
      costfn: function(o) {
         if (o.antifraud || o.recurring || o.multiacquirer || o.mobilepay) {
            return null;
         }

         return {
            setup: new Currency(0, 'SEK'),
            monthly: new Currency(0, 'SEK'),
            trans: o.avgvalue.scale(3 / 100).add(new Currency(3, 'SEK')).scale(o.n)
         };
      }
   },
   "payza": {
      // Hvad med Foreign exchange gebyr (2,5%)?
      // https://www.payza.com/support/payza-transaction-fees
      name: "Payza",
      logo: "payza.png",
      link: "https://payza.com",
      is_acquirer: true,
      acquirers: [],
      cards: ["visa", "mastercard", "maestro"],
      costfn: function(o) {
         if (o.antifraud || o.multiacquirer || o.mobilepay) {
            return null;
         }

         return {
            setup: new Currency(0, 'EUR'),
            monthly: new Currency(20, 'EUR'),
            trans: o.avgvalue.scale(2.5 / 100).add(new Currency(0.25, 'EUR')).scale(o.n)
         };
      }
   },
   "verifonebas": {
      name: "Verifone Bas",
      logo: "verifone.png",
      link: "http://www.verifone.se/sv/Sweden/Start/E-handel/",
      is_acquirer: false,
      acquirers: ["handelsbanken", "nordea", "euroline", "swedbank"],
      cards: ["visa", "mastercard", "diners", "jcb", "amex"],
      costfn: function(o) {
         if (o.recurring || o.multiacquirer || o.multiacquirer || o.mobilepay) {
            return null;
         }

         return {
            setup: new Currency(999, 'SEK'),
            monthly: new Currency(199, 'SEK'),
            trans: (new Currency(4, 'SEK')).scale(Math.max(o.n - 100, 0))
         };
      }
   },
   "verifonepremium": {
      name: "Verifone Premium",
      logo: "verifone.png",
      link: "http://www.verifone.se/sv/Sweden/Start/E-handel/",
      is_acquirer: false,
      acquirers: ["handelsbanken", "nordea", "euroline", "swedbank"],
      cards: ["visa", "mastercard", "diners", "jcb", "amex"],
      costfn: function(o) {
         if (o.recurring || o.multiacquirer || o.mobilepay) {
            return null;
         }

         return {
            setup: new Currency(2499, 'SEK'),
            monthly: new Currency(499, 'SEK'),
            trans: (new Currency(2.5, 'SEK')).scale(Math.max(o.n - 400, 0))
         };
      }
   },
   "verifonepremiumplus": {
      name: "Verifone PremiumPlus",
      logo: "verifone.png",
      link: "http://www.verifone.se/sv/Sweden/Start/E-handel/",
      is_acquirer: false,
      acquirers: ["nets", "handelsbanken", "nordea", "euroline", "swedbank"],
      cards: ["dankort", "visa", "mastercard", "diners", "amex", "jcb"],
      costfn: function(o) {
         if (o.recurring || o.multiacquirer || o.mobilepay) {
            return null;
         }
         return {
            setup: new Currency(4999, 'SEK'),
            monthly: new Currency(1999, 'SEK'),
            trans: (new Currency(0.75, 'SEK')).scale(Math.max(o.n - 4000, 0))
         };
      }
   },

   "stripe": {
      name: "Stripe",
      logo: "stripe.png",
      link: "https://stripe.com",
      is_acquirer: true,
      acquirers: [],
      cards: ["visa", "mastercard", "maestro", "amex"],
      costfn: function(o) {
         if (o.multiacquirer || o.mobilepay) {
            return null;
         }
         return {
            setup: new Currency(0, 'USD'),
            monthly: new Currency(0, 'USD'),
            trans: o.avgvalue.scale(1.7 / 100).add(new Currency(1.8, 'DKK')).scale(o.n)
         };
      }
   },

   "quickpaystandard": {
      name: "QuickPay Standard",
      logo: "quickpay.png",
      link: "https://quickpay.net",
      is_acquirer: false,
      acquirers: ["nets", "teller", "clearhaus"],
      cards: ["dankort", "visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay", "forbrugsforeningen"],
      costfn: function(o) {
         return {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(49, 'DKK'),
            trans: (new Currency(1, 'DKK')).scale(o.n)
         };
      }
   },
   "quickpaypro": {
      name: "QuickPay Professional",
      logo: "quickpay.png",
      link: "https://quickpay.net",
      is_acquirer: false,
      acquirers: ["nets", "teller", "clearhaus"],
      cards: ["dankort", "visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay", "forbrugsforeningen"],
      costfn: function(o) {

         var fee = 0.25;
         return {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(149, 'DKK'),
            trans: (new Currency(fee, 'DKK')).scale(Math.max(o.n - 250, 0))
         };
      }
   },

   "scannet": {
      name: "Scannet",
      logo: "scannet.png",
      link: "http://www.scannet.dk/hosting/betalingsloesning/",
      is_acquirer: false,
      acquirers: ["nets", "teller"],
      cards: ["dankort", "visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay"],
      costfn: function(o) {
         if (o.antifraud || o.recurring || o.visasecure || o.multiacquirer || o.mobilepay) {
            return null;
         }

         return {
            setup: new Currency(950, 'DKK'),
            monthly: new Currency(399, 'DKK'),
            trans: new Currency(0, 'DKK')
         };
      }
   },
   "skrill": {
      name: "Skrill",
      logo: "skrill.png",
      link: "https://skrill.com",
      is_acquirer: true,
      acquirers: [],
      cards: ["visa", "mastercard", "maestro", "diners", "jcb", "amex"],
      costfn: function(o) {
         if (o.antifraud || o.multiacquirer || o.mobilepay) {
            return null;
         }

         var oms = o.n * o.avgvalue.dkk();
         var fee = 2.9;

         return {
            setup: new Currency(0, 'EUR'),
            monthly: new Currency(21.75, 'EUR'),
            trans: o.avgvalue.scale(fee / 100).add(new Currency(0.25, 'EUR')).scale(o.n)
         };
      }
   },
   "wannafind": {
      name: "Wannafind",
      logo: "wannafind.png",
      link: "https://www.wannafind.dk/betalingsgateway/",
      is_acquirer: false,
      acquirers: ["nets", "teller"],
      cards: ["dankort", "visa", "mastercard", "maestro", "forbrugsforeningen", "diners", "jcb", "amex", "unionpay"],
      costfn: function(o) {
         if (o.multiacquirer || o.mobilepay) {
            return null;
         }

         var recurring = 0,
            visasecure = 0;

         if (o.visasecure) {
            visasecure = (new Currency(49, 'DKK'));
         }
         if (o.recurring) {
            recurring = (new Currency(99, 'DKK'));
         }

         return {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(149, 'DKK').add(recurring).add(visasecure),
            trans: new Currency(0, 'DKK')
         };
      }
   },
   "yourpay": {
      name: "yourpay",
      logo: "yourpay.png",
      link: "http://yourpay.dk",
      is_acquirer: true,
      acquirers: [],
      cards: ["visa", "mastercard", "maestro"],
      costfn: function(o) {
         if (o.antifraud || o.multiacquirer || o.recurring || o.mobilepay) {
            return null;
         }

         var fee = 2.25;

         return {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(0, 'DKK'),
            trans: o.avgvalue.scale(fee / 100).scale(Math.max(o.n, 0))
         };
      }
   },
   "klarnacheckout": {
      name: "klarna checkout",
      logo: "klarna.png",
      link: "https://klarna.se",
      is_acquirer: true,
      acquirers: [],
      cards: ["visa", "mastercard", "maestro"],
      costfn: function(o) {
         if (o.multiacquirer || o.mobilepay) {
            return null;
         }

         var fee = 2.95;

         return {
            setup: new Currency(3995, 'SEK'),
            monthly: new Currency(599, 'SEK'),
            trans: o.avgvalue.scale(fee / 100).scale(o.n)
         };
      }
   },
   "2checkout": {
      name: "2checkout",
      logo: "2checkout.png",
      link: "https://www.2checkout.com",
      is_acquirer: true,
      acquirers: [],
      cards: ["visa", "mastercard", "maestro", "amex", "jcb", "diners"],
      costfn: function(o) {
         if (o.multiacquirer || o.mobilepay) {
            return null;
         }

         var fee = 2.4;

         return {
            setup: new Currency(0, 'USD'),
            monthly: new Currency(0, 'USD'),
            trans: o.avgvalue.scale(fee / 100).add(new Currency(0.30, 'USD')).scale(o.n)
         };
      }
   },

   "paylike": {
      name: "Paylike",
      logo: "paylike.png",
      link: "https://paylike.io",
      is_acquirer: true,
      acquirers: [],
      cards: ["visa", "mastercard", "maestro"],
      costfn: function(o) {
         if (o.multiacquirer || o.mobilepay) {
            return null;
         }

         return {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(0, 'DKK'),
            trans: o.avgvalue.scale(2.75 / 100).add(new Currency(0.25, 'EUR')).scale(o.n)
         };
      }
   }
};



/*----------------------------------------------------------------------
   Functions
-----------------------------------------------------------------------*/


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
var default_transactions = 500;
var default_amount = 450;
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
   'acquirer': {
      type: "bits",
      bits: 4,
      get: function(a) {
         if (a === "url") {
            return parseInt($("acquirer")[$("acquirer").selectedIndex].value);
         }
         return getOption('acquirer', 'acq_');
      },
      set: function(v) {
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
      get: function() {
         return +getBool('visasecure');
      },
      set: function(v) {
         setBool('visasecure', v);
      },
      def: true
   },
   'fraud_fighter': {
      type: "bits",
      bits: 1,
      get: function() {
         return +getBool('fraud_fighter');
      },
      set: function(v) {
         setBool('fraud_fighter', v);
      },
      def: false
   },
   'recurring': {
      type: "bits",
      bits: 1,
      get: function() {
         return +getBool('recurring');
      },
      set: function(v) {
         setBool('recurring', v);
      },
      def: false
   },
   'multiacquirer': {
      type: "bits",
      bits: 1,
      get: function() {
         return +getBool('multiacquirer');
      },
      set: function(v) {
         setBool('multiacquirer', v);
      },
      def: false
   },
   'dankort': {
      type: "bits",
      bits: 1,
      get: function() {
         return +getBool('dankort');
      },
      set: function(v) {
         setBool('dankort', v);
      },
      def: true
   },
   'visa_mastercard': {
      type: "bits",
      bits: 1,
      get: function() {
         return +getBool('visa_mastercard');
      },
      set: function(v) {
         setBool('visa_mastercard', v);
      },
      def: true
   },
   'forbrugsforeningen': {
      type: "bits",
      bits: 1,
      get: function() {
         return +getBool('forbrugsforeningen');
      },
      set: function(v) {
         setBool('forbrugsforeningen', v);
      },
      def: false
   },
   'diners': {
      type: "bits",
      bits: 1,
      get: function() {
         return +getBool('diners');
      },
      set: function(v) {
         setBool('diners', v);
      },
      def: false
   },
   'amex': {
      type: "bits",
      bits: 1,
      get: function() {
         return +getBool('amex');
      },
      set: function(v) {
         setBool('amex', v);
      },
      def: false
   },
   'jcb': {
      type: "bits",
      bits: 1,
      get: function() {
         return +getBool('jcb');
      },
      set: function(v) {
         setBool('jcb', v);
      },
      def: false
   },
   'unionpay': {
      type: "bits",
      bits: 1,
      get: function() {
         return +getBool('unionpay');
      },
      set: function(v) {
         setBool('unionpay', v);
      },
      def: false
   },
   'mobilepay': {
      type: "bits",
      bits: 1,
      get: function() {
         return +getBool('mobilepay');
      },
      set: function(v) {
         setBool('mobilepay', v);
      },
      def: false
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
      set: function(i) {

      },
      def: ""
   },
   'currency': {
      type: "string",
      dirty_bits: 1,
      get_dirty_bits: function() {
         return +(this.get() !== this.def);
      },
      get: function() {
         return get_ccode();
      },
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
   'transactions': {
      type: "string",
      dirty_bits: 1,
      get_dirty_bits: function() {
         return +(this.get() !== this.def);
      },
      get: function() {
         return getInt('transactions');
      },
      set: function(v) {
         setInt('transactions', v);
      },
      def: default_transactions
   },
   'average_value': {
      type: "currency",
      dirty_bits: 1,
      get_dirty_bits: function() {
         return +!this.get().is_equal_to(this.def);
      },
      get: function() {
         return getCurrency('average_value');
      },
      set: function(v) {
         setCurrency('average_value', v);
      },
      def: new Currency(default_amount, default_currency)
   },
   'acquirer_opts': {
      type: "string",
      dirty_bits: undefined, // sættes af init_acqs()
      get_dirty_bits: function() {
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
      get: function() {
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
      set: function(v, bits) {
         var i = 0,
            array_position = 0;
         var value_array = v.split(",");

         for (var k in acqs) {
            if (acqs.hasOwnProperty(k) && k !== "nets") {
               if (get_bit_range(bits, i, i, this.dirty_bits)) {
                  acqs[k].fee_fixed = _getCurrency(value_array[array_position]);
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
      get: function() {
         return false;
      },
      set: function(v) {},
      def: false
   },
   'bitcoin': {
      inactive: true,
      type: "bits",
      bits: 1,
      get: function() {
         return false;
      },
      set: function(v) {},
      def: false
   },
   'setup_loss': {
      inactive: true,
      type: "bits",
      bits: 1,
      get: function() {
         return 0.16;
      },
      set: function(v) {},
      def: 0.16
   }
};


/*
Acquirer options panel.
*/
var sopts = {
   'acquirer_fixed': {
      get: function() {
         return getCurrency('acquirer_fixed');
      },
      set: function(v) {
         setCurrency('acquirer_fixed', v);
      },
      def: function() {
         return acqs[opts.acquirer.get()].fee_fixed;
      }
   },
   'acquirer_variable': {
      get: function() {
         return getPercent('acquirer_variable');
      },
      set: function(v) {
         setPercent('acquirer_variable', v);
      },
      def: function() {
         return acqs[opts.acquirer.get()].fee_variable;
      }
   },
   'acquirer_setup': {
      get: function() {
         return getCurrency('acquirer_setup');
      },
      set: function(v) {
         setCurrency('acquirer_setup', v);
      },
      def: function() {
         return acqs[opts.acquirer.get()].fee_setup;
      }
   },
   'acquirer_monthly': {
      get: function() {
         return getCurrency('acquirer_monthly');
      },
      set: function(v) {
         setCurrency('acquirer_monthly', v);
      },
      def: function() {
         return acqs[opts.acquirer.get()].fee_monthly;
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
      updateCommitDate();
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

   var acq = newstate.acquirer;
   if (newstate.acquirer != prevstate.acquirer) {

      setAcquirerPanel();

   } else if (acq != "auto") {

      // Denne skal gerne slås sammen med setAcquirerPanel();
      acqs[acq].fee_fixed = newstate.acquirer_fixed;
      acqs[acq].fee_variable = newstate.acquirer_variable;
      acqs[acq].fee_monthly = newstate.acquirer_monthly;
      acqs[acq].fee_setup = newstate.acquirer_setup;
   }

   var o = new Options(newstate.transactions, newstate.average_value,
      newstate.fraud_fighter, newstate.visasecure, newstate.recurring, newstate.multiacquirer, newstate.mobilepay);

   var table = $('data');
   table.innerHTML = "";
   var rows = [];
   var dkpoffset = 0;

   var info_icon = '<p class="tooltip"><img src="/assets/img/tooltip.gif"><span>';
   var info_icon_end = '</span></p>';

   for (k in psps) {
      var use_dankort = newstate.dankort;
      var use_visamc = newstate.visa_mastercard;
      var forbrugsforeningen = newstate.forbrugsforeningen;
      var diners = newstate.diners;
      var amex = newstate.amex;
      var jcb = newstate.jcb;
      var unionpay = newstate.unionpay;
      var mobilepay = newstate.mobilepay;
      var paii = newstate.paii;

      var dankort_penalty = false;
      if (use_dankort) {
         if (psps[k].cards.indexOf('dankort') < 0 || (psps[k].acquirers.indexOf('nets') < 0 && !psps[k].is_acquirer)) {
            continue;
         }
      }

      if (forbrugsforeningen && psps[k].cards.indexOf('forbrugsforeningen') < 0) {
         continue;
      }
      if (diners && psps[k].cards.indexOf('diners') < 0) {
         continue;
      }
      if (amex && psps[k].cards.indexOf('amex') < 0) {
         continue;
      }
      if (jcb && psps[k].cards.indexOf('jcb') < 0) {
         continue;
      }

      if (unionpay && psps[k].cards.indexOf('unionpay') < 0) {
          continue;
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

      var visamc_scale = 0.20;
      var dankort_scale = 0.80;
      if (!use_dankort) {
         visamc_scale = 1;
         dankort_scale = 0;
      }
      if (!use_visamc) {
         visamc_scale = 0;
         dankort_scale = 1;
         //tmpo.visasecure = false;
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
            if (price_total(best, visamc_scale, newstate.setup_loss).dkk() >
               price_total(cmp, visamc_scale, newstate.setup_loss).dkk()) {
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
      i_totalmonth[psps[k].name] = price_total(c_psp, psps[k].is_acquirer ? visamc_scale : 1, newstate.setup_loss);

      if (use_dankort && psps[k].acquirers.indexOf("nets") >= 0) {
         var c_nets = acqs.nets.costfn(tmpo);
         var netsname = 'nets (' + dankort_scale * 100 + '% tr.)';

         i_setup.nets = c_nets.setup;
         i_fixedmonth.nets = c_nets.monthly;
         i_totalmonth[netsname] = price_total(c_nets, dankort_scale, newstate.setup_loss);
         n_acqs.push('nets');
         n_cards.push('dankort');
      }

      if (!psps[k].is_acquirer && use_visamc) {
         var c_acq = acqs[tmpacq].costfn(tmpo);
         var acqname = acqs[tmpacq].name + ' (' + visamc_scale * 100 + '% tr.)';

         i_setup[acqs[tmpacq].name] = c_acq.setup;
         i_fixedmonth[acqs[tmpacq].name] = c_acq.monthly;
         i_totalmonth[acqname] = price_total(c_acq, visamc_scale, newstate.setup_loss);

         n_cards = n_cards.concat(intersect(psps[k].cards, acqs[tmpacq].cards));
         n_acqs.push(tmpacq);
      } else if (use_visamc) {
         n_cards = n_cards.concat(psps[k].cards);
      }

      // === Note that percentage of transactions that are done with Mobilepay
      // === is unknown. Thus only the monthly fee has been added.
      if (mobilepay) {
         i_fixedmonth.MobilePay = new Currency(49, 'DKK');
         i_totalmonth.MobilePay = new Currency(49, 'DKK');
      }

      var l;
      for (l in i_totalmonth) {
         i_trans[l] = i_totalmonth[l].scale(1 / newstate.transactions);
      }

      var s_setup = [];
      var t_setup = new Currency(0, 'DKK');
      var s_fixedmonth = [];
      var t_fixedmonth = new Currency(0, 'DKK');
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
         t_fixedmonth = t_fixedmonth.add(i_fixedmonth[l]);
      }
      for (l in i_totalmonth) {
         s_totalmonth.push(l + ': ' + i_totalmonth[l].print());
         t_totalmonth = t_totalmonth.add(i_totalmonth[l]);
      }
      for (l in i_trans) {
         s_trans.push(l + ': ' + i_trans[l].print());
         t_trans = t_trans.add(i_trans[l]);
      }

      var logo, name;

      var h_cards = "";
      for (l in n_cards) {
         logo = cards[n_cards[l]].logo;
         name = cards[n_cards[l]].name;
         h_cards += '<img class="cards" src="/assets/img/cards/' + logo + '" alt="' + name +
            '" title="' + name + '" />';
      }

      var h_acqs = [];
      for (l in n_acqs) {
         logo = acqs[n_acqs[l]].logo;
         name = acqs[n_acqs[l]].name;
         link = acqs[n_acqs[l]].link;
         h_acqs.push('<a target="_blank" href="' + link + '"><img src="/assets/img/acquirer/' + logo + '" alt="' + name +
            '" title="' + name + '" /></a>');
      }
      h_acqs = h_acqs.join("");

      // Safari har en bug hvor empty cells ikke bliver vist, selv
      // med [empty-cells: show;]. Derfor indsætter vi et nb-space.
      if (h_acqs.length === 0) {
         h_acqs = "&nbsp;";
      }

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

      logo_cell.innerHTML = '<a target="_blank" href=' + psps[k].link + '><img src="/assets/img/psp/' + psps[k].logo + '" alt="' + psps[k].name +
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

Object.size = function(obj) {
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

      sopts.acquirer_fixed.set(acqs[selected_acquirer].fee_fixed);
      sopts.acquirer_variable.set(acqs[selected_acquirer].fee_variable);
      sopts.acquirer_setup.set(acqs[selected_acquirer].fee_setup);
      sopts.acquirer_monthly.set(acqs[selected_acquirer].fee_monthly);

      // return getCurrency('acquirer_fixed');
   } else {
      C('acquirer_description')[0].style.display = 'block';
      C('acquirer_options')[0].style.display = 'none';
   }
}

function fmtDate(d) { // force 2 digits
   var months = ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august",
      "september", "oktober", "november", "december"
   ];
   return d.getDate() + ". " + months[d.getMonth()] + " " + d.getFullYear();

}

function updateCommitDate() {
   var linkurl = "https://github.com/ulrikmoe/kortgebyr";
   var apiurl = "https://api.github.com/repos/ulrikmoe/kortgebyr/commits/master";
   var req = new XMLHttpRequest();
   req.onreadystatechange = function() {
      if (req.readyState === 4 && req.status == 200) {
         var obj = JSON.parse(req.responseText);
         if (!obj  || !obj.commit || !obj.commit.committer ||
            !obj.commit.committer.date) return;
         var d = new Date(Date.parse(obj.commit.committer.date));
         document.getElementsByClassName("lastUpdate")[0].innerHTML =
            "<a href='" + linkurl + "/commits/master'>Opdateret d. " + fmtDate(d) + "</a>";

      }
   };
   req.open("GET", apiurl, true);
   req.send();
}

build('init');
