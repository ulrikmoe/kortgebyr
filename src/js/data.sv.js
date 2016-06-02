/**
*   First shalt thou take out the Holy Pin. Then...
*   @author Ulrik Moe, Christian Blach, Joakim Sindholt
*   @license GPLv3
*
*   Indentation: 4 spaces
*   Conventions: https://github.com/airbnb/javascript
*
*   Resellers: Scannet, PensoPay, Wannafind ...
*
**/


let PSPs = [
    {
        name: 'ePay Pro',
        logo: 'epay.svg',
        w: 130,
        h: 29,
        link: 'http://epay.dk',
        features: {
            '3-D secure': true,
            antifraud: {
                setup: new Currency(0, 'SEK'),
                monthly: new Currency(0, 'SEK'),
                trn(o) { return new Currency(0.5, 'SEK').scale(o.transactions); }
            },
            recurring: {
                setup: new Currency(0, 'SEK'),
                monthly(o) { return (new Currency(1 / 12, 'SEK')).scale(o.transactions); },
                trn: new Currency(0, 'SEK')
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
            mobilepay: CARDs.mobilepay
        },
        fees: {
            setup: new Currency(995, 'SEK'),
            monthly: new Currency(299, 'SEK'),
            trn(o) { return new Currency(2, 'SEK').scale(o.transactions); }
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
            mobilepay: CARDs.mobilepay,
            forbrugsforeningen: CARDs.forbrugsforeningen
        },
        fees: {
            setup: new Currency(0, 'SEK'),
            monthly: new Currency(0, 'SEK'),
            trn(o) { return new Currency(7.5, 'SEK').scale(o.transactions); }
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
            mobilepay: CARDs.mobilepay,
            forbrugsforeningen: CARDs.forbrugsforeningen
        },
        fees: {
            setup: new Currency(0, 'SEK'),
            monthly: new Currency(99, 'SEK'),
            trn(o) { return new Currency(1.75, 'SEK').scale(o.transactions); }
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
            mobilepay: CARDs.mobilepay,
            forbrugsforeningen: CARDs.forbrugsforeningen
        },
        fees: {
            setup: new Currency(0, 'SEK'),
            monthly: new Currency(199, 'SEK'),
            trn(o) {
                return new Currency(1, 'SEK').scale(Math.max(o.transactions - 250, 0));
            }
        }
    },
    {
        name: 'PayEx One',
        logo: 'payex.svg',
        w: 127,
        h: 15,
        link: 'http://payex.se/tjanster/e-handel/',
        features: {
            '3-D secure': true,
            antifraud: true,
            recurring: true
        },
        cards: {
            visa: true,
            mastercard: true,
            maestro: true,
            swish: true
        },
        fees: {
            setup: new Currency(0, 'SEK'),
            monthly: new Currency(199, 'SEK'),
            trn(o) {
                return o.avgvalue.scale(2.5 / 100).add(new Currency(2.5, 'SEK')).scale(o.transactions);
            }
        }
    },
    {
        name: 'PayEx One',
        logo: 'payex.svg',
        w: 127,
        h: 15,
        link: 'http://payex.se/tjanster/e-handel/',
        features: {
            '3-D secure': true,
            antifraud: true,
            recurring: true
        },
        cards: {
            visa: true,
            mastercard: true,
            maestro: true,
            swish: true
        },
        fees: {
            setup: new Currency(0, 'SEK'),
            monthly: new Currency(199, 'SEK'),
            trn(o) {
                return o.avgvalue.scale(1.75 / 100).add(new Currency(1.75, 'SEK')).scale(o.transactions);
            }
        }
    }
];
