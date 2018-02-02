/* @author Ulrik Moe, Christian Blach, Joakim Sindholt */
/* global opts, Currency, $currency, $avgvalue, $revenue, $dankortscale, $qty */

const Mobilepay = {
    title: 'mobilepay',
    monthly: new Currency(49, 'DKK')
};

const Forbrugsforeningen = {
    title: 'forbrugsforeningen'
};

// All prices checked on November 4, 2017.
const ACQs = [
    {
        name: 'Nets',
        logo: 'nets.svg',
        link: 'https://dankort.dk/Pages/Forretninger.aspx',
        cards: ['dankort', 'forbrugsforeningen', 'mobilepay'],
        fees: {
            setup: new Currency(250, 'DKK'),
            monthly: new Currency(1100 / 12, 'DKK'),
            trn() {
                const fee = $avgvalue.scale(0.19 / 100).add(new Currency(0.54, 'DKK'));
                if (fee.order('DKK') > 2.5) {
                    return new Currency(2.5, 'DKK');
                }
                return fee;
            }
        }
    },
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
                return (trnfee.order('DKK') > 0.7) ? trnfee : new Currency(0.7, 'DKK');
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
        link: 'https://www.swedbank.dk/erhverv/card-services/priser-og-vilkar/#!/CID_2263482',
        cards: ['visa', 'mastercard', 'maestro', 'mobilepay'],
        fees: {
            monthly(o) {
                // Minimum fee of 50 DKK / month.
                const TC = $revenue.scale(1 - $dankortscale).scale(1.1 / 100).order('DKK');
                const minFee = (TC < 50) ? 50 - TC : 0;
                return new Currency(minFee, 'DKK');
            },
            trn() {
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
                const trnfee = $avgvalue.scale(1.45 / 100);
                return (trnfee.order('DKK') > 0.6) ? trnfee : new Currency(0.6, 'DKK');
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

// All prices checked on November 4, 2017.
const PSPs = [
    {
        name: '2checkout',
        logo: '2checkout.svg',
        link: 'https://www.2checkout.com',
        cards: ['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners'],
        features: ['Svindelkontrol', 'Abonnementsbetaling'],
        fees: {
            trn() {
                return $revenue.scale(2.4 / 100).add(new Currency(0.3 * $qty, 'USD'));
            }
        }
    },
    {
        name: 'Braintree',
        logo: 'braintree.svg',
        link: 'https://www.braintreepayments.com',
        cards: ['visa', 'mastercard', 'maestro'],
        features: ['Svindelkontrol', 'Abonnementsbetaling'],
        fees: {
            trn() {
                return $revenue.scale(1.9 / 100).add(new Currency(2.25 * $qty, 'DKK'));
            }
        }
    },
    {
        name: 'Certitrade all-in-one',
        logo: 'certitrade.svg',
        link: 'https://certitrade.se',
        cards: ['visa', 'mastercard', 'maestro'],
        features: ['Svindelkontrol', 'Abonnementsbetaling'],
        fees: {
            trn() {
                return $revenue.scale(2.1 / 100).add(new Currency(2.1 * $qty, 'SEK'));
            }
        }
    },
    {
        name: 'Certitrade Fast',
        logo: 'certitrade.svg',
        link: 'https://certitrade.se',
        acqs: ['Bambora', 'Clearhaus', 'Swedbank', 'Handelsbanken', 'Elavon'],
        cards: ['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners'],
        features: ['Svindelkontrol', 'Abonnementsbetaling'],
        fees: {
            monthly: new Currency(1000, 'SEK')
        }
    },
    {
        name: 'Checkout.com',
        logo: 'checkoutcom.svg',
        link: 'https://www.checkout.com',
        cards: ['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners'],
        features: ['Svindelkontrol', 'Abonnementsbetaling'],
        fees: {
            trn() {
                return $revenue.scale(2.95 / 100).add(new Currency(0.20 * $qty, 'GBP'));
            }
        }
    },
    {
        name: 'DanDomain',
        logo: 'dandomain.svg',
        link: 'https://www.dandomain.dk/webshop/betalingssystem',
        acqs: ['Nets', 'Teller'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex', 'jcb',
            'diners', Mobilepay, Forbrugsforeningen],
        features: ['Abonnementsbetaling'],
        fees: {
            setup: new Currency(199, 'DKK'),
            monthly: new Currency(149, 'DKK')
        }
    },
    {
        name: 'DIBS Easy',
        logo: 'dibs.svg',
        link: 'http://dibs.dk',
        cards: ['visa', 'mastercard', 'maestro', Mobilepay],
        features: [
            {
                title: 'Abonnementsbetaling',
                setup: new Currency(495, 'DKK'),
                monthly: new Currency(49, 'DKK')
            }
        ],
        fees: {
            monthly: new Currency(299, 'DKK'),
            trn() {
                return $revenue.scale(1.95 / 100).add(new Currency($qty, 'DKK'));
            }
        }
    },
    {
        name: 'DIBS Basic',
        logo: 'dibs.svg',
        link: 'http://dibs.dk',
        acqs: ['Nets', 'Teller', 'Swedbank', 'Handelsbanken', 'Valitor', 'Elavon'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex', 'jcb',
            'diners', Mobilepay],
        features: [
            {
                title: 'Abonnementsbetaling',
                setup: new Currency(495, 'DKK'),
                monthly: new Currency(49, 'DKK')
            }
        ],
        fees: {
            setup: new Currency(599, 'DKK'),
            monthly: new Currency(199, 'DKK'),
            trn() {
                return new Currency(0.35 * $qty, 'DKK');
            }
        }
    },
    {
        name: 'Online Pro',
        logo: 'bambora-psp.svg',
        link: 'https://www.bambora.com/da/dk/online/priser/',
        acqs: ['Nets', 'Teller', 'Clearhaus', 'Swedbank', 'Handelsbanken',
            'Valitor', 'Elavon', 'Bambora'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex', 'jcb',
            'diners', Mobilepay, Forbrugsforeningen],
        features: [
            {
                title: 'Svindelkontrol',
                trn() {
                    return new Currency(0.3 * $qty, 'DKK');
                }
            }
        ],
        fees: {
            setup: new Currency(599, 'DKK'),
            monthly: new Currency(199, 'DKK'),
            trn() {
                if ($qty <= 250) { return false; }
                return new Currency(0.25 * ($qty - 250), 'DKK');
            }
        }
    },
    {
        name: 'Online Business',
        logo: 'bambora-psp.svg',
        link: 'https://www.bambora.com/da/dk/online/priser/',
        acqs: ['Nets', 'Teller', 'Clearhaus', 'Swedbank', 'Handelsbanken',
            'Valitor', 'Elavon', 'Bambora'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex', 'jcb',
            'diners', Mobilepay, Forbrugsforeningen],
        features: [
            'Abonnementsbetaling',
            {
                title: 'Svindelkontrol',
                trn() {
                    return new Currency(0.3 * $qty, 'DKK');
                }
            }
        ],
        fees: {
            setup: new Currency(999, 'DKK'),
            monthly: new Currency(299, 'DKK'),
            trn() {
                if ($qty <= 500) { return false; }
                return new Currency(0.25 * ($qty - 500), 'DKK');
            }
        }
    },
    {
        name: 'Online',
        logo: 'bambora-psp.svg',
        link: 'https://www.bambora.com/da/dk/online/priser/',
        acqs: ['Nets', 'Bambora'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', Mobilepay, Forbrugsforeningen],
        features: [
            {
                title: 'Svindelkontrol',
                trn() {
                    return new Currency(0.3 * $qty, 'DKK');
                }
            }
        ],
        fees: {
            monthly: new Currency(149, 'DKK'),
            trn() {
                if ($qty <= 250) { return false; }
                return new Currency(0.25 * ($qty - 250), 'DKK');
            }
        }
    },
    {
        name: 'Lemon Way',
        logo: 'lemonway.svg',
        link: 'https://www.lemonway.com/da/',
        cards: ['visa', 'mastercard', 'maestro'],
        features: ['Svindelkontrol', 'Svindelkontrol'],
        fees: {
            trn() {
                return $revenue.scale(1.2 / 100).add(new Currency(0.18 * $qty, 'EUR'));
            }
        }
    },
    {
        name: 'Netaxept Start',
        logo: 'netaxept.svg',
        link: 'https://shop.nets.eu/da/web/dk/e-commerce',
        acqs: ['Nets', 'Teller'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro'],
        features: [],
        fees: {
            setup: new Currency(1005, 'DKK'),
            monthly: new Currency(180, 'DKK'),
            trn() {
                return new Currency(1.5 * $qty, 'DKK');
            }
        }
    },
    {
        name: 'Netaxept Advanced',
        logo: 'netaxept.svg',
        link: 'https://shop.nets.eu/da/web/dk/e-commerce',
        acqs: ['Nets', 'Teller', 'Swedbank', 'Elavon'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners'],
        features: [
            {
                title: 'Svindelkontrol',
                trn() {
                    return new Currency(0.25 * $qty, 'DKK');
                }
            },
            {
                title: 'Abonnementsbetaling',
                monthly: new Currency(250, 'DKK')
            }
        ],
        fees: {
            setup: new Currency(6000, 'DKK'),
            monthly: new Currency(500, 'DKK'),
            trn() {
                return new Currency(0.7 * $qty, 'DKK');
            }
        }
    },
    {
        name: 'Payer',
        logo: 'payer.svg',
        link: 'http://payer.se/betallosning/',
        acqs: ['Swedbank', 'Handelsbanken'],
        cards: ['visa', 'mastercard', 'maestro', 'amex', 'diners'],
        features: ['Svindelkontrol'],
        fees: {
            setup: new Currency(1400, 'SEK'),
            monthly: new Currency(400, 'SEK'),
            trn() {
                return new Currency(2 * $qty, 'SEK');
            }
        }
    },
    {
        name: 'PayEx One',
        logo: 'payex.svg',
        link: 'http://payex.dk/tjenester/e-handel/',
        cards: ['visa', 'mastercard', 'maestro', Mobilepay],
        features: ['Svindelkontrol', 'Abonnementsbetaling'],
        fees: {
            monthly: new Currency(299, 'DKK'),
            trn() {
                return $revenue.scale(1 / 100).add(new Currency(1.5 * $qty, 'DKK'));
            }
        }
    },
    {
        name: 'Paylike',
        logo: 'paylike.svg',
        link: 'https://paylike.dk',
        cards: ['visa', 'mastercard', 'maestro'],
        features: ['Svindelkontrol', 'Abonnementsbetaling'],
        fees: {
            trn() {
                return $revenue.scale(1.35 / 100).add(new Currency(0.50 * $qty, 'DKK'));
            }
        }
    },
    {
        name: 'Paymill',
        logo: 'paymill.svg',
        link: 'https://paymill.com',
        cards: ['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners'],
        features: ['Svindelkontrol', 'Abonnementsbetaling'],
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
        features: ['Svindelkontrol'],
        fees: {
            trn() {
                const k = $revenue.order('DKK') / 1000;
                const fee = (k <= 20) ? 3.4 : (k <= 80) ? 2.9
                    : (k <= 400) ? 2.7 : (k <= 800) ? 2.4 : 1.9;
                return $revenue.scale(fee / 100).add(new Currency(2.6 * $qty, 'DKK'));
            }
        }
    },
    {
        name: 'Payson',
        logo: 'payson.png',
        link: 'https://www.payson.se',
        features: ['Svindelkontrol'],
        cards: ['visa', 'mastercard', 'maestro'],
        fees: {
            trn() {
                const minimum = 4.5 * $qty;
                const fees = $revenue.scale(2.85 / 100);
                return (fees.order('SEK') > minimum) ? fees : new Currency(minimum, 'SEK');
            }
        }
    },
    {
        name: 'PensoPay Basis',
        logo: 'pensopay.svg',
        link: 'https://pensopay.com/',
        cards: ['visa', 'mastercard', 'maestro', Mobilepay],
        features: [
            'Svindelkontrol',
            {
                title: 'Abonnementsbetaling',
                trn() {
                    return new Currency(0.2 * $qty, 'DKK');
                }
            }
        ],
        fees: {
            trn() {
                return $revenue.scale(1.45 / 100).add(new Currency(4 * $qty, 'DKK'));
            }
        }
    },
    {
        name: 'PensoPay Iværksætter',
        logo: 'pensopay.svg',
        link: 'https://pensopay.com/',
        cards: ['visa', 'mastercard', 'maestro', Mobilepay],
        features: [
            'Svindelkontrol',
            {
                title: 'Abonnementsbetaling',
                trn() {
                    return new Currency(0.2 * $qty, 'DKK');
                }
            }
        ],
        fees: {
            monthly: new Currency(59, 'DKK'),
            trn() {
                return $revenue.scale(1.45 / 100).add(new Currency($qty, 'DKK'));
            }
        }
    },
    {
        name: 'PensoPay Business',
        logo: 'pensopay.svg',
        link: 'https://pensopay.com/vores-betalingsloesninger/',
        cards: ['visa', 'mastercard', 'maestro', Mobilepay],
        features: [
            'Svindelkontrol',
            {
                title: 'Abonnementsbetaling',
                trn() {
                    return new Currency(0.2 * $qty, 'DKK');
                }
            }
        ],
        fees: {
            monthly: new Currency(99, 'DKK'),
            trn() {
                let fees = $revenue.scale(1.4 / 100);
                if ($qty > 100) {
                    fees = fees.add(new Currency(0.35 * ($qty - 100), 'DKK'));
                }
                return fees;
            }
        }
    },
    {
        name: 'PensoPay Pro',
        logo: 'pensopay.svg',
        link: 'https://pensopay.com/',
        cards: ['visa', 'mastercard', 'maestro', Mobilepay],
        features: [
            'Svindelkontrol',
            {
                title: 'Abonnementsbetaling',
                trn() {
                    return new Currency(0.2 * $qty, 'DKK');
                }
            }
        ],
        fees: {
            monthly: new Currency(149, 'DKK'),
            trn() {
                let fees = $revenue.scale(1.35 / 100);
                if ($qty > 250) {
                    fees = fees.add(new Currency(0.25 * ($qty - 250), 'DKK'));
                }
                return fees;
            }
        }
    },
    {
        name: 'PensoPay Premium',
        logo: 'pensopay.svg',
        link: 'https://pensopay.com/',
        cards: ['visa', 'mastercard', 'maestro', 'mobilepay'],
        features: [
            'Svindelkontrol',
            {
                title: 'Abonnementsbetaling',
                trn() {
                    return new Currency(0.2 * $qty, 'DKK');
                }
            }
        ],
        fees: {
            monthly: new Currency(129, 'DKK'),
            trn() {
                let fees = $revenue.scale(1.35 / 100);
                if ($qty > 100) {
                    fees = fees.add(new Currency(0.35 * ($qty - 100), 'DKK'));
                }
                return fees;
            }
        }
    },
    {
        name: 'QuickPay Basis',
        logo: 'quickpay.svg',
        link: 'https://quickpay.net/dk',
        acqs: ['Nets', 'Teller', 'Clearhaus', 'Elavon', 'Handelsbanken', 'Swedbank'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex',
            'jcb', 'diners', Mobilepay, Forbrugsforeningen],
        features: ['Svindelkontrol', 'Abonnementsbetaling'],
        fees: {
            trn() {
                return new Currency(5 * $qty, 'DKK');
            }
        }
    },
    {
        name: 'QuickPay Starter',
        logo: 'quickpay.svg',
        link: 'https://quickpay.net/dk',
        acqs: ['Nets', 'Teller', 'Clearhaus', 'Elavon', 'Handelsbanken', 'Swedbank'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex',
            'jcb', 'diners', Mobilepay, Forbrugsforeningen],
        features: ['Svindelkontrol', 'Abonnementsbetaling'],
        fees: {
            monthly: new Currency(49, 'DKK'),
            trn() {
                return new Currency($qty, 'DKK');
            }
        }
    },
    {
        name: 'QuickPay Professional',
        logo: 'quickpay.svg',
        link: 'https://quickpay.net/dk',
        acqs: ['Nets', 'Teller', 'Clearhaus', 'Elavon', 'Handelsbanken', 'Swedbank'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex',
            'jcb', 'diners', Mobilepay, Forbrugsforeningen],
        features: ['Svindelkontrol', 'Abonnementsbetaling'],
        fees: {
            monthly: new Currency(149, 'DKK'),
            trn() {
                if ($qty <= 250) { return false; }
                return new Currency(0.25 * ($qty - 250), 'DKK');
            }
        }
    },
    {
        name: 'Reepay Startup',
        logo: 'reepay.svg',
        link: 'https://reepay.com/da/',
        acqs: ['Clearhaus'],
        cards: ['visa', 'mastercard', 'maestro'],
        features: ['Abonnementsbetaling'],
        fees: {
            monthly: new Currency(99, 'DKK'),
            trn() {
                return new Currency(4 * $qty, 'DKK');
            }
        }
    },
    {
        name: 'Reepay Medium',
        logo: 'reepay.svg',
        link: 'https://reepay.com/da/',
        acqs: ['Clearhaus'],
        cards: ['visa', 'mastercard', 'maestro'],
        features: ['Abonnementsbetaling'],
        fees: {
            monthly: new Currency(199, 'DKK'),
            trn() {
                return new Currency(2 * $qty, 'DKK');
            }
        }
    },
    {
        name: 'Reepay Enterprise',
        logo: 'reepay.svg',
        link: 'https://reepay.com/da/',
        acqs: ['Clearhaus'],
        cards: ['visa', 'mastercard', 'maestro'],
        features: ['Abonnementsbetaling'],
        fees: {
            monthly: new Currency(949, 'DKK'),
            trn() {
                return new Currency(1.5 * $qty, 'DKK');
            }
        }
    },
    {
        name: 'ScanNet',
        logo: 'scannet.svg',
        link: 'https://www.scannet.dk/betalingsloesning/',
        acqs: ['Nets', 'Teller'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex',
            'jcb', 'diners', Mobilepay, Forbrugsforeningen],
        features: [
            'Svindelkontrol',
            {
                title: 'Abonnementsbetaling',
                monthly: new Currency(99, 'DKK')
            }
        ],
        fees: {
            monthly: new Currency(399, 'DKK')
        }
    },
    {
        name: 'Scanpay',
        logo: 'scanpay.svg',
        link: 'https://scanpay.dk',
        acqs: ['Nets', 'Teller', 'Clearhaus', 'Elavon', 'Handelsbanken', 'Swedbank'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex', 'jcb',
            'diners', Mobilepay, Forbrugsforeningen],
        features: ['Svindelkontrol'],
        fees: {
            trn() {
                return new Currency(0.25 * $qty, 'DKK');
            }
        }
    },
    {
        name: 'Stripe',
        logo: 'stripe.svg',
        link: 'https://stripe.com',
        cards: ['visa', 'mastercard', 'amex'],
        features: ['Svindelkontrol', 'Abonnementsbetaling'],
        fees: {
            trn() {
                return $revenue.scale(1.4 / 100).add(new Currency(1.8 * $qty, 'DKK'));
            }
        }
    },
    {
        name: 'Wannafind',
        logo: 'wannafind.svg',
        link: 'https://www.wannafind.dk/betalingssystem/',
        acqs: ['Nets', 'Teller'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex', 'jcb',
            'diners', Mobilepay, Forbrugsforeningen],
        features: [
            {
                title: 'Abonnementsbetaling',
                monthly: new Currency(99, 'DKK')
            },
            'Svindelkontrol'
        ],
        fees: {
            monthly(o) {
                // Hacky solution to add 3-D Secure (mandatory)
                o.monthly['3-D Secure'] = new Currency(49, 'DKK');
                return new Currency(149, 'DKK');
            }
        }
    },
    {
        name: 'YourPay',
        logo: 'yourpay.png',
        link: 'https://www.yourpay.io',
        cards: ['visa', 'mastercard', 'maestro'],
        features: ['Svindelkontrol'],
        fees: {
            trn() {
                if ($revenue.order('DKK') >= 100000) {
                    return $revenue.scale(1.35 / 100);
                }
                return $revenue.scale(2.25 / 100);
            }
        }
    }
];


// Temporary solution: convert arrays to objects
(() => {
    function arr2obj(arr) {
        const obj = {};
        for (let i = 0; i < arr.length; i++) {
            let key = arr[i];
            if (typeof key === 'object') { key = key.title; }
            obj[key] = arr[i];
        }
        return obj;
    }

    for (const i in ACQs) {
        ACQs[i].cards = arr2obj(ACQs[i].cards);
    }

    for (const i in PSPs) {
        const psp = PSPs[i];
        psp.cards = arr2obj(psp.cards);
        psp.features = arr2obj(psp.features);
        if (psp.acqs) {
            psp.acquirers = arr2obj(psp.acqs);
        }
    }
})();
