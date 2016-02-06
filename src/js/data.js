/**
*  First shalt thou take out the Holy Pin. Then...
*  @author Ulrik Moe, Christian Blach, Joakim Sindholt
*  @license GPLv3
*
*  Indentation: 3 spaces
*  Conventions: https://github.com/airbnb/javascript
*
*  Resellers: Scannet, PensoPay, Wannafind ...
*
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


var ACQs = [
{
   name: "Bambora",
   logo: "bambora.svg",
   w: 71,
   h: 13,
   link: "http://www.bambora.com/",
   cards: {
      visa: true,
      mastercard: true,
      maestro: true
   },
   fees: {
      setup: new Currency(0, 'DKK'),
      monthly: new Currency(0, 'DKK'),
      trn: function(o) { return o.avgvalue.scale(1.45/100); }
   }
},
{
   name: "Clearhaus",
   logo: "clearhaus.svg",
   w: 72,
   h: 14,
   link: "https://www.clearhaus.com",
   cards: {
      visa: true,
      mastercard: true,
      maestro: true,
      mobilepay: {
         setup: new Currency(49, 'DKK'),
         monthly: new Currency(49, 'DKK'),
         trn: new Currency(1, 'DKK')
      }
   },
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
{
   name: "Elavon",
   logo: "elavon.svg",
   w: 51,
   h: 14,
   link: "http://www.elavon.com",
   cards: {
      visa: true,
      mastercard: true,
      maestro: true
   },
   fees: {
      setup: new Currency(0, 'DKK'),
      monthly: new Currency(0, 'DKK'),
      trn: function(o) { return o.avgvalue.scale(1.6/100); }
   }
},
{
   name: "Handelsbanken",
   logo: "handelsbanken.svg",
   w: 90,
   h: 9,
   link: "http://www.handelsbanken.dk",
   cards: {
      visa: true,
      mastercard: true,
      maestro: true
   },
   fees: {
      setup: new Currency(0, 'DKK'),
      monthly: new Currency(0, 'DKK'),
      trn: function(o) { return o.avgvalue.scale(1.5/100); }
   }
},
{
   name: "Nets",
   logo: "nets.svg",
   w: 37,
   h: 14,
   link: "http://www.nets.eu",
   cards: {
      dankort: true,
      forbrugsforeningen: { setup: new Currency(0, 'DKK') },
      mobilepay: {
         setup: new Currency(49, 'DKK'),
         monthly: new Currency(49, 'DKK'),
         trn: new Currency(1, 'DKK')
      }
   },
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
{
   name: "Swedbank",
   logo: "swedbank.png",
   w: 62,
   h: 10,
   link: "http://www.swedbank.dk",
   cards: {
      visa: true,
      mastercard: true,
      maestro: true
   },
   fees: {
      setup: new Currency(1900, 'DKK'),
      monthly: new Currency(100, 'DKK'),
      trn: function(o) { return o.avgvalue.scale(1.6/100); }
   }
},
{
   name: "Teller",
   logo: "teller.svg",
   w: 59,
   h: 11,
   link: "http://www.teller.com",
   cards: {
      visa: true,
      mastercard: true,
      maestro: true,
      amex: true,
      jcb: true,
      unionpay: true,
      diners: true,
      mobilepay: {
         setup: new Currency(49, 'DKK'),
         monthly: new Currency(49, 'DKK'),
         trn: new Currency(1, 'DKK')
      }
   },
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
{
   name: "Valitor",
   logo: "valitor.png",
   w: 61,
   h: 9,
   link: "http://www.valitor.com",
   cards: {
      visa: true,
      mastercard: true,
      maestro: true,
   },
   fees: {
      setup: new Currency(0, 'DKK'),
      monthly: new Currency(0, 'DKK'),
      trn: function(o) { return o.avgvalue.scale(1.5/100); }
   }
}
];

var PSPs = [
{
   name: "Braintree",
   logo: "braintree.svg",
   w: 116,
   h: 16,
   link: "https://www.braintreepayments.com",
   features: {
      antifraud: true,
      recurring: true
   },
   cards: {
      visa: true,
      mastercard: true,
      maestro: true
   },
   fees: {
      setup: new Currency(0, 'DKK'),
      monthly: new Currency(0, 'DKK'),
      trn: function(o) { return o.avgvalue.scale(2.9/100).add(new Currency(2.25, 'DKK')).scale(o.transactions); }
   }
},
{
   name: "Certitrade",
   logo: "certitrade.svg",
   w: 125,
   h: 25,
   link: "http://www.certitrade.net/kortbetalning.php",
   acquirers: {
      Clearhaus: true,
      Swedbank: true,
      Handelsbanken: true,
      Nordea: true
   },
   cards: {
      visa: true,
      mastercard: true,
      maestro: true,
      amex: true,
      jcb: true,
      diners: true
   },
   fees: {
      setup: new Currency(0, 'DKK'),
      monthly: new Currency(206, 'SEK'), // 48/7*30
      trn: function(o) { return o.avgvalue.scale(0.9/100).add(new Currency(1.5, 'SEK')).scale(o.transactions); }
   }
},
{
   name: "Checkout.com",
   logo: "checkoutcom.svg",
   w: 145,
   h: 15,
   link: "https://www.checkout.com",
   features: {
      antifraud: true,
      recurring: true,
   },
   cards: {
      visa: true,
      mastercard: true,
      maestro: true,
      amex: true,
      jcb: true,
      unionpay: true,
      diners: true
   },
   fees: {
      setup: new Currency(0, 'EUR'),
      monthly: new Currency(0, 'EUR'),
      trn: function(o) { return o.avgvalue.scale(1.5/100).add(new Currency(0.15, 'EUR')).scale(o.transactions); }
   }
},
{
   name: "DanDomain",
   logo: "dandomain.svg",
   w: 135,
   h: 25,
   link: "https://www.dandomain.dk/webshop/betalingssystem",
   acquirers: {
      Nets: true,
      Teller: true
   },
   cards: {
      dankort: true,
      visa: true,
      mastercard: true,
      maestro: true,
      amex: true,
      jcb: true,
      unionpay: true,
      diners: true,
      mobilepay: true,
      forbrugsforeningen: true
   },
   fees: {
      setup: new Currency(199, 'DKK'),
      monthly: new Currency(248, 'DKK'), // 149 + 99 (3D-secure)
      trn: function(o) { return new Currency(0, 'DKK'); }
   }
},
{
   name: "DIBS Start",
   logo: "dibs.svg",
   w: 115,
   h: 28,
   link: "http://dibs.dk",
   acquirers: {
      Nets: true
   },
   cards: {
      dankort: true,
      mobilepay: true
   },
   fees: {
      setup: new Currency(1495, 'DKK'),
      monthly: new Currency(149, 'DKK'),
      trn: function(o) { return new Currency(0.6, 'DKK').scale(o.transactions); }
   }
},
{
   name: "DIBS Medium",
   logo: "dibs.svg",
   w: 115,
   h: 28,
   link: "http://dibs.dk",
   features: {
      antifraud: {
         setup: new Currency(495, 'DKK'),
         monthly: new Currency(49, 'DKK')
      }
   },
   acquirers: {
      Nets: true,
      Teller: true,
      Swedbank: true,
      Handelsbanken: true,
      Valitor: true,
      Elavon: true
   },
   cards: {
      dankort: true,
      visa: true,
      mastercard: true,
      maestro: true,
      amex: true,
      jcb: true,
      unionpay: true,
      diners: true,
      mobilepay: true
   },
   fees: {
      setup: new Currency(4995, 'DKK'),
      monthly: new Currency(499, 'DKK'),
      trn: function(o) { return new Currency(0.55, 'DKK').scale(o.transactions); }
   }
},
{
   name: "DIBS Premium",
   logo: "dibs.svg",
   w: 115,
   h: 28,
   link: "http://dibs.dk",
   features: {
      antifraud: {
         setup: new Currency(495, 'DKK'),
         monthly: new Currency(49, 'DKK')
      },
      recurring: true,
      multiacquirer: true
   },
   acquirers: {
      Nets: true,
      Teller: true,
      Swedbank: true,
      Handelsbanken: true,
      Valitor: true,
      Elavon: true
   },
   cards: {
      dankort: true,
      visa: true,
      mastercard: true,
      maestro: true,
      amex: true,
      jcb: true,
      unionpay: true,
      diners: true,
      mobilepay: true,
      forbrugsforeningen: true
   },
   fees: {
      setup: new Currency(10995, 'DKK'),
      monthly: new Currency(899, 'DKK'),
      trn: function(o) { return new Currency(0.5, 'DKK').scale(o.transactions); }
   }
},
{
   name: "ePay Light",
   logo: "epay.svg",
   w: 130,
   h: 29,
   link: "http://epay.dk",
   features: {
      antifraud: { trn: new Currency(0.3, 'DKK')}
   },
   acquirers: {
      Nets: true
   },
   cards: {
      dankort: true,
      mobilepay: true,
      forbrugsforeningen: true
   },
   fees: {
      setup: new Currency(399, 'DKK'),
      monthly: new Currency(99, 'DKK'),
      trn: function(o) { return new Currency(0.25, 'DKK').scale( Math.max(o.transactions - 250, 0) ); }
   }
},
{
   name: "ePay Pro",
   logo: "epay.svg",
   w: 130,
   h: 29,
   link: "http://epay.dk",
   features: {
      antifraud: { trn: new Currency(0.3, 'DKK')}
   },
   acquirers: {
      Nets: true,
      Teller: true,
      Clearhaus: true,
      Swedbank: true,
      Handelsbanken: true,
      Valitor: true,
      Elavon: true,
      Bambora: true
   },
   cards: {
      dankort: true,
      visa: true,
      mastercard: true,
      maestro: true,
      amex: true,
      jcb: true,
      unionpay: true,
      diners: true,
      mobilepay: true,
      forbrugsforeningen: true
   },
   fees: {
      setup: new Currency(599, 'DKK'),
      monthly: new Currency(199, 'DKK'),
      trn: function(o) { return new Currency(0.25, 'DKK').scale( Math.max(o.transactions - 250, 0) ); }
   }
},
{
   name: "ePay Business",
   logo: "epay.svg",
   w: 130,
   h: 29,
   link: "http://epay.dk",
   features: {
      antifraud: { trn: new Currency(0.3, 'DKK')},
      recurring: {
         monthly: function(o) { return (new Currency(1 / 12, 'DKK')).scale(o.transactions); }
      },
      multiacquirer: true
   },
   acquirers: {
      Nets: true,
      Teller: true,
      Clearhaus: true,
      Swedbank: true,
      Handelsbanken: true,
      Valitor: true,
      Elavon: true,
      Bambora: true
   },
   cards: {
      dankort: true,
      visa: true,
      mastercard: true,
      maestro: true,
      amex: true,
      jcb: true,
      unionpay: true,
      diners: true,
      mobilepay: true,
      forbrugsforeningen: true
   },
   fees: {
      setup: new Currency(999, 'DKK'),
      monthly: new Currency(299, 'DKK'),
      trn: function(o) { return new Currency(0.25, 'DKK').scale( Math.max(o.transactions - 500, 0) ); }
   }
},
{
   name: "Netaxept Start",
   logo: "netaxept.svg",
   w: 99,
   h: 27,
   link: "https://www.terminalshop.dk/Netaxept/",
   features: {
      antifraud: true
   },
   acquirers: {
      Nets: true,
      Teller: true
   },
   cards: {
      dankort: true,
      visa: true,
      mastercard: true
   },
   fees: {
      setup: new Currency(1005, 'DKK'),
      monthly: new Currency(180, 'DKK'),
      trn: function(o) { return new Currency(1.5, 'DKK').scale(o.transactions); }
   }
},
{
   name: "Netaxept Plus",
   logo: "netaxept.svg",
   w: 99,
   h: 27,
   link: "https://www.terminalshop.dk/Netaxept/",
   features: {
      antifraud: true
   },
   acquirers: {
      Nets: true,
      Teller: true,
      Swedbank: true,
      Nordea: true,
      Elavon: true
   },
   cards: {
      dankort: true,
      visa: true,
      mastercard: true,
      jcb: true,
      unionpay: true,
      diners: true
   },
   fees: {
      setup: new Currency(3016, 'DKK'),
      monthly: new Currency(502, 'DKK'),
      trn: function(o) { return new Currency(1, 'DKK').scale(o.transactions); }
   }
},
{
   name: "Netaxept Advanced",
   logo: "netaxept.svg",
   w: 99,
   h: 27,
   link: "https://www.terminalshop.dk/Netaxept/",
   features: {
      antifraud: true,
      recurring: {
         monthly: new Currency(250, 'DKK')
      }
   },
   acquirers: {
      Nets: true,
      Teller: true,
      Swedbank: true,
      Nordea: true,
      Elavon: true
   },
   cards: {
      dankort: true,
      visa: true,
      mastercard: true,
      amex: true,
      jcb: true,
      unionpay: true,
      diners: true
   },
   fees: {
      setup: new Currency(7540, 'DKK'),
      monthly: new Currency(703, 'DKK'),
      trn: function(o) { return new Currency(0.7, 'DKK').scale(o.transactions); }
   }
},
{
   name: "Payer",
   logo: "payer.svg",
   w: 117,
   h: 24,
   link: "http://payer.se/betallosning/",
   acquirers: {
      Swedbank: true,
      Handelsbanken: true,
      Nordea: true
   },
   cards: {
      visa: true,
      mastercard: true,
      maestro: true,
      amex: true,
      diners: true
   },
   fees: {
      setup: new Currency(1400, 'SEK'),
      monthly: new Currency(400, 'SEK'),
      trn: function(o) { return new Currency(2, 'SEK').scale(o.transactions); }
   }
},
{
   name: "Paylike",
   logo: "paylike.svg",
   w: 99,
   h: 31,
   link: "https://paylike.io",
   features: {
      antifraud: true
   },
   cards: {
      visa: true,
      mastercard: true,
      maestro: true
   },
   fees: {
      setup: new Currency(0, 'EUR'),
      monthly: new Currency(0, 'EUR'),
      trn: function(o) { return o.avgvalue.scale(2.5/100).add(new Currency(0.25, 'EUR')).scale(o.transactions); }
   }
},
{
   name: "Paymill",
   logo: "paymill.svg",
   w: 129,
   h: 24,
   link: "https://paymill.com",
   features: {
      antifraud: true,
      recurring: true
   },
   cards: {
      visa: true,
      mastercard: true,
      maestro: true,
      amex: true,
      jcb: true,
      unionpay: true,
      diners: true
   },
   fees: {
      // https://www.paymill.com/en/pricing
      setup: new Currency(0, 'EUR'),
      monthly: new Currency(0, 'EUR'),
      trn: function(o) { return o.avgvalue.scale(2.95/100).add(new Currency(0.28, 'EUR')).scale(o.transactions); }
   }
},
{
   name: "PayPal",
   logo: "paypal.svg",
   w: 127,
   h: 31,
   link: "https://paypal.com",
   features: {
      antifraud: true
   },
   cards: {
      visa: true,
      mastercard: true,
      maestro: true,
      amex: true,
      jcb: true,
      diners: true
   },
   fees: {
      // https://www.paypal.com/dk/webapps/mpp/paypal-fees
      setup: new Currency(0, 'DKK'),
      monthly: new Currency(0, 'DKK'),
      trn: function(o) {
         var oms = o.transactions * o.avgvalue.dkk();
         var fee = 1.9;
         if (oms <= 800000) { fee = 2.4; }
         if (oms <= 400000) { fee = 2.7; }
         if (oms <= 80000) { fee = 2.9; }
         if (oms <= 20000) { fee = 3.4; }
         return o.avgvalue.scale(fee/100).add(new Currency(2.6, 'DKK')).scale(o.transactions);
      }
   }
},
{
   name: "Payson",
   logo: "payson.png",
   w: 117,
   h: 31,
   link: "https://www.payson.se",
   features: {
      antifraud: true
   },
   cards: {
      visa: true,
      mastercard: true,
      maestro: true
   },
   fees: {
      setup: new Currency(0, 'SEK'),
      monthly: new Currency(0, 'SEK'),
      trn: function(o) { return o.avgvalue.scale(3/100).add(new Currency(3, 'SEK')).scale(o.transactions); }
   }
},
{
   name: "Payza",
   logo: "payza.svg",
   w: 107,
   h: 31,
   link: "https://payza.com",
   features: {
      antifraud: true
   },
   cards: {
      visa: true,
      mastercard: true,
      maestro: true
   },
   fees: {
      setup: new Currency(0, 'EUR'),
      monthly: new Currency(0, 'EUR'),
      trn: function(o) {
         return o.avgvalue.scale(2.5/100).add(new Currency(0.25, 'EUR')).scale(o.transactions);
      }
   }
},
{
   name: "QuickPay Starter",
   logo: "quickpay.svg",
   w: 138,
   h: 27,
   link: "https://quickpay.net/dk",
   features: {
      antifraud: true,
      recurring: true,
      multiacquirer: true
   },
   acquirers: {
      Nets: true,
      Teller: true,
      Clearhaus: true
   },
   cards: {
      dankort: true,
      visa: true,
      mastercard: true,
      maestro: true,
      amex: true,
      jcb: true,
      unionpay: true,
      diners: true,
      mobilepay: true,
      forbrugsforeningen: true
   },
   fees: {
      setup: new Currency(0, 'DKK'),
      monthly: new Currency(49, 'DKK'),
      trn: function(o) { return new Currency(1, 'DKK').scale(o.transactions); }
   }
},
{
   name: "QuickPay Professional",
   logo: "quickpay.svg",
   w: 138,
   h: 27,
   link: "https://quickpay.net/dk",
   features: {
      antifraud: true,
      recurring: true,
      multiacquirer: true
   },
   acquirers: {
      Nets: true,
      Teller: true,
      Clearhaus: true
   },
   cards: {
      dankort: true,
      visa: true,
      mastercard: true,
      maestro: true,
      amex: true,
      jcb: true,
      unionpay: true,
      diners: true,
      mobilepay: true,
      forbrugsforeningen: true
   },
   fees: {
      setup: new Currency(0, 'DKK'),
      monthly: new Currency(149, 'DKK'),
      trn: function(o) {
         return new Currency(0.25, 'DKK').scale( Math.max(o.transactions - 250, 0) );
      }
   }
},
{
   name: "Stripe",
   logo: "stripe.svg",
   w: 75,
   h: 31,
   link: "https://stripe.com",
   features: {
      antifraud: true,
      recurring: true
   },
   cards: {
      visa: true,
      mastercard: true,
      amex: true
   },
   fees: {
      setup: new Currency(0, 'DKK'),
      monthly: new Currency(0, 'DKK'),
      trn: function(o) { return o.avgvalue.scale(1.4/100).add(new Currency(1.8, 'DKK')).scale(o.transactions); }
   }
},
{
   name: "Verifone Basis",
   logo: "verifone.svg",
   w: 119,
   h: 23,
   link: "https://www.verifone.dk/da/Denmark/Start/E-handel/",
   acquirers: {
      Nets: true
   },
   cards: {
      dankort: true
   },
   fees: {
      setup: new Currency(395, 'DKK'),
      monthly: new Currency(99, 'DKK'),
      trn: function(o) { return new Currency(0.5, 'DKK').scale( Math.max(o.transactions - 250, 0) ); }
   }
},
{
   name: "Verifone Premium",
   logo: "verifone.svg",
   w: 119,
   h: 23,
   link: "https://www.verifone.dk/da/Denmark/Start/E-handel/",
   acquirers: {
      Nets: true,
      Swedbank: true,
      Handelsbanken: true,
      Nordea: true
   },
   cards: {
      dankort: true,
      visa: true,
      mastercard: true,
      maestro: true,
      amex: true,
      jcb: true,
      diners: true
   },
   fees: {
      setup: new Currency(595, 'DKK'),
      monthly: new Currency(199, 'DKK'),
      trn: function(o) { return new Currency(0.4, 'DKK').scale( Math.max(o.transactions - 250, 0) ); }
   }
},
{
   name: "Verifone PremiumPlus",
   logo: "verifone.svg",
   w: 119,
   h: 23,
   link: "https://www.verifone.dk/da/Denmark/Start/E-handel/",
   acquirers: {
      Nets: true,
      Swedbank: true,
      Handelsbanken: true,
      Nordea: true
   },
   cards: {
      dankort: true,
      visa: true,
      mastercard: true,
      maestro: true,
      amex: true,
      jcb: true,
      diners: true
   },
   fees: {
      setup: new Currency(1595, 'DKK'),
      monthly: new Currency(499, 'DKK'),
      trn: function(o) { return new Currency(0.3, 'DKK').scale( Math.max(o.transactions - 250, 0) ); }
   }
},
{
   name: "YourPay Feemium",
   logo: "yourpay.png",
   w: 115,
   h: 32,
   link: "http://www.yourpay.io",
   features: {
      antifraud: true
   },
   cards: {
      visa: true,
      mastercard: true,
      maestro: true
   },
   fees: {
      setup: new Currency(0, 'DKK'),
      monthly: new Currency(0, 'DKK'),
      trn: function(o) {
         return o.avgvalue.scale(2.25/100).add(new Currency(0.75, 'DKK')).scale(o.transactions);
      }
   }
},
{
   name: "YourPay Mini",
   logo: "yourpay.png",
   w: 115,
   h: 32,
   link: "http://www.yourpay.io",
   features: {
      antifraud: true
   },
   cards: {
      visa: true,
      mastercard: true,
      maestro: true
   },
   fees: {
      setup: new Currency(0, 'DKK'),
      monthly: new Currency(49, 'DKK'),
      trn: function(o) {
         var fixed = (new Currency(0.5, 'DKK')).scale( Math.max(o.transactions - 50, 0) );
         return o.avgvalue.scale(2.25/100).scale(o.transactions).add(fixed);
      }
   }
},
{
   name: "YourPay Pro",
   logo: "yourpay.png",
   w: 115,
   h: 32,
   link: "http://www.yourpay.io",
   features: {
      antifraud: true
   },
   cards: {
      visa: true,
      mastercard: true,
      maestro: true
   },
   fees: {
      setup: new Currency(0, 'DKK'),
      monthly: new Currency(149, 'DKK'),
      trn: function(o) {
         var fixed = (new Currency(0.25, 'DKK')).scale( Math.max(o.transactions - 75, 0) );
         return o.avgvalue.scale(1.75/100).scale(o.transactions).add(fixed);
      }
   }
},
{
   name: "YourPay Business",
   logo: "yourpay.png",
   w: 115,
   h: 32,
   link: "http://www.yourpay.io",
   features: {
      antifraud: true
   },
   cards: {
      visa: true,
      mastercard: true,
      maestro: true
   },
   fees: {
      setup: new Currency(0, 'DKK'),
      monthly: new Currency(259, 'DKK'),
      trn: function(o) {
         var fixed = (new Currency(0.15, 'DKK')).scale( Math.max(o.transactions - 500, 0) );
         return o.avgvalue.scale(1.35/100).scale(o.transactions).add(fixed);
      }
   }
},
{
   name: "2checkout",
   logo: "2checkout.svg",
   w: 127,
   h: 15,
   link: "https://www.2checkout.com",
   features: {
      antifraud: true,
      recurring: true
   },
   cards: {
      visa: true,
      mastercard: true,
      maestro: true,
      amex: true,
      jcb: true,
      unionpay: true,
      diners: true
   },
   fees: {
      setup: new Currency(0, 'USD'),
      monthly: new Currency(0, 'USD'),
      trn: function(o) {
         return o.avgvalue.scale(2.4/100).add(new Currency(0.3, 'USD')).scale(o.transactions);
      }
   }
}];
