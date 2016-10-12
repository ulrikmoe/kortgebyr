/**
*   @author Ulrik Moe, Christian Blach, Joakim Sindholt
*   @license GPLv3
*   Indentation: 4 spaces
**/


const CARDs = {
    mobilepay: {
        setup: new Currency(49, 'DKK'),
        monthly: new Currency(49, 'DKK'),
        trn(o) { return (new Currency(1, 'DKK')).scale(o.transactions / 20); }
    },
    forbrugsforeningen: {
        setup: new Currency(0, 'DKK'),
        monthly: new Currency(0, 'DKK'),
        trn: new Currency(0, 'DKK')
    }
};

const ACQs = [
    {
        name: 'Nets',
        logo: 'nets.svg',
        w: 37,
        h: 14,
        link: 'http://www.nets.eu',
        //cardss: ['dankort', CARDs.forbrugsforeningen, 'mobilepay'],
        cards: {
            dankort: true,
            forbrugsforeningen: CARDs.forbrugsforeningen,
            mobilepay: true
        },
        fees: {
            setup: new Currency(250, 'DKK'),
            monthly: new Currency(1000 / 12, 'DKK'),
            trn(o) {
                let avgvalue = o.avgvalue.dkk();
                if (avgvalue <= 50) { return new Currency(0.7, 'DKK'); }
                else if (avgvalue <= 100) { return new Currency(1.1, 'DKK'); }
                else { return new Currency(1.39, 'DKK'); }
            }
        }
    },
    {
        name: 'Teller',
        logo: 'teller.svg',
        w: 59,
        h: 11,
        link: 'http://www.teller.com',
        //cardss: ['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'unionpay', 'diners', 'mobilepay'],
        cards: {
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
            setup: new Currency(1000, 'DKK'),
            monthly: new Currency(149, 'DKK'),
            trn(o) {
                let trnfee = o.avgvalue.scale(1.34 / 100).add(new Currency(0.19, 'DKK'));
                if (trnfee.dkk() < 0.7) { trnfee = new Currency(0.7, 'DKK'); }
                return trnfee;
            }
        }
    },
    {
        name: 'Handelsbanken',
        logo: 'handelsbanken.svg',
        w: 90,
        h: 9,
        link: 'http://www.handelsbanken.dk',
        //cardss: ['visa', 'mastercard', 'maestro'],
        cards: {
            visa: true,
            mastercard: true,
            maestro: true
        },
        fees: {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(0, 'DKK'),
            trn(o) { return o.avgvalue.scale(1.5 / 100); }
        }
    },
    {
        name: 'Swedbank',
        logo: 'swedbank.png',
        w: 62,
        h: 10,
        link: 'http://www.swedbank.dk',
        //cardss: ['visa', 'mastercard', 'maestro'],
        cards: {
            visa: true,
            mastercard: true,
            maestro: true
        },
        fees: {
            setup: new Currency(1900, 'DKK'),
            monthly: new Currency(100, 'DKK'),
            trn(o) { return o.avgvalue.scale(1.6 / 100); }
        }
    },
    {
        name: 'Valitor',
        logo: 'valitor.png',
        w: 61,
        h: 9,
        link: 'http://www.valitor.com',
        //cardss: ['visa', 'mastercard', 'maestro'],
        cards: {
            visa: true,
            mastercard: true,
            maestro: true,
        },
        fees: {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(0, 'DKK'),
            trn(o) { return o.avgvalue.scale(1.5 / 100); }
        }
    },
    {
        name: 'Elavon',
        logo: 'elavon.svg',
        w: 51,
        h: 14,
        link: 'http://www.elavon.com',
        //cardss: ['visa', 'mastercard', 'maestro'],
        cards: {
            visa: true,
            mastercard: true,
            maestro: true
        },
        fees: {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(0, 'DKK'),
            trn(o) { return o.avgvalue.scale(1.6 / 100); }
        }
    },
    {
        name: 'Clearhaus',
        logo: 'clearhaus.svg',
        w: 72,
        h: 14,
        link: 'https://www.clearhaus.com',
        //cardss: ['visa', 'mastercard', 'maestro', 'mobilepay'],
        cards: {
            visa: true,
            mastercard: true,
            maestro: true,
            mobilepay: true
        },
        fees: {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(0, 'DKK'),
            trn(o) {
                let trnfee = o.avgvalue.scale(1.45 / 100);
                if (trnfee.dkk() < 0.6) { trnfee = new Currency(0.6, 'DKK'); }
                return trnfee;
            }
        }
    },
    {
        name: 'Bambora',
        logo: 'bambora.svg',
        w: 71,
        h: 13,
        link: 'http://www.bambora.com/',
        //cardss: ['visa', 'mastercard', 'maestro'],
        cards: {
            visa: true,
            mastercard: true,
            maestro: true
        },
        fees: {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(0, 'DKK'),
            trn(o) { return o.avgvalue.scale(1.45 / 100); }
        }
    }
];

let PSPs = [
    {
        name: 'Braintree',
        logo: 'braintree.svg',
        w: 116,
        h: 16,
        link: 'https://www.braintreepayments.com',
        features: {
            antifraud: true,
            '3-D secure': true,
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
            trn(o) { return o.avgvalue.scale(1.9 / 100).add(new Currency(2.25, 'DKK')).scale(o.transactions); }
        }
    },
    {
        name: 'Certitrade',
        logo: 'certitrade.svg',
        w: 125,
        h: 25,
        link: 'https://certitrade.se',
        features: {
            antifraud: true,
            '3-D secure': true,
            recurring: true
        },
        acquirers: {
            Bambora: true,
            Clearhaus: true,
            Swedbank: true,
            Handelsbanken: true,
            Nordea: true,
            Elavon: true
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
            trn(o) { return o.avgvalue.scale(0.9 / 100).add(new Currency(1.5, 'SEK')).scale(o.transactions); }
        }
    },
    {
        name: 'Checkout.com',
        logo: 'checkoutcom.svg',
        w: 145,
        h: 15,
        link: 'https://www.checkout.com',
        features: {
            antifraud: true,
            '3-D secure': true,
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
            setup: new Currency(0, 'EUR'),
            monthly: new Currency(0, 'EUR'),
            trn(o) { return o.avgvalue.scale(1.5 / 100).add(new Currency(0.15, 'GBP')).scale(o.transactions); }
        }
    },
    {
        name: 'DanDomain',
        logo: 'dandomain.svg',
        w: 135,
        h: 25,
        link: 'https://www.dandomain.dk/webshop/betalingssystem',
        features: {
            '3-D secure': {
                setup: new Currency(0, 'DKK'),
                monthly: new Currency(99, 'DKK'),
                trn: new Currency(0, 'DKK')
            }
        },
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
            mobilepay: CARDs.mobilepay,
            forbrugsforeningen: CARDs.forbrugsforeningen
        },
        fees: {
            setup: new Currency(199, 'DKK'),
            monthly: new Currency(149, 'DKK'),
            trn(o) { return new Currency(0, 'DKK'); }
        }
    },
    {
        name: 'DIBS Start',
        logo: 'dibs.svg',
        w: 115,
        h: 28,
        link: 'http://dibs.dk',
        features: {
            '3-D secure': {
                setup: new Currency(495, 'DKK'),
                monthly: new Currency(49, 'DKK'), // Ring og spørg.
                trn: new Currency(0, 'DKK')
            },
            antifraud: {
                setup: new Currency(495, 'DKK'),
                monthly: new Currency(49, 'DKK'),
                trn: new Currency(0, 'DKK')
            },
            recurring: {
                setup: new Currency(495, 'DKK'),
                monthly: new Currency(49, 'DKK'),
                trn: new Currency(0, 'DKK')
            }
        },
        acquirers: {
            Nets: true
        },
        cards: {
            dankort: true,
            mobilepay: CARDs.mobilepay
        },
        fees: {
            setup: new Currency(1495, 'DKK'),
            monthly: new Currency(149, 'DKK'),
            trn(o) { return new Currency(0.6, 'DKK').scale(o.transactions); }
        }
    },
    {
        name: 'DIBS Medium',
        logo: 'dibs.svg',
        w: 115,
        h: 28,
        link: 'http://dibs.dk',
        features: {
            '3-D secure': true, // følger gratis med
            antifraud: {
                setup: new Currency(495, 'DKK'),
                monthly: new Currency(49, 'DKK'),
                trn: new Currency(0, 'DKK')
            },
            recurring: {
                setup: new Currency(495, 'DKK'),
                monthly: new Currency(49, 'DKK'),
                trn: new Currency(0, 'DKK')
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
            mobilepay: CARDs.mobilepay
        },
        fees: {
            setup: new Currency(4995, 'DKK'),
            monthly: new Currency(499, 'DKK'),
            trn(o) { return new Currency(0.55, 'DKK').scale(o.transactions); }
        }
    },
    {
        name: 'DIBS Premium',
        logo: 'dibs.svg',
        w: 115,
        h: 28,
        link: 'http://dibs.dk',
        features: {
            '3-D secure': true, // følger gratis med
            antifraud: {
                setup: new Currency(495, 'DKK'),
                monthly: new Currency(49, 'DKK'),
                trn: new Currency(0, 'DKK')
            },
            recurring: true
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
            mobilepay: CARDs.mobilepay,
            forbrugsforeningen: CARDs.forbrugsforeningen
        },
        fees: {
            setup: new Currency(10995, 'DKK'),
            monthly: new Currency(899, 'DKK'),
            trn(o) { return new Currency(0.5, 'DKK').scale(o.transactions); }
        }
    },
    {
        name: 'ePay Light',
        logo: 'epay.svg',
        w: 130,
        h: 29,
        link: 'http://epay.dk',
        features: {
            '3-D secure': true,
            antifraud: {
                setup: new Currency(0, 'DKK'),
                monthly: new Currency(0, 'DKK'),
                trn(o) { return new Currency(0.3, 'DKK').scale(o.transactions); }
            }
        },
        acquirers: {
            Nets: true
        },
        cards: {
            dankort: true,
            mobilepay: CARDs.mobilepay,
            forbrugsforeningen: CARDs.forbrugsforeningen
        },
        fees: {
            setup: new Currency(399, 'DKK'),
            monthly: new Currency(99, 'DKK'),
            trn(o) {
                return new Currency(0.25, 'DKK').scale(Math.max(o.transactions - 250, 0));
            }
        }
    },
    {
        name: 'ePay Pro',
        logo: 'epay.svg',
        w: 130,
        h: 29,
        link: 'http://epay.dk',
        features: {
            '3-D secure': true,
            antifraud: {
                setup: new Currency(0, 'DKK'),
                monthly: new Currency(0, 'DKK'),
                trn(o) { return new Currency(0.3, 'DKK').scale(o.transactions); }
            }
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
            mobilepay: CARDs.mobilepay,
            forbrugsforeningen: CARDs.forbrugsforeningen
        },
        fees: {
            setup: new Currency(599, 'DKK'),
            monthly: new Currency(199, 'DKK'),
            trn(o) {
                return new Currency(0.25, 'DKK').scale(Math.max(o.transactions - 250, 0));
            }
        }
    },
    {
        name: 'ePay Business',
        logo: 'epay.svg',
        w: 130,
        h: 29,
        link: 'http://epay.dk',
        features: {
            '3-D secure': true,
            antifraud: {
                setup: new Currency(0, 'DKK'),
                monthly: new Currency(0, 'DKK'),
                trn(o) { return new Currency(0.3, 'DKK').scale(o.transactions); }
            },
            recurring: {
                setup: new Currency(0, 'DKK'),
                monthly(o) { return (new Currency(1 / 12, 'DKK')).scale(o.transactions); },
                trn: new Currency(0, 'DKK')
            }
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
            mobilepay: CARDs.mobilepay,
            forbrugsforeningen: CARDs.forbrugsforeningen
        },
        fees: {
            setup: new Currency(999, 'DKK'),
            monthly: new Currency(299, 'DKK'),
            trn(o) {
                return new Currency(0.25, 'DKK').scale(Math.max(o.transactions - 500, 0));
            }
        }
    },
    {
        name: 'ePay Pro+', // Bambora
        logo: 'epay.svg',
        w: 130,
        h: 29,
        link: 'http://www.epay.dk/bambora/',
        features: {
            '3-D secure': true,
            antifraud: {
                setup: new Currency(0, 'DKK'),
                monthly: new Currency(0, 'DKK'),
                trn(o) { return new Currency(0.3, 'DKK').scale(o.transactions); }
            }
        },
        cards: {
            visa: true,
            mastercard: true,
            maestro: true
        },
        fees: {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(149, 'DKK'),
            trn(o) {
                let gatewayfee = new Currency(0.25, 'DKK').scale(Math.max(o.transactions - 250, 0));
                let acqfee = o.avgvalue.scale(1.45 / 100).add(new Currency(0.25, 'DKK')).scale(o.transactions);
                return acqfee.add(gatewayfee);
            }
        }
    },
    {
        name: 'Netaxept Start',
        logo: 'netaxept.svg',
        w: 99,
        h: 27,
        link: 'https://shop.nets.eu/da/web/dk/e-commerce',
        features: {
            '3-D secure': true,
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
            trn(o) { return new Currency(1.5, 'DKK').scale(o.transactions); }
        }
    },
    {
        name: 'Netaxept Advanced',
        logo: 'netaxept.svg',
        w: 99,
        h: 27,
        link: 'https://shop.nets.eu/da/web/dk/e-commerce',
        features: {
            '3-D secure': true,
            antifraud: true,
            recurring: {
                setup: new Currency(0, 'DKK'),
                monthly: new Currency(250, 'DKK'),
                trn: new Currency(0, 'DKK')
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
            trn(o) { return new Currency(0.7, 'DKK').scale(o.transactions); }
        }
    },
    {
        name: 'Payer',
        logo: 'payer.svg',
        w: 117,
        h: 24,
        link: 'http://payer.se/betallosning/',
        features: {
            '3-D secure': true,
            antifraud: true
        },
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
            diners: true,
            swish: true
        },
        fees: {
            setup: new Currency(1400, 'SEK'),
            monthly: new Currency(400, 'SEK'),
            trn(o) { return new Currency(2, 'SEK').scale(o.transactions); }
        }
    },
    {
        name: 'Paylike',
        logo: 'paylike.svg',
        w: 99,
        h: 31,
        link: 'https://paylike.io',
        features: {
            '3-D secure': true,
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
            trn(o) { return o.avgvalue.scale(2.5 / 100).add(new Currency(0.25, 'EUR')).scale(o.transactions); }
        }
    },
    {
        name: 'Paymill',
        logo: 'paymill.svg',
        w: 129,
        h: 24,
        link: 'https://paymill.com',
        features: {
            '3-D secure': true,
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
            setup: new Currency(0, 'EUR'),
            monthly: new Currency(0, 'EUR'),
            trn(o) { return o.avgvalue.scale(2.95 / 100).add(new Currency(0.28, 'EUR')).scale(o.transactions); }
        }
    },
    {
        name: 'PayPal',
        logo: 'paypal.svg',
        w: 127,
        h: 31,
        link: 'https://www.paypal.com/dk/webapps/mpp/merchant',
        features: {
            '3-D secure': true,
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
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(0, 'DKK'),
            trn(o) {
                let oms = o.transactions * o.avgvalue.dkk();
                let fee = 1.9;
                if (oms <= 800000) { fee = 2.4; }
                if (oms <= 400000) { fee = 2.7; }
                if (oms <= 80000) { fee = 2.9; }
                if (oms <= 20000) { fee = 3.4; }
                return o.avgvalue.scale(fee / 100).add(new Currency(2.6, 'DKK')).scale(o.transactions);
            }
        }
    },
    {
        name: 'Payson',
        logo: 'payson.png',
        w: 117,
        h: 31,
        link: 'https://www.payson.se',
        features: {
            '3-D secure': true,
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
            trn(o) { return o.avgvalue.scale(2.85 / 100).scale(o.transactions); }
        }
    },
    {
        name: 'Payza',
        logo: 'payza.svg',
        w: 107,
        h: 31,
        link: 'https://payza.com',
        features: {
            '3-D secure': true,
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
            trn(o) {
                return o.avgvalue.scale(2.9 / 100).add(new Currency(0.3, 'EUR')).scale(o.transactions);
            }
        }
    },
    {
        name: 'QuickPay Basic',
        logo: 'quickpay.svg',
        w: 138,
        h: 27,
        link: 'https://quickpay.net/dk',
        features: {
            '3-D secure': true,
            antifraud: true,
            recurring: true
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
            mobilepay: CARDs.mobilepay,
            forbrugsforeningen: CARDs.forbrugsforeningen
        },
        fees: {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(0, 'DKK'),
            trn(o) { return new Currency(5, 'DKK').scale(o.transactions); }
        }
    },
    {
        name: 'QuickPay Starter',
        logo: 'quickpay.svg',
        w: 138,
        h: 27,
        link: 'https://quickpay.net/dk',
        features: {
            '3-D secure': true,
            antifraud: true,
            recurring: true
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
            mobilepay: CARDs.mobilepay,
            forbrugsforeningen: CARDs.forbrugsforeningen
        },
        fees: {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(49, 'DKK'),
            trn(o) { return new Currency(1, 'DKK').scale(o.transactions); }
        }
    },
    {
        name: 'QuickPay Professional',
        logo: 'quickpay.svg',
        w: 138,
        h: 27,
        link: 'https://quickpay.net/dk',
        features: {
            '3-D secure': true,
            antifraud: true,
            recurring: true
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
            mobilepay: CARDs.mobilepay,
            forbrugsforeningen: CARDs.forbrugsforeningen
        },
        fees: {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(149, 'DKK'),
            trn(o) {
                return new Currency(0.25, 'DKK').scale(Math.max(o.transactions - 250, 0));
            }
        }
    },
    {
        name: 'Stripe',
        logo: 'stripe.svg',
        w: 75,
        h: 31,
        link: 'https://stripe.com',
        features: {
            '3-D secure': true,
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
            trn(o) { return o.avgvalue.scale(1.4 / 100).add(new Currency(1.8, 'DKK')).scale(o.transactions); }
        }
    },
    {
        name: 'YourPay',
        logo: 'yourpay.png',
        w: 115,
        h: 32,
        link: 'https://www.yourpay.io',
        features: {
            '3-D secure': true,
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
            trn(o) {
                return o.avgvalue.scale(2.25 / 100).scale(o.transactions);
            }
        }
    },
    {
        name: '2checkout',
        logo: '2checkout.svg',
        w: 127,
        h: 15,
        link: 'https://www.2checkout.com',
        features: {
            '3-D secure': true,
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
            trn(o) {
                return o.avgvalue.scale(2.4 / 100).add(new Currency(0.3, 'USD')).scale(o.transactions);
            }
        }
    },
    {
        name: 'PayEx One',
        logo: 'payex.svg',
        w: 100,
        h: 32,
        link: 'http://payex.dk/tjenester/e-handel/',
        features: {
            '3-D secure': true,
            antifraud: true,
            recurring: true
        },
        cards: {
            visa: true,
            mastercard: true,
            maestro: true,
            mobilepay: CARDs.mobilepay
        },
        fees: {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(299, 'DKK'),
            trn(o) {
                return o.avgvalue.scale(1 / 100).add(new Currency(1.5, 'DKK')).scale(o.transactions);
            }
        }
    },
    {
        name: 'Wannafind',
        logo: 'wannafind.svg',
        w: 135,
        h: 18,
        link: 'https://www.wannafind.dk/betalingssystem/',
        features: {
            '3-D secure': {
                setup: new Currency(0, 'DKK'),
                monthly: new Currency(49, 'DKK'),
                trn: new Currency(0, 'DKK')
            },
            recurring: {
                setup: new Currency(0, 'DKK'),
                monthly: new Currency(99, 'DKK'),
                trn: new Currency(0, 'DKK')
            },
            antifraud: true
        },
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
            mobilepay: CARDs.mobilepay,
            forbrugsforeningen: CARDs.forbrugsforeningen
        },
        fees: {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(149, 'DKK'),
            trn(o) { return new Currency(0, 'DKK'); }
        }
    },
    {
        name: 'PensoPay Basis',
        logo: 'pensopay.svg',
        w: 134,
        h: 35,
        link: 'https://pensopay.com/',
        features: {
            '3-D secure': true,
            recurring: {
                setup: new Currency(0, 'DKK'),
                monthly: new Currency(0, 'DKK'),
                trn: new Currency(0.20, 'DKK')
            },
            antifraud: true
        },
        cards: {
            visa: true,
            mastercard: true,
            maestro: true,
            mobilepay: CARDs.mobilepay
        },
        fees: {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(0, 'DKK'),
            trn(o) { return o.avgvalue.scale(1.45 / 100).add(new Currency(5, 'DKK')).scale(o.transactions); }
        }
    },
    {
        name: 'PensoPay Iværksætter',
        logo: 'pensopay.svg',
        w: 134,
        h: 35,
        link: 'https://pensopay.com/',
        features: {
            '3-D secure': true,
            recurring: {
                setup: new Currency(0, 'DKK'),
                monthly: new Currency(0, 'DKK'),
                trn: new Currency(0.20, 'DKK')
            },
            antifraud: true
        },
        cards: {
            visa: true,
            mastercard: true,
            maestro: true,
            mobilepay: CARDs.mobilepay
        },
        fees: {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(59, 'DKK'),
            trn(o) { return o.avgvalue.scale(1.45 / 100).add(new Currency(1, 'DKK')).scale(o.transactions); }
        }
    },
    {
        name: 'PensoPay Business',
        logo: 'pensopay.svg',
        w: 134,
        h: 35,
        link: 'https://pensopay.com/vores-betalingsloesninger/',
        features: {
            '3-D secure': true,
            recurring: {
                setup: new Currency(0, 'DKK'),
                monthly: new Currency(0, 'DKK'),
                trn: new Currency(0.20, 'DKK')
            },
            antifraud: true
        },
        cards: {
            visa: true,
            mastercard: true,
            maestro: true,
            mobilepay: CARDs.mobilepay
        },
        fees: {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(99, 'DKK'),
            trn(o) {
                return o.avgvalue.scale(1.4 / 100).scale(o.transactions).add(new Currency(0.35, 'DKK').scale(Math.max(o.transactions - 100, 0)));
            }
        }
    },
    {
        name: 'PensoPay Pro',
        logo: 'pensopay.svg',
        w: 134,
        h: 35,
        link: 'https://pensopay.com/',
        features: {
            '3-D secure': true,
            recurring: {
                setup: new Currency(0, 'DKK'),
                monthly: new Currency(0, 'DKK'),
                trn: new Currency(0.20, 'DKK')
            },
            antifraud: true
        },
        cards: {
            visa: true,
            mastercard: true,
            maestro: true,
            mobilepay: CARDs.mobilepay
        },
        fees: {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(149, 'DKK'),
            trn(o) {
                return o.avgvalue.scale(1.35 / 100).scale(o.transactions).add(new Currency(0.25, 'DKK').scale(Math.max(o.transactions - 250, 0)));
            }
        }
    }
];
