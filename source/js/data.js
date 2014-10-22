// Valutakurser opdateret d. 08/10/2014
var currency_value = {
  'DKK': 1,
  'SEK': 0.821,
  'NOK': 0.912,
  'EUR': 7.444,
  'USD': 5.904
};

var currency_map = {
  'DKK': 'kr',
  'SEK': 'kr',
  'NOK': 'kr',
  'EUR': '\u20AC',
  'USD': '$'
};

var gccode = 'DKK';

function set_ccode(c) {
    if (currency_map.hasOwnProperty(c)) { gccode = c; }
}

function get_ccode(){
    return gccode;
}

function Currency(amt, code) {
  this.amounts = {};
  this.amounts[code] = amt;
}

Currency.prototype.type = "currency";

Currency.prototype.print = function () {
  var number = Math.round((this.dkk() * 100) / currency_value[gccode]) / 100;
  var parts = number.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  if (parts.length == 2 && parts[1].length == 1) {
    parts[1] += "0";
  }
  return parts.join(",") + " " + currency_map[gccode];
};

Currency.prototype.represent = function () {
  return this.dkk() / currency_value[gccode] + ' ' + currency_map[gccode];
};

Currency.prototype.dkk = function () {
  var sum = 0;
  for (var code in this.amounts) {
    if (this.amounts.hasOwnProperty(code) &&
      currency_value.hasOwnProperty(code)) {
      sum += currency_value[code] * this.amounts[code];
    }
  }
  return sum;
};

Currency.prototype.add = function (rhs) {
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

Currency.prototype.is_equal_to = function (other_currency_object) {
  for (var code in this.amounts) {
    if (this.amounts.hasOwnProperty(code)) {
      if (this.amounts[code] !== other_currency_object.amounts[code]) {
        return false;
      }
    }
  }
  return true;
};

Currency.prototype.scale = function (rhs) {
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
    logo: "dankort.png"
  },
  "visa": {
    name: "Visa",
    logo: "visa.png"
  },
  "mastercard": {
    name: "MasterCard",
    logo: "master.png"
  },
  "maestro": {
    name: "Maestro",
    logo: "maestro.png"
  },
  "diners": {
    name: "Diners",
    logo: "diners.png"
  },
  "amex": {
    name: "American Express",
    logo: "amex.png"
  },
  "jcb": {
    name: "JCB",
    logo: "jcb.png"
  },
  "unionpay": {
    name: "UnionPay",
    logo: "unionpay.png"
  },
  "forbrugsforeningen": {
    name: "Forbrugsforeningen",
    logo: "forbrugsforeningen.png"
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
    cards: ["visa", "mastercard", "maestro"],
    fee_setup: new Currency(1000, 'DKK'),
    fee_monthly: new Currency(149, 'DKK'),
    fee_fixed: new Currency(0, 'DKK'),
    fee_variable: 1.5,
    costfn: function (o) {
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
    cards: ["dankort"],
    fee_setup: new Currency(250, 'DKK'),
    fee_monthly: new Currency(1000 / 12, 'DKK'),
    costfn: function (o) {
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
    cards: ["visa", "mastercard", "maestro"],
    fee_setup: new Currency(0, 'DKK'),
    fee_monthly: new Currency(0, 'DKK'),
    fee_fixed: new Currency(0, 'DKK'),
    fee_variable: 1.6,
    costfn: acq_cost_default
  },
  "clearhaus": {
    name: "Clearhaus",
    logo: "clearhaus.png",
    cards: ["visa", "mastercard", "maestro"],
    fee_setup: new Currency(0, 'DKK'),
    fee_monthly: new Currency(0, 'DKK'),
    fee_fixed: new Currency(0, 'DKK'),
    fee_variable: 1.5,
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
    costfn: function (o) {
      if (o.multiacquirer || o.mobilepay) { return null; }
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
    cards: ["visa", "mastercard", "maestro"],
    costfn: function (o) {
      if (o.antifraud || o.recurring || o.multiacquirer || o.mobilepay) { return null; }
      return {
        setup: new Currency(0, 'SEK'),
        monthly: new Currency(192, 'SEK'),
        trans: o.avgvalue.scale(0.9 / 100).add(new Currency(1.5, 'SEK')).scale(o.n)
      };
    }
  },
  "dandomain": {
    name: "DanDomain",
    logo: "dandomain.png",
    link: "http://dandomain.dk/produkter/betalingssystem.html",
    is_acquirer: false,
    acquirers: ["nets", "teller"],
    cards: ["dankort", "visa", "mastercard", "maestro"],
    costfn: function (o) {
      if (o.multiacquirer || o.mobilepay) { return null; }

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
  "dibsstartup": {
    name: "DIBS Startup",
    logo: "dibs.png",
    link: "http://dibs.dk",
    is_acquirer: false,
    acquirers: ["nets", "euroline", "teller", "swedbank", "valitor", "handelsbanken", "elavon"],
    cards: ["dankort", "visa", "mastercard", "maestro"],
    costfn: function (o) {
      if (o.antifraud || o.recurring || o.visasecure || o.multiacquirer || o.mobilepay) {
        return null;
      }
      return {
        setup: new Currency(1495, 'DKK'),
        monthly: new Currency(195, 'DKK'),
        trans: (new Currency(1.5, 'DKK')).scale(o.n)
      };
    }
  },
  "dibspro": {
    name: "DIBS Professional",
    logo: "dibs.png",
    link: "http://dibs.dk",
    is_acquirer: false,
    acquirers: ["nets", "euroline", "teller", "swedbank", "valitor", "handelsbanken", "elavon"],
    cards: ["dankort", "visa", "mastercard", "maestro", "diners", "amex"],
    costfn: function (o) {
      if (o.antifraud || o.recurring || o.multiacquirer || o.mobilepay) {
        return null;
      }
      return {
        setup: new Currency(2000, 'DKK'),
        monthly: new Currency(395, 'DKK'),
        trans: (new Currency(1.5, 'DKK')).scale(o.n)
      };
    }
  },
  "dibsint": {
    name: "DIBS International",
    logo: "dibs.png",
    link: "http://dibs.dk",
    is_acquirer: false,
    acquirers: ["nets", "euroline", "teller", "swedbank", "valitor", "handelsbanken", "elavon"],
    cards: ["dankort", "visa", "mastercard", "maestro", "diners", "amex"],
    costfn: function (o) {
      return {
        setup: new Currency(5000, 'DKK'),
        monthly: new Currency(795, 'DKK'),
        trans: (new Currency(1, 'DKK')).scale(o.n)
      };
    }
  },
  "epaylight": {
    name: "ePay Light",
    logo: "epay.png",
    link: "http://epay.dk",
    is_acquirer: false,
    acquirers: ["nets"],
    cards: ["dankort"],
    costfn: function (o) {
      if ( o.recurring || o.visasecure || o.multiacquirer) {
        return null;
      }

      var fee = 0.25;
      var antifraud = 0;
      if (o.antifraud) { antifraud = (new Currency(0.3, 'DKK')).scale(o.n); }

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
    cards: ["dankort", "visa", "mastercard", "maestro"],
    costfn: function (o) {
      if (o.recurring || o.multiacquirer) {return null;}

      var fee = 0.25;
      var antifraud = 0;
      if (o.antifraud) { antifraud = (new Currency(0.3, 'DKK')).scale(o.n); }

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
    acquirers: ["nets", "euroline", "teller", "swedbank", "handelsbanken", "valitor"],
    cards: ["dankort", "visa", "mastercard", "maestro"],
    costfn: function (o) {

      var fee = 0.25, antifraud = 0, recurring = 0;

      if (o.antifraud) { antifraud = (new Currency(0.3, 'DKK')).scale(o.n); }
      if (o.recurring) { recurring = (new Currency(1, 'DKK')).scale(o.n); }

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
    costfn: function (o) {
      if ( o.recurring || o.multiacquirer || o.mobilepay ) {
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
    cards: ["dankort", "visa", "mastercard"],
    costfn: function (o) {
      if ( o.recurring || o.multiacquirer || o.mobilepay) {
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
    cards: ["dankort", "visa", "mastercard"],
    costfn: function (o) {
      if (o.multiacquirer) { return null; }

      var recurring = 0;
      if (o.recurring || o.multiacquirer) { recurring = (new Currency(250, 'DKK')); }

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
    cards: ["visa", "mastercard", "maestro"],
    costfn: function (o) {
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
    cards: ["visa", "mastercard", "maestro"],
    costfn: function (o) {

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
    cards: ["visa", "mastercard", "maestro"],
    costfn: function (o) {
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
    costfn: function (o) {
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
    costfn: function (o) {
      if (o.antifraud || o.multiacquirer || o.mobilepay) {
        return null;
      }

      return {
        setup: new Currency(0, 'DKK'),
        monthly: new Currency(0, 'DKK'),
        trans: o.avgvalue.scale(2.5 / 100).add(new Currency(1.9, 'DKK')).scale(o.n)
      };
    }
  },
  "pointbas": {
    name: "Point Bas",
    logo: "point.png",
    link: "http://www.point.se/sv/Sweden/Start/E-handel/",
    is_acquirer: false,
    acquirers: ["handelsbanken", "nordea", "euroline", "swedbank"],
    cards: ["visa", "mastercard", "diners", "amex"],
    costfn: function (o) {
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
  "pointpremium": {
    name: "Point Premium",
    logo: "point.png",
    link: "http://www.point.se/sv/Sweden/Start/E-handel/",
    is_acquirer: false,
    acquirers: ["handelsbanken", "nordea", "euroline", "swedbank"],
    cards: ["visa", "mastercard", "diners", "amex"],
    costfn: function (o) {
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
  "pointpremiumplus": {
    name: "Point PremiumPlus",
    logo: "point.png",
    link: "http://www.point.se/sv/Sweden/Start/E-handel/",
    is_acquirer: false,
    acquirers: ["nets", "handelsbanken", "nordea", "euroline", "swedbank"],
    cards: ["dankort", "visa", "mastercard", "diners", "amex", "jcb"],
    costfn: function (o) {
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
    cards: ["visa", "mastercard", "maestro"],
    costfn: function (o) {
      if (o.multiacquirer || o.mobilepay) { return null; }

      return {
        setup: new Currency(0, 'USD'),
        monthly: new Currency(0, 'USD'),
        trans: o.avgvalue.scale(2.9 / 100).add(new Currency(0.30, 'USD')).scale(o.n)
      };
    }
  },

  "quickpay": {
    name: "quickpay",
    logo: "quickpay.png",
    link: "http://quickpay.dk",
    is_acquirer: false,
    acquirers: ["nets", "euroline", "teller", "swedbank", "Elavon", "handelsbanken"],
    cards: ["dankort", "visa", "mastercard", "maestro"],
    costfn: function (o) {

      if (o.multiacquirer) { return null; }

      var limits = [0, 500, 600, 1000, 3000, 10000, 30000];
      var fees = [0, 0.5, 0.4, 0.3, 0.25, 0.15, 0.1];
      var price = 0;
      var accum = 0;
      for (var i = 0; i < limits.length; i++) {
        var delta;
        if (i < limits.length - 1) {
          delta = Math.min(limits[i + 1] - limits[i], o.n - accum);
        } else {
          delta = o.n - accum;
        }
        price += delta * fees[i];
        accum += delta;
      }
      return {
        setup: new Currency(0, 'DKK'),
        monthly: new Currency(150, 'DKK'),
        trans: new Currency(price, 'DKK')
      };
    }
  },
  "scannet": {
    name: "Scannet",
    logo: "scannet.png",
    link: "http://www.scannet.dk/hosting/betalingsloesning/",
    is_acquirer: false,
    acquirers: ["nets", "teller"],
    cards: ["dankort", "visa", "mastercard", "maestro"],
    costfn: function (o) {
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
    cards: ["visa", "mastercard", "maestro"],
    costfn: function (o) {
      if (o.antifraud || o.multiacquirer || o.mobilepay) {
        return null;
      }

      var oms = o.n * o.avgvalue.dkk();
      var fee = 1.9;
      if (oms <= (new Currency(50000, 'EUR')).dkk()) {
        fee = 2.1;
      }
      if (oms <= (new Currency(25000, 'EUR')).dkk()) {
        fee = 2.5;
      }
      if (oms <= (new Currency(2500, 'EUR')).dkk()) {
        fee = 2.9;
      }

      return {
        setup: new Currency(0, 'EUR'),
        monthly: new Currency(0, 'EUR'),
        trans: o.avgvalue.scale(fee / 100).add(new Currency(0.25, 'EUR')).scale(o.n)
      };
    }
  },
  "wannafind": {
    name: "Wannafind",
    logo: "wannafind.png",
    link: "https://wannafind.dk/betalingsgateway/",
    is_acquirer: false,
    acquirers: ["nets", "teller"],
    cards: ["dankort", "visa", "mastercard", "maestro"],
    costfn: function (o) {
      if (o.multiacquirer || o.mobilepay) { return null; }

      var recurring = 0, visasecure = 0;

      if (o.visasecure) { visasecure = (new Currency(49, 'DKK')); }
      if (o.recurring) { recurring = (new Currency(99, 'DKK')); }

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
    cards: ["dankort", "visa", "mastercard", "maestro"],
    costfn: function (o) {
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
    costfn: function (o) {
      if (o.multiacquirer || o.mobilepay) { return null; }

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
    costfn: function (o) {
      if (o.multiacquirer || o.mobilepay) { return null; }

      var fee = 5.5;

      return {
        setup: new Currency(0, 'USD'),
        monthly: new Currency(0, 'USD'),
        trans: o.avgvalue.scale(fee / 100).add(new Currency(0.45, 'USD')).scale(o.n)
      };
    }
  }

};
