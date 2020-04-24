/* @author Ulrik Moe, Christian Blach, Joakim Sindholt */
/* global opts, Currency, $currency, $avgvalue, $revenue, $dankortscale, $qty */

const Mobilepay = {
    title: 'mobilepay',
    monthly: new Currency(49, 'DKK')
};

const Forbrugsforeningen = {
    title: 'forbrugsforeningen'
};

const ACQs = [
    {
        name: 'Nets',
        logo: 'nets.svg',
        link: 'https://dankort.dk/Pages/Bestil-Dankortaftale.aspx',
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
        logo: 'nets.svg',
        link: 'https://www.nets.eu/dk/payments/online-betalinger/indloesningsaftale/',
        cards: ['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners', 'mobilepay'],
        fees: {
            setup: new Currency(1000, 'DKK'),
            monthly: new Currency(149, 'DKK'),
            trn() {
                const trnfee = $avgvalue.scale(1.2 / 100).add(new Currency(0.19, 'DKK'));
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
                // Debetcard: 1%, Creditcard: 1.1%, Company cards (1.75%)
                return $avgvalue.scale(1.2 / 100);
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
                const trnfee = $avgvalue.scale(1.25 / 100);
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
                return $revenue.scale(3.5 / 100).add(new Currency(0.3 * $qty, 'USD'));
            }
        }
    },
    {
        name: 'Braintree',
        logo: 'braintree.svg',
        link: 'https://www.braintreepayments.com/en-dk/braintree-pricing',
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
            monthly: new Currency(1000, 'SEK'),
            trn() {
                if ($qty < 1001) { return false; }
                return new Currency(0.50 * ($qty - 1000), 'SEK');
            }
        }
    },
    {
        name: 'DanDomain Start-Up',
        logo: 'dandomain.svg',
        link: 'https://www.dandomain.dk/webshop/betalingssystem',
        acqs: ['Nets', 'Teller', 'Clearhaus'],
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
            monthly: new Currency(39, 'DKK'),
            trn() {
                return new Currency($qty, 'DKK');
            }
        }
    },
    {
        name: 'DanDomain Success',
        logo: 'dandomain.svg',
        link: 'https://www.dandomain.dk/webshop/betalingssystem',
        acqs: ['Nets', 'Teller', 'Clearhaus'],
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
            monthly: new Currency(149, 'DKK'),
            trn() {
                if ($qty <= 500) { return false; }
                return new Currency(0.25 * ($qty - 500), 'DKK');
            }
        }
    },
    {
        name: 'Pro',
        logo: 'bambora-psp.svg',
        link: 'https://www.bambora.com/da/dk/online/',
        acqs: ['Teller', 'Clearhaus', 'Swedbank', 'Handelsbanken',
            'Valitor', 'Elavon', 'Bambora'],
        cards: ['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners', Mobilepay],
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
        name: 'Pro+',
        logo: 'bambora-psp.svg',
        link: 'https://www.bambora.com/da/dk/online/priser/',
        acqs: ['Bambora'],
        cards: ['visa', 'mastercard', 'maestro', Mobilepay],
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
        name: 'Business',
        logo: 'bambora-psp.svg',
        link: 'https://www.bambora.com/da/dk/online/',
        acqs: ['Teller', 'Clearhaus', 'Swedbank', 'Handelsbanken', 'Valitor', 'Elavon', 'Bambora'],
        cards: ['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners', Mobilepay, Forbrugsforeningen],
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
        name: 'Nets Easy',
        logo: 'netaxept.svg',
        link: 'https://www.nets.eu/dk/payments/online/easy/',
        cards: ['visa', 'mastercard', 'maestro', Mobilepay],
        features: [
            {
                title: 'Abonnementsbetaling',
                setup: new Currency(495, 'DKK'),
                monthly: new Currency(49, 'DKK')
            }
        ],
        fees: {
            monthly: new Currency(199, 'DKK'),
            trn() {
                return $revenue.scale(1.35 / 100).add(new Currency(0.5 * $qty, 'DKK'));
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
        name: 'Basic',
        logo: 'paymill.svg',
        link: 'https://www.paymill.com/en/pricing-2/',
        cards: ['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners'],
        features: ['Svindelkontrol', 'Abonnementsbetaling'],
        fees: {
            monthly: new Currency(4.95, 'EUR'),
            trn() {
                return $revenue.scale(1.95 / 100).add(new Currency(0.25 * $qty, 'EUR'));
            }
        }
    },
    {
        name: 'Professional',
        logo: 'paymill.svg',
        link: 'https://www.paymill.com/en/pricing-2/',
        cards: ['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners'],
        features: ['Svindelkontrol', 'Abonnementsbetaling'],
        fees: {
            monthly: new Currency(19.95, 'EUR'),
            trn() {
                return $revenue.scale(1.35 / 100).add(new Currency(0.25 * $qty, 'EUR'));
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
            trn(o) {
                const revenue = $revenue.order('SEK') * 12;
                let fee = 2.85;
                if (revenue > 1000000) fee = 2.55;
                if (revenue > 3000000) fee = 1.95;
                return $revenue.scale(fee / 100);
            }
        }
    },
    {
        name: 'PensoPay Basis',
        logo: 'pensopay.svg',
        link: 'https://pensopay.com/',
        acqs: ['Nets', 'Clearhaus'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', Mobilepay],
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
            setup(o) {
                delete o.setup.Nets; // Free sign-up
            },
            trn() {
                return new Currency(4 * $qty, 'DKK');
            }
        }
    },
    {
        name: 'PensoPay Start-Up',
        logo: 'pensopay.svg',
        link: 'https://pensopay.com/',
        acqs: ['Nets', 'Clearhaus'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', Mobilepay],
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
            setup(o) {
                delete o.setup.Nets; // Free sign-up
            },
            monthly: new Currency(59, 'DKK'),
            trn() {
                return new Currency($qty, 'DKK');
            }
        }
    },
    {
        name: 'PensoPay Business',
        logo: 'pensopay.svg',
        link: 'https://pensopay.com/vores-betalingsloesninger/',
        acqs: ['Nets', 'Clearhaus'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', Mobilepay],
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
            setup(o) {
                delete o.setup.Nets; // Free sign-up
            },
            monthly: new Currency(99, 'DKK'),
            trn() {
                if ($qty <= 100) { return false; }
                return new Currency(0.35 * ($qty - 100), 'DKK');
            }
        }
    },
    {
        name: 'PensoPay Premium',
        logo: 'pensopay.svg',
        link: 'https://pensopay.com/',
        acqs: ['Nets', 'Clearhaus'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'mobilepay'],
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
            setup(o) {
                delete o.setup.Nets; // Free sign-up
            },
            monthly(o) {
                if (opts.cards.mobilepay) {
                    // PensoPay pays MobilePay fee
                    delete o.monthly.MobilePay;
                }
                return new Currency(129, 'DKK');
            },
            trn() {
                if ($qty <= 100) { return false; }
                return new Currency(0.35 * ($qty - 100), 'DKK');
            }
        }
    },
    {
        name: 'PensoPay Pro',
        logo: 'pensopay.svg',
        link: 'https://pensopay.com/',
        acqs: ['Nets', 'Clearhaus'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', Mobilepay],
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
            setup(o) {
                delete o.setup.Nets; // Free sign-up
            },
            monthly: new Currency(149, 'DKK'),
            trn() {
                if ($qty <= 250) { return false; }
                return new Currency(0.25 * ($qty - 250), 'DKK');
            }
        }
    },
    {
        name: 'QuickPay Basis',
        logo: 'quickpay.svg',
        link: 'https://quickpay.net/dk',
        acqs: ['Nets', 'Teller', 'Clearhaus', 'Handelsbanken', 'Swedbank'],
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
        acqs: ['Nets', 'Teller', 'Clearhaus', 'Handelsbanken', 'Swedbank'],
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
        acqs: ['Nets', 'Teller', 'Clearhaus', 'Handelsbanken', 'Swedbank'],
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
        name: 'Reepay Basic',
        logo: 'reepay.svg',
        link: 'https://reepay.com/da/',
        acqs: ['Nets', 'Clearhaus'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', Mobilepay],
        features: [
            {
                title: 'Abonnementsbetaling',
                monthly() {
                    return new Currency(249, 'DKK');
                }
            }
        ],
        fees: {
            setup(o) {
                // Reepay pays the Nets setup fee
                delete o.setup.Nets;
            },
            monthly: new Currency(49, 'DKK'),
            trn() {
                return new Currency($qty, 'DKK');
            }
        }
    },
    {
        name: 'Reepay Standard',
        logo: 'reepay.svg',
        link: 'https://reepay.com/da/',
        acqs: ['Nets', 'Clearhaus'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', Mobilepay],
        features: [
            {
                title: 'Abonnementsbetaling',
                monthly() {
                    return new Currency(249, 'DKK');
                }
            }
        ],
        fees: {
            setup(o) {
                // Reepay pays the Nets setup fee
                delete o.setup.Nets;
            },
            monthly: new Currency(139, 'DKK'),
            trn() {
                if ($qty <= 250) { return false; }
                return new Currency(0.25 * ($qty - 250), 'DKK');
            }
        }
    },
    {
        name: 'ScanNet',
        logo: 'scannet.svg',
        link: 'https://www.scannet.dk/betalingsloesning/',
        acqs: ['Nets', 'Teller', 'Clearhaus'],
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
        acqs: ['Nets', 'Teller', 'Clearhaus', 'Elavon'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex', 'jcb',
            'diners', Mobilepay, Forbrugsforeningen],
        features: ['Svindelkontrol', 'Abonnementsbetaling'],
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
        name: 'Wannafind Start-Up',
        logo: 'wannafind.svg',
        link: 'https://www.wannafind.dk/betalingssystem/',
        acqs: ['Nets', 'Teller', 'Clearhaus'],
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
            monthly: new Currency(39, 'DKK'),
            trn() {
                return new Currency($qty, 'DKK');
            }
        }
    },
    {
        name: 'Wannafind Success',
        logo: 'wannafind.svg',
        link: 'https://www.wannafind.dk/betalingssystem/',
        acqs: ['Nets', 'Teller', 'Clearhaus'],
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
            monthly: new Currency(149, 'DKK'),
            trn() {
                if ($qty <= 500) { return false; }
                return new Currency(0.25 * ($qty - 500), 'DKK');
            }
        }
    },
    {
        name: 'YourPay',
        logo: 'yourpay.png',
        link: 'https://www.yourpay.io',
        cards: ['visa', 'mastercard', 'maestro', Mobilepay],
        features: ['Svindelkontrol', 'Abonnementsbetaling'],
        fees: {
            trn() {
                return $revenue.scale(1.25 / 100);
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
        if (!psp.fees.setup) { psp.fees.setup = new Currency(0, 'DKK'); }
        if (!psp.fees.monthly) { psp.fees.monthly = new Currency(0, 'DKK'); }
        if (!psp.fees.trn) { psp.fees.trn = new Currency(0, 'DKK'); }
    }
})();
