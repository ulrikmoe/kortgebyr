/**
 *   First shalt thou take out the Holy Pin. Then...
 *   @author Ulrik Moe, Christian Blach, Joakim Sindholt
 *   @license GPLv3
 *
 *   Indentation: 3 spaces
 *   Conventions: https://github.com/airbnb/javascript
 **/

var currency_value = {
   'DKK': 1,
   'SEK': 0.809,
   'NOK': 0.780,
   'EUR': 7.461,
   'USD': 6.860
};

var currency_map = {
   'DKK': 'kr',
   'SEK': 'kr',
   'NOK': 'kr',
   'EUR': '€',
   'USD': '$'
};

var CARDs = {
   "dankort": {},
   "visa": {},
   "mastercard": {},
   "maestro": {},
   "diners": {},
   "amex": { name: "American Express" },
   "jcb": {},
   "unionpay": {},
   "mobilepay": {
      costfn: function(o) {
         // We will calc the actual costs when we get some usage stats (ETA Q1 2016)
         return {
            setup: new Currency(49, 'DKK'),
            monthly: new Currency(49, 'DKK'),
            trans: new Currency(1, 'DKK')
         };
      }
   },
   "forbrugsforeningen": {
      costfn: function(o) {
         // We will calc the actual costs when we get some usage stats (ETA Q1 2016)
         return {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(0, 'DKK'),
            trans: new Currency(0, 'DKK')
         };
      },
   }
};

var ACQs = {
   "bambora": {
      name: "Bambora",
      logo: "bambora.svg",
      link: "http://www.bambora.com/",
      cards: objectize(["visa", "mastercard", "maestro"]),
      fees: {
         setup: new Currency(0, 'DKK'),
         monthly: new Currency(0, 'DKK'),
         trn: function(o) { return o.avgvalue.scale(1.45/100); }
      }
   },
   "clearhaus": {
      name: "Clearhaus",
      logo: "clearhaus.svg",
      link: "https://www.clearhaus.com",
      cards: objectize(["visa", "mastercard", "maestro", "mobilepay"]),
      fees: {
         setup: new Currency(0, 'DKK'),
         monthly: new Currency(0, 'DKK'),
         trn: function(o) {
            var trnfee = o.avgvalue.scale(1.45/100);
            if (trnfee.dkk() < 0.6) trnfee = new Currency(0.6, 'DKK');
            return trnfee;
         }
      }
   },
   "elavon": {
      name: "Elavon",
      logo: "elavon.svg",
      link: "http://www.elavon.com",
      cards: objectize(["visa", "mastercard", "maestro"]),
      fees: {
         setup: new Currency(0, 'DKK'),
         monthly: new Currency(0, 'DKK'),
         trn: function(o) { return o.avgvalue.scale(1.6/100); }
      }
   },
   "handelsbanken": {
      name: "Handelsbanken",
      logo: "handelsbanken.svg",
      link: "http://www.handelsbanken.dk",
      cards: objectize(["visa", "mastercard", "maestro"]),
      fees: {
         setup: new Currency(0, 'DKK'),
         monthly: new Currency(0, 'DKK'),
         trn: function(o) { return o.avgvalue.scale(1.5/100); }
      }
   },
   "nets": {
      name: "Nets",
      logo: "nets.svg",
      link: "http://www.nets.eu",
      cards: objectize(["dankort", "forbrugsforeningen", "mobilepay"]),
      fees: {
         setup: new Currency(250, 'DKK'),
         monthly: new Currency(1000 / 12, 'DKK'),
         trn: function(o) {
            var avgvalue = o.avgvalue.dkk();
            if (avgvalue <= 50) { return new Currency(0.7, 'DKK'); }
            else if (avgvalue <= 100) { return new Currency(1.1, 'DKK'); }
            else { return new Currency(1.39, 'DKK'); }
         }
      }
   },
   "swedbank": {
      name: "Swedbank",
      logo: "swedbank.png",
      link: "http://www.swedbank.dk",
      cards: objectize(["visa", "mastercard", "maestro"]),
      fees: {
         setup: new Currency(1900, 'DKK'),
         monthly: new Currency(100, 'DKK'),
         trn: function(o) { return o.avgvalue.scale(1.6/100); }
      }
   },
   "teller": {
      name: "Teller",
      logo: "teller.svg",
      link: "http://www.teller.com",
      cards: objectize(["visa", "mastercard", "maestro", "amex", "jcb", "unionpay", "diners", "mobilepay"]),
      fees: {
         setup: new Currency(1000, 'DKK'),
         monthly: new Currency(149, 'DKK'),
         trn: function(o) {
            var trnfee = o.avgvalue.scale(1.25/100).add(new Currency(0.19, 'DKK'));
            if (trnfee.dkk() < 0.7) trnfee = new Currency(0.7, 'DKK');
            return trnfee;
         }
      }
   },
   "valitor": {
      name: "Valitor",
      logo: "valitor.png",
      link: "http://www.valitor.com",
      cards: objectize(["visa", "mastercard", "maestro"]),
      fees: {
         setup: new Currency(0, 'DKK'),
         monthly: new Currency(0, 'DKK'),
         trn: function(o) { return o.avgvalue.scale(1.5/100); }
      }
   }
};


var PSPs = [
{
   name: "Braintree",
   logo: "braintree.svg",
   link: "https://www.braintreepayments.com",
   features: objectize(["antifraud", "recurring"]),
   cards: objectize(["visa", "mastercard", "maestro"]),
   costfn: function(o) {
      return {
         setup: new Currency(0, 'DKK'),
         monthly: new Currency(0, 'DKK'),
         trans: o.avgvalue.scale(2.9 / 100).add(new Currency(2.25, 'DKK')).scale(o.transactions)
      };
   }
},
{
   name: "Certitrade",
   logo: "certitrade.svg",
   link: "http://www.certitrade.net/kortbetalning.php",
   features: objectize(["antifraud"]),
   acquirers: objectize(["handelsbanken", "nordea", "swedbank", "clearhaus"]),
   cards: objectize(["visa", "mastercard", "maestro", "diners", "amex"]),
   costfn: function(o) {
      return {
         setup: new Currency(0, 'SEK'),
         monthly: new Currency(192, 'SEK'),
         trans: o.avgvalue.scale(0.9 / 100).add(new Currency(1.5, 'SEK')).scale(o.transactions)
      };
   }
},
{
   name: "Checkout.com",
   logo: "checkoutcom.svg",
   link: "https://www.checkout.com",
   features: objectize(["antifraud", "recurring"]),
   cards: objectize(["visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay"]),
   costfn: function(o) {
      return {
         setup: new Currency(0, 'DKK'),
         monthly: new Currency(0, 'DKK'),
         trans: o.avgvalue.scale(1.5 / 100).add(new Currency(0.15, 'EUR')).scale(o.transactions)
      };
   }
},
{
   name: "DanDomain",
   logo: "dandomain.svg",
   link: "https://www.dandomain.dk/e-handel/betalingssystem",
   features: objectize(["recurring"]),
   acquirers: objectize(["nets", "teller"]),
   cards: objectize(["dankort", "visa", "mastercard", "maestro", "forbrugsforeningen", "diners", "jcb", "amex", "unionpay", "mobilepay"]),
   costfn: function(o) {
      var recurring = {
         setup: 0,
         monthly: 0
      };

      if (o.features.recurring) {
         recurring.setup = new Currency(299, 'DKK');
         if (o.transactions < 100) { recurring.monthly = 99; }
         else if (o.transactions < 1000) { recurring.monthly = 149; }
         else {recurring.monthly = 399; }

         recurring.monthly = new Currency(recurring.monthly, 'DKK');
      }
      return {
         setup: new Currency(298, 'DKK').add(recurring.setup), // 199 + 99 (3D)
         monthly: new Currency(198, 'DKK').add(recurring.monthly), // 149 + 49 (3D)
         trans: new Currency(0, 'DKK')
      };
   }
},
{
   name: "DIBS Start",
   logo: "dibs.svg",
   link: "http://dibs.dk",
   features: {},
   acquirers: objectize(["nets"]),
   cards: objectize(["dankort", "mobilepay"]),
   costfn: function(o) {
      return {
         setup: new Currency(1495, 'DKK'),
         monthly: new Currency(149, 'DKK'),
         trans: new Currency(0.6, 'DKK').scale(o.transactions)
      };
   }
},
{
   name: "DIBS Medium",
   logo: "dibs.svg",
   link: "http://dibs.dk",
   features: objectize(["antifraud"]),
   acquirers: objectize(["nets", "teller", "swedbank", "valitor", "handelsbanken", "elavon"]),
   cards: objectize(["dankort", "visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay", "diners", "mobilepay"]),
   costfn: function(o) {
      var antifraud = {
         setup: 0,
         monthly: 0
      };
      if (o.features.antifraud) {
         antifraud.setup = new Currency(495, 'DKK');
         antifraud.monthly = new Currency(49, 'DKK');
      }
      return {
         setup: new Currency(4995, 'DKK').add(antifraud.setup),
         monthly: new Currency(499, 'DKK').add(antifraud.monthly),
         trans: new Currency(0.55, 'DKK').scale(o.transactions)
      };
   }
},
{
   name: "DIBS Premium",
   logo: "dibs.svg",
   link: "http://dibs.dk",
   features: objectize(["antifraud", "recurring", "multiacquirer"]),
   acquirers: objectize(["nets", "teller", "swedbank", "valitor", "handelsbanken", "elavon"]),
   cards: objectize(["dankort", "visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay", "forbrugsforeningen", "diners", "mobilepay"]),
   costfn: function(o) {
      var antifraud = {
         setup: 0,
         monthly: 0
      };
      if (o.features.antifraud) {
         antifraud.setup = new Currency(495, 'DKK');
         antifraud.monthly = new Currency(49, 'DKK');
      }
      return {
         setup: new Currency(10995, 'DKK').add(antifraud.setup),
         monthly: new Currency(899, 'DKK').add(antifraud.monthly),
         trans: new Currency(0.5, 'DKK').scale(o.transactions)
      };
   }
},
{
   name: "ePay Light",
   logo: "epay.svg",
   link: "http://epay.dk",
   features: objectize(["antifraud"]),
   acquirers: objectize(["nets"]),
   cards: objectize(["dankort", "forbrugsforeningen", "mobilepay"]),
   costfn: function(o) {
      var fee = 0.25;
      var antifraud = 0;
      if (o.features.antifraud) {
         antifraud = (new Currency(0.3, 'DKK')).scale(o.transactions);
      }
      return {
         setup: new Currency(399, 'DKK'),
         monthly: new Currency(99, 'DKK'),
         trans: new Currency(fee, 'DKK').scale(Math.max(o.transactions - 250, 0)).add(antifraud)
      };
   }
},
{
   name: "ePay Pro",
   logo: "epay.svg",
   link: "http://epay.dk",
   features: objectize(["antifraud"]),
   acquirers: objectize(["nets", "teller"]),
   cards: objectize(["dankort", "visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay", "forbrugsforeningen", "mobilepay"]),
   costfn: function(o) {
      var fee = 0.25;
      var antifraud = 0;

      if (o.features.antifraud) {
         antifraud = (new Currency(0.3, 'DKK')).scale(o.transactions);
      }
      return {
         setup: new Currency(599, 'DKK'),
         monthly: new Currency(199, 'DKK'),
         trans: new Currency(fee, 'DKK').scale(Math.max(o.transactions - 250, 0)).add(antifraud)
      };
   }
},
{
   name: "ePay Business",
   logo: "epay.svg",
   link: "http://epay.dk",
   features: objectize(["antifraud", "recurring", "multiacquirer"]),
   acquirers: objectize(["nets", "teller", "swedbank", "handelsbanken", "valitor", "elavon", "clearhaus", "bambora"]),
   cards: objectize(["dankort", "visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay", "forbrugsforeningen", "mobilepay"]),
   costfn: function(o) {
      var fee = 0.25,
      antifraud = 0,
      recurring = 0;

      if (o.features.antifraud) {
         antifraud = (new Currency(0.3, 'DKK')).scale(o.transactions);
      }
      if (o.features.recurring) {
         recurring = (new Currency(1 / 12, 'DKK')).scale(o.transactions);
      }

      return {
         setup: new Currency(999, 'DKK').add(recurring),
         monthly: new Currency(299, 'DKK'),
         trans: new Currency(fee, 'DKK').scale(Math.max(o.transactions - 500, 0)).add(antifraud).add(recurring)
      };
   }
},
{
   name: "Klarna",
   logo: "klarna.svg",
   link: "https://klarna.se",
   product: "checkout",
   features: {},
   cards: objectize(["visa", "mastercard", "maestro"]),
   costfn: function(o) {
      var fee = 2.95;
      return {
         setup: new Currency(3995, 'SEK'),
         monthly: new Currency(599, 'SEK'),
         trans: o.avgvalue.scale(fee / 100).scale(o.transactions)
      };
   }
},
{
   name: "Netaxept Start",
   logo: "netaxept.svg",
   link: "https://www.terminalshop.dk/Netaxept/",
   features: objectize(["antifraud"]),
   acquirers: objectize(["nets", "teller"]),
   cards: objectize(["dankort", "visa", "mastercard"]),
   costfn: function(o) {
      return {
         setup: new Currency(1005, 'DKK'),
         monthly: new Currency(180, 'DKK'),
         trans: new Currency(1.5, 'DKK').scale(o.transactions)
      };
   }
},
{
   name: "Netaxept Plus",
   logo: "netaxept.svg",
   link: "https://www.terminalshop.dk/Netaxept/",
   features: objectize(["antifraud"]),
   acquirers: objectize(["nets", "teller", "elavon", "swedbank", "nordea"]),
   cards: objectize(["dankort", "visa", "mastercard", "diners", "jcb", "amex", "unionpay"]),
   costfn: function(o) {
      return {
         setup: new Currency(3016, 'DKK'),
         monthly: new Currency(502, 'DKK'),
         trans: new Currency(1, 'DKK').scale(o.transactions)
      };
   }
},
{
   name: "Netaxept Advanced",
   logo: "netaxept.svg",
   link: "https://www.terminalshop.dk/Netaxept/",
   features: objectize(["antifraud", "recurring"]),
   acquirers: objectize(["nets", "teller", "elavon", "swedbank", "nordea"]),
   cards: objectize(["dankort", "visa", "mastercard", "diners", "jcb", "amex", "unionpay"]),
   costfn: function(o) {
      var recurring = 0;
      if (o.features.recurring) {
         recurring = new Currency(250, 'DKK');
      }
      return {
         setup: new Currency(7540, 'DKK'),
         monthly: new Currency(703, 'DKK').add(recurring),
         trans: new Currency(0.7, 'DKK').scale(o.transactions)
      };
   }
},
{
   name: "Payer",
   logo: "payer.svg",
   link: "http://payer.se/betallosning/",
   features: {},
   acquirers: objectize(["handelsbanken", "swedbank", "nordea"]),
   cards: objectize(["visa", "mastercard", "maestro", "diners", "amex"]),
   costfn: function(o) {
      return {
         setup: new Currency(1400, 'SEK'),
         monthly: new Currency(400, 'SEK'),
         trans: new Currency(2, 'SEK').scale(o.transactions)
      };
   }
},
{
   name: "Paylike",
   logo: "paylike.svg",
   link: "https://paylike.io",
   features: objectize(["antifraud"]),
   cards: objectize(["visa", "mastercard", "maestro"]),
   costfn: function(o) {
      return {
         setup: new Currency(0, 'EUR'),
         monthly: new Currency(0, 'EUR'),
         trans: o.avgvalue.scale(2.5 / 100).add(new Currency(0.25, 'EUR')).scale(o.transactions)
      };
   }
},
{
   name: "Paymill",
   logo: "paymill.svg",
   link: "https://paymill.com",
   features: objectize(["antifraud", "recurring"]),
   cards: objectize(["visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay"]),
   costfn: function(o) {
      return {
         setup: new Currency(0, 'EUR'),
         monthly: new Currency(0, 'EUR'),
         trans: o.avgvalue.scale(2.95 / 100).add(new Currency(0.28, 'EUR')).scale(o.transactions)
      };
   }
},
{
   name: "PayPal",
   logo: "paypal.svg",
   link: "https://paypal.com",
   features: objectize(["antifraud", "recurring"]),
   cards: objectize(["visa", "mastercard", "maestro", "diners", "jcb", "amex"]),
   costfn: function(o) {
      var oms = o.transactions * o.avgvalue.dkk();
      var fee = 1.9;
      if (oms <= 800000) { fee = 2.4; }
      if (oms <= 400000) { fee = 2.7; }
      if (oms <= 80000) { fee = 2.9; }
      if (oms <= 20000) { fee = 3.4; }

      return {
         setup: new Currency(0, 'DKK'),
         monthly: new Currency(0, 'DKK'),
         trans: o.avgvalue.scale(fee / 100).add(new Currency(2.6, 'DKK')).scale(o.transactions)
      };
   }
},
{
   name: "Payson",
   logo: "payson.png",
   link: "https://www.payson.se",
   features: objectize(["antifraud"]),
   cards: objectize(["visa", "mastercard", "maestro"]),
   costfn: function(o) {
      return {
         setup: new Currency(0, 'SEK'),
         monthly: new Currency(0, 'SEK'),
         trans: o.avgvalue.scale(3 / 100).add(new Currency(3, 'SEK')).scale(o.transactions)
      };
   }
},
{
   name: "Payza",
   logo: "payza.svg",
   link: "https://payza.com",
   features: objectize(["antifraud"]),
   cards: objectize(["visa", "mastercard", "maestro"]),
   costfn: function(o) {
      return {
         setup: new Currency(0, 'EUR'),
         monthly: new Currency(20, 'EUR'),
         trans: o.avgvalue.scale(2.5 / 100).add(new Currency(0.25, 'EUR')).scale(o.transactions)
      };
   }
},
{
   name: "QuickPay Standard",
   logo: "quickpay.svg",
   link: "https://quickpay.net",
   features: objectize(["antifraud", "recurring", "multiacquirer"]),
   acquirers: objectize(["nets", "teller", "clearhaus"]),
   cards: objectize(["dankort", "visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay", "forbrugsforeningen", "mobilepay"]),
   costfn: function(o) {
      return {
         setup: new Currency(0, 'DKK'),
         monthly: new Currency(49, 'DKK'),
         trans: new Currency(1, 'DKK').scale(o.transactions)
      };
   }
},
{
   name: "QuickPay Professional",
   logo: "quickpay.svg",
   link: "https://quickpay.net",
   features: objectize(["antifraud", "recurring", "multiacquirer"]),
   acquirers: objectize(["nets", "teller", "clearhaus"]),
   cards: objectize(["dankort", "visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay", "forbrugsforeningen", "mobilepay"]),
   costfn: function(o) {
      return {
         setup: new Currency(0, 'DKK'),
         monthly: new Currency(149, 'DKK'),
         trans: new Currency(0.25, 'DKK').scale(Math.max(o.transactions - 250, 0))
      };
   }
},
{
   name: "Scannet",
   logo: "scannet.png",
   link: "http://www.scannet.dk/hosting/betalingsloesning/",
   features: {},
   acquirers: objectize(["nets", "teller"]),
   cards: objectize(["dankort", "visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay"]),
   costfn: function(o) {
      return {
         setup: new Currency(950, 'DKK'),
         monthly: new Currency(399, 'DKK'),
         trans: new Currency(0, 'DKK')
      };
   }
},
{
   name: "Skrill",
   logo: "skrill.svg",
   link: "https://skrill.com",
   features: objectize(["antifraud", "recurring"]),
   cards: objectize(["visa", "mastercard", "maestro", "diners", "jcb", "amex"]),
   costfn: function(o) {
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
   name: "Stripe",
   logo: "stripe.svg",
   link: "https://stripe.com",
   features: objectize(["antifraud", "recurring"]),
   cards: objectize(["visa", "mastercard", "maestro", "amex"]),
   costfn: function(o) {
      return {
         setup: new Currency(0, 'USD'),
         monthly: new Currency(0, 'USD'),
         trans: o.avgvalue.scale(1.4 / 100).add(new Currency(1.8, 'DKK')).scale(o.transactions)
      };
   }
},
{
   name: "Verifone Bas",
   logo: "verifone.svg",
   link: "http://www.verifone.se/sv/Sweden/Start/E-handel/",
   features: {},
   acquirers: objectize(["handelsbanken", "nordea", "swedbank"]),
   cards: objectize(["visa", "mastercard", "diners", "jcb", "amex"]),
   costfn: function(o) {
      return {
         setup: new Currency(999, 'SEK'),
         monthly: new Currency(199, 'SEK'),
         trans: new Currency(4, 'SEK').scale(Math.max(o.transactions - 100, 0))
      };
   }
},
{
   name: "Verifone Premium",
   logo: "verifone.svg",
   link: "http://www.verifone.se/sv/Sweden/Start/E-handel/",
   features: {},
   acquirers: objectize(["handelsbanken", "nordea", "swedbank"]),
   cards: objectize(["visa", "mastercard", "diners", "jcb", "amex"]),
   costfn: function(o) {
      return {
         setup: new Currency(2499, 'SEK'),
         monthly: new Currency(499, 'SEK'),
         trans: new Currency(2.5, 'SEK').scale(Math.max(o.transactions - 400, 0))
      };
   }
},
{
   name: "Verifone PremiumPlus",
   logo: "verifone.svg",
   link: "http://www.verifone.se/sv/Sweden/Start/E-handel/",
   features: {},
   acquirers: objectize(["nets", "handelsbanken", "nordea", "swedbank"]),
   cards: objectize(["dankort", "visa", "mastercard", "diners", "amex", "jcb"]),
   costfn: function(o) {
      return {
         setup: new Currency(4999, 'SEK'),
         monthly: new Currency(1999, 'SEK'),
         trans: new Currency(0.75, 'SEK').scale(Math.max(o.transactions - 4000, 0))
      };
   }
},
{
   name: "Wannafind",
   logo: "wannafind.svg",
   link: "https://www.wannafind.dk/betalingsgateway/",
   features: objectize(["recurring", "antifraud"]),
   acquirers: objectize(["nets", "teller"]),
   cards: objectize(["dankort", "visa", "mastercard", "maestro", "diners", "jcb", "amex", "unionpay", "mobilepay"]),
   costfn: function(o) {
      var recurring = 0;
      if (o.features.recurring) {
         recurring = (new Currency(99, 'DKK'));
      }
      return {
         setup: new Currency(0, 'DKK'),
         monthly: new Currency(198, 'DKK').add(recurring), // 149 + 49 (3D secure)
         trans: new Currency(0, 'DKK')
      };
   }
},
{
   name: "YourPay Feemium",
   logo: "yourpay.png",
   link: "http://www.yourpay.io",
   features: objectize(["recurring", "antifraud"]),
   cards: objectize(["visa", "mastercard", "maestro"]),
   costfn: function(o) {
      return {
         setup: new Currency(0, 'DKK'),
         monthly: new Currency(0, 'DKK'),
         trans: o.avgvalue.scale(2.25 / 100).add(new Currency(0.75, 'DKK')).scale(o.transactions)
      };
   }
},
{
   name: "YourPay Mini",
   logo: "yourpay.png",
   link: "http://www.yourpay.io",
   features: objectize(["recurring", "antifraud"]),
   cards: objectize(["visa", "mastercard", "maestro"]),
   costfn: function(o) {
      var trnfee = new Currency(0.50, 'DKK').scale(Math.max(o.transactions - 50, 0));
      return {
         setup: new Currency(0, 'DKK'),
         monthly: new Currency(49, 'DKK'),
         trans: o.avgvalue.scale(2.25 / 100).scale(o.transactions).add(trnfee)
      };
   }
},
{
   name: "YourPay Pro",
   logo: "yourpay.png",
   link: "http://www.yourpay.io",
   features: objectize(["recurring", "antifraud"]),
   cards: objectize(["visa", "mastercard", "maestro"]),
   costfn: function(o) {
      var trnfee = new Currency(0.25, 'DKK').scale(Math.max(o.transactions - 75, 0));
      return {
         setup: new Currency(0, 'DKK'),
         monthly: new Currency(149, 'DKK'),
         trans: o.avgvalue.scale(1.75 / 100).scale(o.transactions).add(trnfee)
      };
   }
},
{
   name: "YourPay Business",
   logo: "yourpay.png",
   link: "http://www.yourpay.io",
   features: objectize(["recurring", "antifraud"]),
   cards: objectize(["visa", "mastercard", "maestro"]),
   costfn: function(o) {
      var trnfee = new Currency(0.15, 'DKK').scale(Math.max(o.transactions - 500, 0));
      return {
         setup: new Currency(0, 'DKK'),
         monthly: new Currency(299, 'DKK'),
         trans: o.avgvalue.scale(1.35 / 100).scale(o.transactions).add(trnfee)
      };
   }
},
{
   name: "2checkout",
   logo: "2checkout.svg",
   link: "https://www.2checkout.com",
   features: objectize(["antifraud", "recurring"]),
   cards: objectize(["visa", "mastercard", "maestro", "amex", "jcb", "diners"]),
   costfn: function(o) {
      var fee = 2.4;
      return {
         setup: new Currency(0, 'USD'),
         monthly: new Currency(0, 'USD'),
         trans: o.avgvalue.scale(fee / 100).add(new Currency(0.30, 'USD')).scale(o.transactions)
      };
   }
}];
