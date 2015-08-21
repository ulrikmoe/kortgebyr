/**
 *   First shalt thou take out the Holy Pin. Then...
 *   @author Ulrik Moe, Christian Blach, Joakim Sindholt
 *   @license GPLv3
 *
 *   Indentation: 3 spaces
 *   Conventions: https://github.com/airbnb/javascript
 *
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
    'EUR': '€',
    'USD': '$'
 };
 var gccode = 'DKK';

 var company = {
    // Cards
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
    },
    // Acquirers
    "teller": {
       name: "Teller",
       logo: "teller.svg",
       link: "http://www.teller.com"
    },
    "handelsbanken": {
       name: "Handelsbanken",
       logo: "handelsbanken.svg",
       link: "http://www.handelsbanken.dk"
    },
    "nets": {
       name: "Nets",
       logo: "nets.svg",
       link: "http://www.nets.eu"
    },
    "nordea": {
       name: "Nordea",
       logo: "nordea.svg",
       link: "http://www.nordea.dk"
    },
    "swedbank": {
       name: "Swedbank",
       logo: "swedbank.png",
       link: "http://www.swedbank.dk"
    },
    "valitor": {
       name: "Valitor",
       logo: "valitor.png",
       link: "http://www.valitor.com"
    },
    "elavon": {
       name: "Elavon",
       logo: "elavon.svg",
       link: "http://www.elavon.com"
    },
    "clearhaus": {
       name: "Clearhaus",
       logo: "clearhaus.svg",
       link: "https://www.clearhaus.com"
    },
    // Payment Service Providers
    "braintree" :{
       name: "Braintree",
       logo: "braintree.svg",
       link: "https://www.braintreepayments.com"
    },
    "certitrade": {
       name: "Certitrade",
       logo: "certitrade.svg",
       link: "http://www.certitrade.net/kortbetalning.php"
    },
    "checkout": {
       name: "Checkout.com",
       logo: "checkout.svg",
       link: "https://www.checkout.com"
    },
    "dandomain": {
       name: "DanDomain",
       logo: "dandomain.svg",
       link: "https://www.dandomain.dk/e-handel/betalingssystem"
    },
    "dibs": {
       name: "DIBS",
       logo: "dibs.svg",
       link: "http://dibs.dk"
    },
    "epay": {
       name: "ePay",
       logo: "epay.svg",
       link: "http://epay.dk"
    },
    "netaxept": {
       name: "Netaxept",
       logo: "netaxept.svg",
       link: "https://www.terminalshop.dk/Netaxept/",
    },
    "payer": {
       name: "Payer",
       logo: "payer.svg",
       link: "http://payer.se/betallosning/"
    },
    "paymill": {
       name: "Paymill",
       logo: "paymill.svg",
       link: "https://paymill.com"
    },
    "paypal": {
       name: "paypal",
       logo: "paypal.svg",
       link: "https://paypal.com"
    },
    "payson": {
       name: "Payson",
       logo: "payson.png",
       link: "https://www.payson.se"
    },
    "payza": {
       name: "Payza",
       logo: "payza.png",
       link: "https://payza.com"
    },
    "verifone": {
       name: "Verifone Bas",
       logo: "verifone.svg",
       link: "http://www.verifone.se/sv/Sweden/Start/E-handel/"
    },
    "stripe": {
       name: "Stripe",
       logo: "stripe.svg",
       link: "https://stripe.com"
    },
    "quickpay": {
       name: "QuickPay",
       logo: "quickpay.svg",
       link: "https://quickpay.net"
    },
    "scannet": {
       name: "Scannet",
       logo: "scannet.png",
       link: "http://www.scannet.dk/hosting/betalingsloesning/"
    },
    "skrill": {
       name: "Skrill",
       logo: "skrill.svg",
       link: "https://skrill.com"
    },
    "wannafind": {
       name: "Wannafind",
       logo: "wannafind.svg",
       link: "https://www.wannafind.dk/betalingsgateway/"
    },
    "yourpay": {
       name: "yourpay",
       logo: "yourpay.png",
       link: "http://yourpay.dk"
    },
    "klarna": {
       name: "Klarna",
       logo: "klarna.svg",
       link: "https://klarna.se"
    },
    "2checkout": {
       name: "2checkout",
       logo: "2checkout.png",
       link: "https://www.2checkout.com"
    },
    "paylike": {
       name: "Paylike",
       logo: "paylike.svg",
       link: "https://paylike.io"
    }
 };

 var ACQs = {
    "teller": {
       cards: cardlist(["visa", "mastercard", "maestro", "amex", "jcb", "unionpay", "diners"]),
       fee_setup: new Currency(1000, 'DKK'),
       fee_monthly: new Currency(149, 'DKK'),
       fee_fixed: new Currency(0, 'DKK'),
       fee_variable: 1.5,
       costfn: function(o) {
          var gebyr = this.fee_fixed.add(o.avgvalue.scale(this.fee_variable / 100));
          if (gebyr.dkk() < 0.7) {
             gebyr = new Currency(0.7, 'DKK');
          }
          gebyr = gebyr.scale(o.transactions);
          return {
             trans: gebyr,
             total: gebyr.add(this.fee_monthly)
          };
       }
    },
    "handelsbanken": {
       cards: cardlist(["visa", "mastercard", "maestro"]),
       fee_setup: new Currency(0, 'DKK'),
       fee_monthly: new Currency(0, 'DKK'),
       fee_fixed: new Currency(0, 'DKK'),
       fee_variable: 1.5,
       costfn: acq_cost_default
    },
    "nets": {
       cards: cardlist(["dankort"]),
       fee_setup: new Currency(250, 'DKK'),
       fee_monthly: new Currency(1000 / 12, 'DKK'),
       costfn: function(o) {
          var gebyr = 1.39;
          var gnspris = o.avgvalue.dkk();
          if (gnspris <= 100) {
             gebyr = 1.1;
          }
          if (gnspris <= 50) {
             gebyr = 0.7;
          }
          gebyr = (new Currency(gebyr, 'DKK')).scale(o.transactions);
          return {
             trans: gebyr,
             total: gebyr.add(this.fee_monthly)
          };
       }
    },
    "nordea": {
       cards: cardlist(["visa", "mastercard", "maestro"]),
       fee_setup: new Currency(0, 'DKK'),
       fee_monthly: new Currency(0, 'DKK'),
       fee_fixed: new Currency(0, 'DKK'),
       fee_variable: 1.6,
       costfn: acq_cost_default
    },
    "swedbank": {
       cards: cardlist(["visa", "mastercard", "maestro"]),
       fee_setup: new Currency(1900, 'DKK'),
       fee_monthly: new Currency(100, 'DKK'),
       fee_fixed: new Currency(0, 'DKK'),
       fee_variable: 1.6,
       costfn: acq_cost_default
    },
    "valitor": {
       cards: cardlist(["visa", "mastercard", "maestro"]),
       fee_setup: new Currency(0, 'DKK'),
       fee_monthly: new Currency(0, 'DKK'),
       fee_fixed: new Currency(0, 'DKK'),
       fee_variable: 1.5,
       costfn: acq_cost_default
    },
    "elavon": {
       cards: cardlist(["visa", "mastercard", "maestro"]),
       fee_setup: new Currency(0, 'DKK'),
       fee_monthly: new Currency(0, 'DKK'),
       fee_fixed: new Currency(0, 'DKK'),
       fee_variable: 1.6,
       costfn: acq_cost_default
    },
    "clearhaus": {
       cards: cardlist(["visa", "mastercard", "maestro"]),
       fee_setup: new Currency(0, 'DKK'),
       fee_monthly: new Currency(0, 'DKK'),
       fee_fixed: new Currency(0, 'DKK'),
       fee_variable: 1.45,
       costfn: acq_cost_default
    }
 };

 var PSPs = [
    {
       id: "braintree",
       cards: cardlist(["visa", "mastercard", "maestro"]),
       costfn: function(o) {
          if (o.multiacquirer || o.mobilepay) {
             return null;
          }
          return {
             setup: new Currency(0, 'DKK'),
             monthly: new Currency(0, 'DKK'),
             trans: o.avgvalue.scale(2.9 / 100).add(new Currency(2.25, 'DKK')).scale(o.transactions)
          };
       }
    },
    {
       id: "certitrade",
       acquirers: cardlist(["handelsbanken", "nordea", "swedbank"]),
       cards: cardlist(["visa", "mastercard", "maestro", "diners", "amex"]),
       costfn: function(o) {
          if (o.antifraud || o.recurring || o.multiacquirer || o.mobilepay) {
             return null;
          }
          return {
             setup: new Currency(0, 'SEK'),
             monthly: new Currency(192, 'SEK'),
             trans: o.avgvalue.scale(0.9 / 100).add(new Currency(1.5, 'SEK')).scale(o.transactions)
          };
       }
    },
    {
       id: "checkout",
       cards: cardlist(["visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay"]),
       costfn: function(o) {
          if (o.multiacquirer || o.mobilepay) {
             return null;
          }
          return {
             setup: new Currency(0, 'DKK'),
             monthly: new Currency(0, 'DKK'),
             trans: o.avgvalue.scale(1.5 / 100).add(new Currency(0.15, 'EUR')).scale(o.transactions)
          };
       }
    },
    {
       id: "dandomain",
       acquirers: cardlist(["nets", "teller"]),
       cards: cardlist(["dankort", "visa", "mastercard", "maestro", "forbrugsforeningen", "diners", "jcb", "amex", "unionpay"]),
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
             if (o.transactions < 100) m += 99;
             else if (o.transactions < 1000) m += 149;
             else m += 399;
          }

          return {
             setup: new Currency(s, 'DKK'),
             monthly: new Currency(m, 'DKK'),
             trans: new Currency(0, 'DKK')
          };
       }
    },
    {
       id: "dibs",
       product: "Start",
       acquirers: cardlist(["nets", "teller", "swedbank", "valitor", "handelsbanken", "elavon"]),
       cards: cardlist(["dankort"]),
       costfn: function(o) {
          if (o.antifraud || o.recurring || o.visasecure || o.multiacquirer) {
             return null;
          }
          return {
             setup: new Currency(1495, 'DKK'),
             monthly: new Currency(149, 'DKK'),
             trans: (new Currency(0.6, 'DKK')).scale(o.transactions)
          };
       }
    },
    {
       id: "dibs",
       product: "Medium",
       acquirers: cardlist(["nets", "teller", "swedbank", "valitor", "handelsbanken", "elavon"]),
       cards: cardlist(["dankort", "visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay", "diners"]),
       costfn: function(o) {
          if (o.antifraud || o.recurring || o.multiacquirer) {
             return null;
          }
          return {
             setup: new Currency(4995, 'DKK'),
             monthly: new Currency(499, 'DKK'),
             trans: (new Currency(0.55, 'DKK')).scale(o.transactions)
          };
       }
    },
    {
       id: "dibs",
       product: "Premium",
       acquirers: cardlist(["nets", "teller", "swedbank", "valitor", "handelsbanken", "elavon"]),
       cards: cardlist(["dankort", "visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay", "forbrugsforeningen", "diners"]),
       costfn: function(o) {
          return {
             setup: new Currency(10995, 'DKK'),
             monthly: new Currency(899, 'DKK'),
             trans: (new Currency(0.5, 'DKK')).scale(o.transactions)
          };
       }
    },
    {
       id: "epay",
       product: "Light",
       acquirers: cardlist(["nets"]),
       cards: cardlist(["dankort", "forbrugsforeningen"]),
       costfn: function(o) {
          if (o.recurring || o.multiacquirer) {
             return null;
          }
          var fee = 0.25;
          var antifraud = 0;
          if (o.antifraud) {
             antifraud = (new Currency(0.3, 'DKK')).scale(o.transactions);
          }
          return {
             setup: new Currency(399, 'DKK'),
             monthly: new Currency(99, 'DKK'),
             trans: (new Currency(fee, 'DKK')).scale(Math.max(o.transactions - 250, 0)).add(antifraud)
          };
       }
    },
    {
       id: "epay",
       product: "Pro",
       acquirers: cardlist(["nets", "teller"]),
       cards: cardlist(["dankort", "visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay", "forbrugsforeningen"]),
       costfn: function(o) {
          if (o.recurring || o.multiacquirer) {
             return null;
          }

          var fee = 0.25;
          var antifraud = 0;
          if (o.antifraud) {
             antifraud = (new Currency(0.3, 'DKK')).scale(o.transactions);
          }

          return {
             setup: new Currency(599, 'DKK'),
             monthly: new Currency(199, 'DKK'),
             trans: (new Currency(fee, 'DKK')).scale(Math.max(o.transactions - 250, 0)).add(antifraud)
          };
       }
    },
    {
       id: "epay",
       product: "Business",
       acquirers: cardlist(["nets", "teller", "swedbank", "handelsbanken", "valitor", "elavon", "clearhaus"]),
       cards: cardlist(["dankort", "visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay", "forbrugsforeningen"]),
       costfn: function(o) {

          var fee = 0.25,
             antifraud = 0,
             recurring = 0;

          if (o.antifraud) {
             antifraud = (new Currency(0.3, 'DKK')).scale(o.transactions);
          }
          if (o.recurring) {
             recurring = (new Currency(1, 'DKK')).scale(o.transactions);
          }

          return {
             setup: new Currency(999, 'DKK').add(recurring),
             monthly: new Currency(299, 'DKK'),
             trans: (new Currency(fee, 'DKK')).scale(Math.max(o.transactions - 500, 0)).add(antifraud)
          };
       }
    },
    {
       id: "netaxept",
       product: "Start",
       acquirers: cardlist(["nets", "teller"]),
       cards: cardlist(["dankort", "visa", "mastercard"]),
       costfn: function(o) {
          if (o.recurring || o.multiacquirer || o.mobilepay) {
             return null;
          }

          return {
             setup: new Currency(1005, 'DKK'),
             monthly: new Currency(180, 'DKK'),
             trans: (new Currency(1.5, 'DKK')).scale(o.transactions)
          };
       }
    },
    {
       id: "netaxept",
       product: "Plus",
       acquirers: cardlist(["nets", "teller", "elavon", "swedbank", "nordea"]),
       cards: cardlist(["dankort", "visa", "mastercard", "diners", "jcb", "amex", "unionpay"]),
       costfn: function(o) {
          if (o.recurring || o.multiacquirer || o.mobilepay) {
             return null;
          }

          return {
             setup: new Currency(3016, 'DKK'),
             monthly: new Currency(502, 'DKK'),
             trans: (new Currency(1, 'DKK')).scale(o.transactions)
          };
       }
    },
    {
       id: "netaxept",
       product: "Advanced",
       acquirers: cardlist(["nets", "teller", "elavon", "swedbank", "nordea"]),
       cards: cardlist(["dankort", "visa", "mastercard", "diners", "jcb", "amex", "unionpay"]),
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
             trans: (new Currency(0.7, 'DKK')).scale(o.transactions)
          };
       }
    },
    {
       id: "payer",
       acquirers: cardlist(["handelsbanken", "swedbank", "nordea"]),
       cards: cardlist(["visa", "mastercard", "maestro", "diners", "amex"]),
       costfn: function(o) {
          if (o.antifraud || o.recurring || o.multiacquirer || o.mobilepay) {
             return null;
          }

          return {
             setup: new Currency(1400, 'SEK'),
             monthly: new Currency(400, 'SEK'),
             trans: (new Currency(2, 'SEK')).scale(o.transactions)
          };
       }
    },
    {
       id: "paymill",
       cards: cardlist(["visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay"]),
       costfn: function(o) {

          if (o.antifraud || o.multiacquirer || o.mobilepay) {
             return null;
          }

          return {
             setup: new Currency(0, 'EUR'),
             monthly: new Currency(0, 'EUR'),
             trans: o.avgvalue.scale(2.95 / 100).add(new Currency(0.28, 'EUR')).scale(o.transactions)
          };
       }
    },
    {
       id: "paypal",
       cards: cardlist(["visa", "mastercard", "maestro", "diners", "jcb", "amex"]),
       costfn: function(o) {
          if (o.antifraud || o.multiacquirer || o.mobilepay) {
             return null;
          }

          var oms = o.transactions * o.avgvalue.dkk();
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
             trans: o.avgvalue.scale(fee / 100).add(new Currency(2.6, 'DKK')).scale(o.transactions)
          };
       }
    },
    {
       id: "payson",
       cards: cardlist(["visa", "mastercard", "maestro"]),
       costfn: function(o) {
          if (o.antifraud || o.recurring || o.multiacquirer || o.mobilepay) {
             return null;
          }

          return {
             setup: new Currency(0, 'SEK'),
             monthly: new Currency(0, 'SEK'),
             trans: o.avgvalue.scale(3 / 100).add(new Currency(3, 'SEK')).scale(o.transactions)
          };
       }
    },
    {
       id: "payza",
       cards: cardlist(["visa", "mastercard", "maestro"]),
       costfn: function(o) {
          if (o.antifraud || o.multiacquirer || o.mobilepay) {
             return null;
          }

          return {
             setup: new Currency(0, 'EUR'),
             monthly: new Currency(20, 'EUR'),
             trans: o.avgvalue.scale(2.5 / 100).add(new Currency(0.25, 'EUR')).scale(o.transactions)
          };
       }
    },
    {
       id: "verifone",
       product: "Bas",
       acquirers: cardlist(["handelsbanken", "nordea", "swedbank"]),
       cards: cardlist(["visa", "mastercard", "diners", "jcb", "amex"]),
       costfn: function(o) {
          if (o.recurring || o.multiacquirer || o.multiacquirer || o.mobilepay) {
             return null;
          }

          return {
             setup: new Currency(999, 'SEK'),
             monthly: new Currency(199, 'SEK'),
             trans: (new Currency(4, 'SEK')).scale(Math.max(o.transactions - 100, 0))
          };
       }
    },
    {
       id: "verifone",
       product: "Premium",
       acquirers: cardlist(["handelsbanken", "nordea", "swedbank"]),
       cards: cardlist(["visa", "mastercard", "diners", "jcb", "amex"]),
       costfn: function(o) {
          if (o.recurring || o.multiacquirer || o.mobilepay) {
             return null;
          }

          return {
             setup: new Currency(2499, 'SEK'),
             monthly: new Currency(499, 'SEK'),
             trans: (new Currency(2.5, 'SEK')).scale(Math.max(o.transactions - 400, 0))
          };
       }
    },
    {
       id: "verifone",
       product: "PremiumPlus",
       acquirers: cardlist(["nets", "handelsbanken", "nordea", "swedbank"]),
       cards: cardlist(["dankort", "visa", "mastercard", "diners", "amex", "jcb"]),
       costfn: function(o) {
          if (o.recurring || o.multiacquirer || o.mobilepay) {
             return null;
          }
          return {
             setup: new Currency(4999, 'SEK'),
             monthly: new Currency(1999, 'SEK'),
             trans: (new Currency(0.75, 'SEK')).scale(Math.max(o.transactions - 4000, 0))
          };
       }
    },
    {
       id: "stripe",
       cards: cardlist(["visa", "mastercard", "maestro", "amex"]),
       costfn: function(o) {
          if (o.multiacquirer || o.mobilepay) {
             return null;
          }
          return {
             setup: new Currency(0, 'USD'),
             monthly: new Currency(0, 'USD'),
             trans: o.avgvalue.scale(1.7 / 100).add(new Currency(1.8, 'DKK')).scale(o.transactions)
          };
       }
    },
    {
       id: "quickpay",
       product: "Standard",
       acquirers: cardlist(["nets", "teller", "clearhaus"]),
       cards: cardlist(["dankort", "visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay", "forbrugsforeningen"]),
       costfn: function(o) {
          return {
             setup: new Currency(0, 'DKK'),
             monthly: new Currency(49, 'DKK'),
             trans: (new Currency(1, 'DKK')).scale(o.transactions)
          };
       }
    },
    {
       id: "quickpay",
       product: "Professional",
       acquirers: cardlist(["nets", "teller", "clearhaus"]),
       cards: cardlist(["dankort", "visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay", "forbrugsforeningen"]),
       costfn: function(o) {

          var fee = 0.25;
          return {
             setup: new Currency(0, 'DKK'),
             monthly: new Currency(149, 'DKK'),
             trans: (new Currency(fee, 'DKK')).scale(Math.max(o.transactions - 250, 0))
          };
       }
    },
    {
       id: "scannet",
       acquirers: cardlist(["nets", "teller"]),
       cards: cardlist(["dankort", "visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay"]),
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
    {
       id: "skrill",
       cards: cardlist(["visa", "mastercard", "maestro", "diners", "jcb", "amex"]),
       costfn: function(o) {
          if (o.antifraud || o.multiacquirer || o.mobilepay) {
             return null;
          }

          var oms = o.transactions * o.avgvalue.dkk();
          var fee = 2.9;

          return {
             setup: new Currency(0, 'EUR'),
             monthly: new Currency(21.75, 'EUR'),
             trans: o.avgvalue.scale(fee / 100).add(new Currency(0.25, 'EUR')).scale(o.transactions)
          };
       }
    },
    {
       id: "wannafind",
       acquirers: cardlist(["nets", "teller"]),
       cards: cardlist(["dankort", "visa", "mastercard", "maestro", "forbrugsforeningen", "diners", "jcb", "amex", "unionpay"]),
       costfn: function(o) {
          if (o.multiacquirer || o.mobilepay) {
             return null;
          }

          var recurring = 0, visasecure = 0;

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
    {
       id: "yourpay",
       cards: cardlist(["visa", "mastercard", "maestro"]),
       costfn: function(o) {
          if (o.antifraud || o.multiacquirer || o.recurring || o.mobilepay) {
             return null;
          }

          var fee = 2.25;

          return {
             setup: new Currency(0, 'DKK'),
             monthly: new Currency(0, 'DKK'),
             trans: o.avgvalue.scale(fee / 100).scale(Math.max(o.transactions, 0))
          };
       }
    },
    {
       id: "klarna",
       product: "checkout",
       cards: cardlist(["visa", "mastercard", "maestro"]),
       costfn: function(o) {
          if (o.multiacquirer || o.mobilepay) {
             return null;
          }

          var fee = 2.95;

          return {
             setup: new Currency(3995, 'SEK'),
             monthly: new Currency(599, 'SEK'),
             trans: o.avgvalue.scale(fee / 100).scale(o.transactions)
          };
       }
    },
    {
       id: "2checkout",
       cards: cardlist(["visa", "mastercard", "maestro", "amex", "jcb", "diners"]),
       costfn: function(o) {
          if (o.multiacquirer || o.mobilepay) {
             return null;
          }

          var fee = 2.4;

          return {
             setup: new Currency(0, 'USD'),
             monthly: new Currency(0, 'USD'),
             trans: o.avgvalue.scale(fee / 100).add(new Currency(0.30, 'USD')).scale(o.transactions)
          };
       }
    },
    {
       id: "paylike",
       cards: cardlist(["visa", "mastercard", "maestro"]),
       costfn: function(o) {
          if (o.multiacquirer || o.mobilepay) {
             return null;
          }
          return {
             setup: new Currency(0, 'DKK'),
             monthly: new Currency(0, 'DKK'),
             trans: o.avgvalue.scale(2.75 / 100).add(new Currency(0.25, 'EUR')).scale(o.transactions)
          };
       }
    }
 ];
