/**
*   @author Ulrik Moe, Christian Blach, Joakim Sindholt
*   @license GPLv3
**/

const Mobilepay = {
    title: 'mobilepay',
    monthly: new Currency(49, 'DKK')
};

const ACQs = [
    {
        name: 'Teller',
        logo: 'teller.svg',
        link: 'https://www.nets.eu/dk/payments/online-betalinger/',
        cards: ['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners', 'mobilepay'],
        fees: {
            setup: new Currency(1000, 'DKK'),
            monthly: new Currency(149, 'DKK'),
            trn() {
                const trnfee = $avgvalue.scale(1.34 / 100).add(new Currency(0.19, 'DKK'));
                return (trnfee.dkk() > 0.7) ? trnfee : new Currency(0.7, 'DKK');
            }
        }
    },
    {
        name: 'Handelsbanken',
        logo: 'handelsbanken.svg',
        link: 'https://handelsbanken.dk/shb/inet/icentda.nsf/Default/' +
            'qC21926A235427DE6C12578810023DBB9?Opendocument',
        cards: ['visa', 'mastercard', 'maestro'],
        fees: {
            trn() {
                return $avgvalue.scale(1.5 / 100);
            }
        }
    },
    {
        name: 'Swedbank',
        logo: 'swedbank.png',
        link: 'https://www.swedbank.dk/card-services/priser-og-vilkar/#!/CID_2263482',
        cards: ['visa', 'mastercard', 'maestro', 'mobilepay'],
        fees: {
            trn() {
                // TODO: Add minimum fee of 50 DKK / month.
                return $avgvalue.scale(1.1 / 100);
            }
        }
    },
    {
        name: 'Valitor',
        logo: 'valitor.png',
        link: 'https://www.valitor.com/acquiring-services/online-payments/',
        cards: ['visa', 'mastercard', 'maestro'],
        fees: {
            trn() {
                return $avgvalue.scale(1.5 / 100);
            }
        }
    },
    {
        name: 'Elavon',
        logo: 'elavon.svg',
        link: 'https://www.elavon.dk/v%C3%A5re-tjenester/sm%C3%A5-bedrifter',
        cards: ['visa', 'mastercard', 'maestro'],
        fees: {
            trn() {
                return $avgvalue.scale(1.6 / 100);
            }
        }
    },
    {
        name: 'Clearhaus',
        logo: 'clearhaus.svg',
        link: 'https://www.clearhaus.com/dk/',
        cards: ['visa', 'mastercard', 'maestro', 'mobilepay'],
        fees: {
            trn() {
                // 1.45% (min. 0.6 DKK)
                const trnfee = $avgvalue.scale(1.45 / 100);
                return trnfee.dkk() > 0.6 ? trnfee : new Currency(0.7, 'DKK');
            }
        }
    },
    {
        name: 'Bambora',
        logo: 'bambora.svg',
        link: 'http://www.bambora.com/',
        cards: ['visa', 'mastercard', 'maestro'],
        fees: {
            trn() {
                return $avgvalue.scale(1.45 / 100);
            }
        }
    }
];


const PSPs = [
    {
        name: 'Braintree',
        logo: 'braintree.svg',
        link: 'https://www.braintreepayments.com',
        cards: ['visa', 'mastercard', 'maestro'],
        features: ['antifraud', 'recurring'],
        fees: {
            trn() {
                return $revenue.scale(1.9 / 100).add(new Currency(2.65 * $qty, 'SEK'));
            }
        }
    },
    {
        name: 'Certitrade',
        logo: 'certitrade.svg',
        link: 'https://certitrade.se',
        acqs: ['Bambora', 'Clearhaus', 'Swedbank', 'Handelsbanken', 'Elavon'],
        cards: ['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners'],
        features: ['antifraud', 'recurring'],
        fees: {
            monthly: new Currency(206, 'SEK'), // 48/7*30
            trn() {
                return $revenue.scale(0.9 / 100).add(new Currency(1.5 * $qty, 'SEK'));
            }
        }
    },
    {
        name: 'Checkout.com',
        logo: 'checkoutcom.svg',
        link: 'https://www.checkout.com',
        cards: ['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners'],
        features: ['antifraud', 'recurring'],
        fees: {
            trn() {
                return $revenue.scale(0.95 / 100).add(new Currency(0.20 * $qty, 'GBP'));
            }
        }
    },
    {
        name: 'DanDomain',
        logo: 'dandomain.svg',
        link: 'https://www.dandomain.dk/webshop/betalingssystem',
        acqs: ['Teller'],
        cards: ['visa', 'mastercard', 'maestro', 'amex', 'jcb',
                'diners', Mobilepay],
        features: [],
        fees: {
            setup: new Currency(199, 'DKK'),
            monthly: new Currency(149, 'DKK')
        }
    },
    {
        name: 'DIBS Basic',
        logo: 'dibs.svg',
        link: 'http://dibs.dk',
        acqs: ['Nets', 'Teller', 'Swedbank', 'Handelsbanken', 'Valitor', 'Elavon'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners', Mobilepay],
        features: [
            {
                title: 'Recurring',
                setup: new Currency(495, 'DKK'),
                monthly: new Currency(49, 'DKK'),
            }
        ],
        fees: {
            setup: new Currency(599, 'DKK'),
            monthly: new Currency(199, 'DKK'),
            trn() {
                if ($qty > 250) {
                    return new Currency(0.35 * ($qty - 250), 'DKK');
                }
                return false;
            }
        }
    },
    {
        name: 'Bambora',
        logo: 'bambora.svg',
        link: 'https://www.bambora.com/sv/se/e-handel/oversikt-ehandel/',
        cards: ['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners'],
        features: [],
        fees: {
            monthly: new Currency(245, 'DKK'),
            trn() {
                return $revenue.scale(2.45 / 100);
            }
        }
    },
    {
        name: 'Netaxept Start',
        logo: 'netaxept.svg',
        link: 'https://shop.nets.eu/da/web/dk/e-commerce',
        acqs: ['Nets', 'Teller'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro'],
        features: ['antifraud'],
        fees: {
            setup: new Currency(2490, 'SEK'),
            monthly: new Currency(349, 'SEK'),
            trn() {
                return new Currency(1.5 * $qty, 'SEK');
            }
        }
    },
    {
        name: 'Netaxept Advanced',
        logo: 'netaxept.svg',
        link: 'https://shop.nets.eu/da/web/dk/e-commerce',
        acqs: ['Nets', 'Teller', 'Swedbank', 'Elavon'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners'],
        features: ['antifraud', 'recurring'],
        fees: {
            setup: new Currency(5490, 'SEK'),
            monthly: new Currency(849, 'SEK'),
            trn() {
                return new Currency(0.7 * $qty, 'SEK');
            }
        }
    },
    {
        name: 'Payer',
        logo: 'payer.svg',
        link: 'http://payer.se/betallosning/',
        acqs: ['Swedbank', 'Handelsbanken'],
        cards: ['visa', 'mastercard', 'maestro', 'amex', 'diners'],
        features: ['antifraud'],
        fees: {
            setup: new Currency(1400, 'SEK'),
            monthly: new Currency(400, 'SEK'),
            trn() {
                return new Currency(2 * $qty, 'SEK');
            }
        }
    },
    {
        name: 'Paylike',
        logo: 'paylike.svg',
        link: 'https://paylike.dk',
        features: ['antifraud'],
        cards: ['visa', 'mastercard', 'maestro'],
        fees: {
            trn() {
                return $revenue.scale(1.9 / 100).add(new Currency(0.25 * $qty, 'EUR'));
            }
        }
    },
    {
        name: 'Paymill',
        logo: 'paymill.svg',
        link: 'https://paymill.com',
        cards: ['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners'],
        features: ['antifraud', 'recurring'],
        fees: {
            trn() {
                return $revenue.scale(2.95 / 100).add(new Currency(0.28 * $qty, 'EUR'));
            }
        }
    },
    {
        name: 'PayPal',
        logo: 'paypal.svg',
        link: 'https://www.paypal.com/dk/webapps/mpp/merchant',
        cards: ['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners'],
        features: ['antifraud'],
        fees: {
            trn() {
                const k = $revenue.dkk() / 1000;
                const fee = (k <= 20) ? 3.4 : (k <= 80) ? 2.9 :
                            (k <= 400) ? 2.7 : (k <= 800) ? 2.4 : 1.9;
                return $revenue.scale(fee / 100).add(new Currency(2.6 * $qty, 'DKK'));
            }
        }
    },
    {
        name: 'Payson',
        logo: 'payson.png',
        link: 'https://www.payson.se',
        features: ['antifraud'],
        cards: ['visa', 'mastercard', 'maestro'],
        fees: {
            trn() {
                const minimum = new Currency(4.5 * $qty, 'SEK');
                const fees = $revenue.scale(2.85 / 100);
                if (minimum.dkk() > fees.dkk()) { return minimum; }
                return fees;
            }
        }
    },
    {
        name: 'Payza',
        logo: 'payza.svg',
        link: 'https://payza.com',
        cards: ['visa', 'mastercard', 'maestro'],
        features: ['antifraud'],
        fees: {
            trn() {
                return $revenue.scale(2.9 / 100).add(new Currency(0.3 * $qty, 'EUR'));
            }
        }
    },
    {
        name: 'QuickPay Basic',
        logo: 'quickpay.svg',
        link: 'https://quickpay.net/se',
        acqs: ['Teller', 'Clearhaus', 'Elavon', 'Handelsbanken', 'Swedbank'],
        cards: ['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners', Mobilepay],
        features: ['antifraud', 'recurring'],
        fees: {
            trn() {
                return new Currency(7.5 * $qty, 'SEK');
            }
        }
    },
    {
        name: 'QuickPay Starter',
        logo: 'quickpay.svg',
        link: 'https://quickpay.net/dk',
        acqs: ['Teller', 'Clearhaus', 'Elavon', 'Handelsbanken', 'Swedbank'],
        cards: ['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners', Mobilepay],
        features: ['antifraud', 'recurring'],
        fees: {
            monthly: new Currency(99, 'SEK'),
            trn() {
                return new Currency(1.75 * $qty, 'SEK');
            }
        }
    },
    {
        name: 'QuickPay Professional',
        logo: 'quickpay.svg',
        link: 'https://quickpay.net/dk',
        acqs: ['Teller', 'Clearhaus', 'Elavon', 'Handelsbanken', 'Swedbank'],
        cards: ['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners', Mobilepay],
        features: ['antifraud', 'recurring'],
        fees: {
            monthly: new Currency(199, 'SEK'),
            trn() {
                if ($qty > 250) {
                    return new Currency($qty - 250, 'SEK');
                }
                return false;
            }
        }
    },
    {
        name: 'Stripe',
        logo: 'stripe.svg',
        link: 'https://stripe.com',
        cards: ['visa', 'mastercard', 'amex'],
        features: ['antifraud', 'recurring'],
        fees: {
            trn() {
                return $revenue.scale(1.4 / 100).add(new Currency(1.8 * $qty, 'SEK'));
            }
        }
    },
    {
        name: '2checkout',
        logo: '2checkout.svg',
        link: 'https://www.2checkout.com',
        cards: ['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners'],
        features: ['antifraud', 'recurring'],
        fees: {
            trn() {
                return $revenue.scale(2.4 / 100).add(new Currency(0.3 * $qty, 'USD'));
            }
        }
    },
    {
        name: 'Lemon Way',
        logo: 'lemonway.svg',
        link: 'https://www.lemonway.com/da/',
        cards: ['visa', 'mastercard', 'maestro'],
        features: ['antifraud', 'antifraud'],
        fees: {
            trn() {
                return $revenue.scale(1.2 / 100).add(new Currency(0.18 * $qty, 'EUR'));
            }
        }
    },/*
    {
        name: 'Scanpay',
        logo: 'scanpay.svg',
        link: 'https://scanpay.dk',
        acqs: ['Nets', 'Teller', 'Clearhaus', 'Elavon', 'Handelsbanken', 'Swedbank'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners',
                Forbrugsforeningen,
                {
                    title: 'mobilepay',
                    monthly: new Currency(48.67, 'DKK') // 1.6 * 365 / 12
                }],
        features: [],
        fees: {
            trn() {
                return new Currency(0.25 * $qty, 'DKK');
            }
        }
    }*/
];



// Temporary solution: convert arrays to objects
(function () {

    function arr2obj(arr) {
        const obj = {};
        for (let i = 0; i < arr.length; i++) {
            let key = arr[i];
            if (typeof key === 'object') { key = key.title; }
            obj[key] = arr[i];
        }
        return obj;
    }

    for (let i in ACQs) {
        ACQs[i].cards = arr2obj(ACQs[i].cards);
    }

    for (let i in PSPs) {
        const psp = PSPs[i];
        psp.cards = arr2obj(psp.cards);
        psp.features = arr2obj(psp.features);
        if (psp.acqs) {
            psp.acquirers = arr2obj(psp.acqs);
        }
    }

})();
