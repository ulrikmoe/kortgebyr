/* @author Ulrik Moe, Christian Blach, Joakim Sindholt */
/* global opts, Currency, $currency, $avgvalue, $revenue, $dankortscale, $qty */

const MobilePay = {
    title: 'MobilePay',
    monthly: new Currency(49, 'DKK')
};

const Forbrugsforeningen = {
    title: 'forbrugsforeningen'
};

const ACQs = [
    {
        name: 'Dankort',
        logo: 'nets.svg',
        link: 'https://dankort.dk/dk/betaling-i-webshop/',
        cards: ['dankort', 'forbrugsforeningen'],
        fees: {
            trn() {
                const fee = $avgvalue.scale(0.19 / 100).add(new Currency(0.54, 'DKK'));
                if (fee.order('DKK') > 2.5) return new Currency(2.5, 'DKK');
                return fee;
            }
        }
    },
    {
        name: 'Nets',
        logo: 'nets.svg',
        link: 'https://www.nets.eu/dk/payments/online-betalinger/indloesningsaftale/',
        cards: ['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners'],
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
        cards: ['visa', 'mastercard', 'maestro'],
        fees: {
            monthly(o) {
                // Minimum fee of 50 DKK / month.
                const TC = $revenue.scale(1 - $dankortscale).scale(1.1 / 100).order('DKK');
                const minFee = (TC < 50) ? 50 - TC : 0;
                return new Currency(minFee, 'DKK');
            },
            trn() {
                // Debet 1%, Credit: 1.1%, Company cards (1.75%), EU:
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
                return $avgvalue.scale(1.5 / 100);
            }
        }
    },
    {
        name: 'Clearhaus',
        logo: 'clearhaus.svg',
        link: 'https://www.clearhaus.com/dk/',
        cards: ['visa', 'mastercard', 'maestro'],
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

const PSPs = [
    {
        name: '2checkout',
        logo: '2checkout.svg',
        link: 'https://www.2checkout.com/pricing/',
        cards: ['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners'],
        features: ['Abonnementsbetaling'],
        fees: {
            trn() {
                return $revenue.scale(3.5 / 100).add(new Currency(0.3 * $qty, 'USD'));
            }
        }
    },
    {
        name: 'Braintree',
        logo: 'braintree.svg',
        link: 'https://www.braintreepayments.com/dk/braintree-pricing',
        cards: ['visa', 'mastercard', 'maestro'],
        features: ['Abonnementsbetaling', 'Apple Pay'],
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
        features: ['Abonnementsbetaling'],
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
        features: ['Abonnementsbetaling'],
        fees: {
            monthly: new Currency(1000, 'SEK'),
            trn() {
                const freeTrns = 1000;
                if ($qty <= freeTrns) return false;
                return new Currency(0.50 * ($qty - freeTrns), 'SEK');
            }
        }
    },
    {
        name: 'DanDomain Start-Up',
        logo: 'dandomain.svg',
        link: 'https://dandomain.dk/betalingssystem/priser',
        acqs: ['Dankort', 'Nets', 'Clearhaus', 'Bambora', 'Swedbank'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex', 'jcb',
            'diners', Forbrugsforeningen],
        features: [
            {
                title: 'Abonnementsbetaling',
                monthly: new Currency(99, 'DKK')
            },
            'Apple Pay',
            MobilePay
        ],
        fees: {
            trn() {
                return new Currency($qty, 'DKK');
            }
        }
    },
    {
        name: 'DanDomain Success',
        logo: 'dandomain.svg',
        link: 'https://dandomain.dk/betalingssystem/priser',
        acqs: ['Dankort', 'Nets', 'Clearhaus', 'Bambora', 'Swedbank'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex', 'jcb',
            'diners', Forbrugsforeningen],
        features: [
            {
                title: 'Abonnementsbetaling',
                monthly: new Currency(99, 'DKK')
            },
            'Apple Pay',
            MobilePay
        ],
        fees: {
            monthly: new Currency(149, 'DKK'),
            trn() {
                const freeTrns = 500;
                if ($qty <= freeTrns) return false;
                return new Currency(0.25 * ($qty - freeTrns), 'DKK');
            }
        }
    },
    {
        name: 'Bambora Checkout',
        logo: 'bambora-psp.svg',
        link: 'https://www.bambora.com/da/dk/online/bambora-checkout/',
        acqs: ['Dankort', 'Bambora'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro'],
        features: ['Abonnementsbetaling', MobilePay],
        fees: {
            monthly: new Currency(195, 'DKK')
        }
    },
    {
        name: 'Bambora Pro',
        logo: 'bambora-psp.svg',
        link: 'https://www.bambora.com/da/dk/online/bambora-online/',
        acqs: ['Dankort', 'Nets', 'Swedbank', 'Handelsbanken', 'Valitor', 'Elavon', 'Bambora'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners'],
        features: ['Abonnementsbetaling', MobilePay],
        fees: {
            setup: new Currency(599, 'DKK'),
            monthly: new Currency(199, 'DKK'),
            trn() {
                const freeTrns = 250;
                if ($qty <= freeTrns) return false;
                return new Currency(0.25 * ($qty - freeTrns), 'DKK');
            }
        }
    },
    {
        name: 'Bambora Pro+',
        logo: 'bambora-psp.svg',
        link: 'https://www.bambora.com/da/dk/online/bambora-online/',
        acqs: ['Dankort', 'Bambora'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro'],
        features: ['Abonnementsbetaling', MobilePay],
        fees: {
            monthly: new Currency(149, 'DKK'),
            trn() {
                const freeTrns = 250;
                if ($qty <= freeTrns) return false;
                return new Currency(0.25 * ($qty - freeTrns), 'DKK');
            }
        }
    },
    {
        name: 'Bambora Business',
        logo: 'bambora-psp.svg',
        link: 'https://www.bambora.com/da/dk/online/bambora-online/',
        acqs: ['Dankort', 'Nets', 'Swedbank', 'Handelsbanken', 'Valitor', 'Elavon', 'Bambora'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners', Forbrugsforeningen],
        features: ['Abonnementsbetaling', MobilePay],
        fees: {
            setup: new Currency(999, 'DKK'),
            monthly: new Currency(299, 'DKK'),
            trn() {
                const freeTrns = 500;
                if ($qty <= freeTrns) return false;
                return new Currency(0.25 * ($qty - freeTrns), 'DKK');
            }
        }
    },
    {
        name: 'Nets Easy',
        logo: 'netaxept.svg',
        link: 'https://www.nets.eu/dk/payments/online/easy/',
        cards: ['dankort', 'visa', 'mastercard', 'maestro'],
        features: [
            {
                title: 'Abonnementsbetaling',
                setup: new Currency(495, 'DKK'),
                monthly: new Currency(49, 'DKK')
            },
            MobilePay
        ],
        fees: {
            monthly: new Currency(199, 'DKK'),
            trn(o) {
                if (!$dankortscale) {
                    return $revenue.scale(1.35 / 100).add(new Currency(0.5 * $qty, 'DKK'));
                }
                o.trn['Dankort (0,39% + 1 DKK)'] = $revenue.scale($dankortscale).scale(0.39 / 100)
                    .add(new Currency($dankortscale * $qty, 'DKK'));
                o.trn['Int. kort (1,35% + 0,5 DKK)'] = $revenue.scale(1 - $dankortscale).scale(1.35 / 100)
                    .add(new Currency((1 - $dankortscale) * $qty * 0.5, 'DKK'));
            }
        }
    },
    {
        name: 'Nordea Connect Standard',
        logo: 'nordea-connect.svg',
        link: 'https://nordeaconnect.com/solutions/prices/',
        acqs: ['Dankort', 'Nets', 'Swedbank'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners', Forbrugsforeningen],
        features: ['Apple Pay', 'MobilePay'],
        fees: {
            monthly: new Currency(99, 'DKK'),
            trn() {
                return new Currency($qty, 'DKK');
            }
        }
    },
    {
        name: 'Nordea Connect Pro',
        logo: 'nordea-connect.svg',
        link: 'https://nordeaconnect.com/solutions/prices/',
        acqs: ['Dankort', 'Nets', 'Swedbank'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners', Forbrugsforeningen],
        features: ['Apple Pay', 'MobilePay'],
        fees: {
            monthly: new Currency(249, 'DKK'),
            trn() {
                return new Currency(0.39 * $qty, 'DKK');
            }
        }
    },
    {
        name: 'Paylike',
        logo: 'paylike.svg',
        link: 'https://paylike.dk/pricing',
        cards: ['visa', 'mastercard', 'maestro'],
        features: ['Abonnementsbetaling', 'Apple Pay'],
        fees: {
            trn() {
                return $revenue.scale(1.35 / 100).add(new Currency(0.50 * $qty, 'DKK'));
            }
        }
    },
    {
        name: 'Paymill Basic',
        logo: 'paymill.svg',
        link: 'https://www.paymill.com/en/pricing-2/',
        cards: ['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners'],
        features: ['Abonnementsbetaling'],
        fees: {
            monthly: new Currency(4.95, 'EUR'),
            trn() {
                return $revenue.scale(1.95 / 100).add(new Currency(0.25 * $qty, 'EUR'));
            }
        }
    },
    {
        name: 'Paymill Professional',
        logo: 'paymill.svg',
        link: 'https://www.paymill.com/en/pricing-2/',
        cards: ['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners'],
        features: ['Abonnementsbetaling'],
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
        link: 'https://www.paypal.com/dk/webapps/mpp/merchant-fees',
        cards: ['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners'],
        features: [],
        fees: {
            trn() {
                return $revenue.scale(3.4 / 100).add(new Currency(2.6 * $qty, 'DKK'));
            }
        }
    },
    {
        name: 'Payson',
        logo: 'payson.png',
        link: 'https://www.payson.se/en/company/price-list/',
        cards: ['visa', 'mastercard', 'maestro'],
        features: [],
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
        reseller: 'QuickPay',
        link: 'https://pensopay.com/priser/',
        acqs: ['Dankort', 'Clearhaus'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro'],
        features: [
            {
                title: 'Abonnementsbetaling',
                trn() {
                    return new Currency(0.2 * $qty, 'DKK');
                }
            },
            {
                title: 'Apple Pay',
                monthly: new Currency(19, 'DKK')
            },
            MobilePay
        ],
        fees: {
            trn() {
                return new Currency(4 * $qty, 'DKK');
            }
        }
    },
    {
        name: 'PensoPay Start-Up',
        logo: 'pensopay.svg',
        reseller: 'QuickPay',
        link: 'https://pensopay.com/priser/',
        acqs: ['Dankort', 'Clearhaus'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro'],
        features: [
            {
                title: 'Abonnementsbetaling',
                trn() {
                    return new Currency(0.2 * $qty, 'DKK');
                }
            },
            {
                title: 'Apple Pay',
                monthly: new Currency(19, 'DKK')
            },
            MobilePay
        ],
        fees: {
            monthly: new Currency(49, 'DKK'),
            trn() {
                return new Currency($qty, 'DKK');
            }
        }
    },
    {
        name: 'PensoPay Business',
        logo: 'pensopay.svg',
        reseller: 'QuickPay',
        link: 'https://pensopay.com/priser/',
        acqs: ['Dankort', 'Clearhaus'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro'],
        features: [
            {
                title: 'Abonnementsbetaling',
                trn() {
                    return new Currency(0.2 * $qty, 'DKK');
                }
            },
            {
                title: 'Apple Pay',
                monthly: new Currency(19, 'DKK')
            },
            MobilePay
        ],
        fees: {
            monthly: new Currency(99, 'DKK'),
            trn() {
                const freeTrns = 100;
                if ($qty <= freeTrns) return false;
                return new Currency(0.35 * ($qty - freeTrns), 'DKK');
            }
        }
    },
    {
        name: 'PensoPay Pro',
        logo: 'pensopay.svg',
        reseller: 'QuickPay',
        link: 'https://pensopay.com/priser/',
        acqs: ['Dankort', 'Clearhaus'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro'],
        features: [
            {
                title: 'Abonnementsbetaling',
                trn() {
                    return new Currency(0.2 * $qty, 'DKK');
                }
            },
            {
                title: 'Apple Pay',
                monthly: new Currency(19, 'DKK')
            },
            MobilePay
        ],
        fees: {
            monthly: new Currency(149, 'DKK'),
            trn() {
                const freeTrns = 250;
                if ($qty <= freeTrns) return false;
                return new Currency(0.25 * ($qty - freeTrns), 'DKK');
            }
        }
    },
    {
        name: 'QuickPay Basis',
        logo: 'quickpay.svg',
        link: 'https://quickpay.net/dk/pricing',
        acqs: ['Dankort', 'Nets', 'Clearhaus', 'Handelsbanken', 'Swedbank'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners', Forbrugsforeningen],
        features: [
            'Abonnementsbetaling',
            {
                title: 'Apple Pay',
                monthly: new Currency(19, 'DKK')
            },
            MobilePay
        ],
        fees: {
            trn() {
                return new Currency(5 * $qty, 'DKK');
            }
        }
    },
    {
        name: 'QuickPay Starter',
        logo: 'quickpay.svg',
        link: 'https://quickpay.net/dk/pricing',
        acqs: ['Dankort', 'Nets', 'Clearhaus', 'Handelsbanken', 'Swedbank'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners', Forbrugsforeningen],
        features: [
            'Abonnementsbetaling',
            {
                title: 'Apple Pay',
                monthly: new Currency(19, 'DKK')
            },
            MobilePay
        ],
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
        link: 'https://quickpay.net/dk/pricing',
        acqs: ['Dankort', 'Nets', 'Clearhaus', 'Handelsbanken', 'Swedbank'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners', Forbrugsforeningen],
        features: [
            'Abonnementsbetaling',
            {
                title: 'Apple Pay',
                monthly: new Currency(19, 'DKK')
            },
            MobilePay
        ],
        fees: {
            monthly: new Currency(149, 'DKK'),
            trn() {
                const freeTrns = 250;
                if ($qty <= freeTrns) return false;
                return new Currency(0.25 * ($qty - freeTrns), 'DKK');
            }
        }
    },
    {
        name: 'Reepay Basic',
        logo: 'reepay.svg',
        link: 'https://reepay.com/da/priser/',
        acqs: ['Clearhaus', 'Swedbank'],
        cards: ['visa', 'mastercard', 'maestro'],
        features: [
            {
                title: 'Abonnementsbetaling',
                monthly: new Currency(249, 'DKK'),
                trn() {
                    return new Currency(2 * $qty, 'DKK');
                }
            },
            MobilePay
        ],
        fees: {
            monthly: new Currency(49, 'DKK'),
            trn() {
                return new Currency($qty, 'DKK');
            }
        }
    },
    {
        name: 'Reepay Standard',
        logo: 'reepay.svg',
        link: 'https://reepay.com/da/priser/',
        acqs: ['Dankort', 'Clearhaus', 'Swedbank', 'Handelsbanken', 'Bambora'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro'],
        features: [
            {
                title: 'Abonnementsbetaling',
                monthly: new Currency(249, 'DKK'),
                trn() {
                    return new Currency($qty, 'DKK');
                }
            },
            'Apple Pay',
            MobilePay
        ],
        fees: {
            monthly: new Currency(139, 'DKK'),
            trn() {
                const freeTrns = 250;
                if ($qty <= freeTrns) return false;
                return new Currency(0.25 * ($qty - freeTrns), 'DKK');
            }
        }
    },
    {
        name: 'ScanNet Start-Up',
        logo: 'scannet.svg',
        link: 'https://www.scannet.dk/betalingsloesning/prisoversigt/',
        acqs: ['Dankort', 'Nets', 'Clearhaus', 'Bambora', 'Swedbank'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners', Forbrugsforeningen],
        features: [
            {
                title: 'Abonnementsbetaling',
                monthly: new Currency(99, 'DKK')
            },
            'Apple Pay',
            MobilePay
        ],
        fees: {
            trn() {
                return new Currency($qty, 'DKK');
            },
            monthly: new Currency(39, 'DKK')
        }
    },
    {
        name: 'ScanNet Success',
        logo: 'scannet.svg',
        link: 'https://www.scannet.dk/betalingsloesning/prisoversigt/',
        acqs: ['Dankort', 'Nets', 'Clearhaus', 'Bambora', 'Swedbank'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners', Forbrugsforeningen],
        features: [
            {
                title: 'Abonnementsbetaling',
                monthly: new Currency(99, 'DKK')
            },
            'Apple Pay',
            MobilePay
        ],
        fees: {
            trn() {
                const freeTrns = 500;
                if ($qty <= freeTrns) return false;
                return new Currency(0.25 * ($qty - freeTrns), 'DKK');
            },
            monthly: new Currency(149, 'DKK')
        }
    },
    {
        name: 'Scanpay',
        logo: 'scanpay.svg',
        link: 'https://scanpay.dk',
        acqs: ['Dankort', 'Nets', 'Clearhaus', 'Elavon'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners', Forbrugsforeningen],
        features: ['Abonnementsbetaling', MobilePay],
        fees: {
            trn() {
                return new Currency(0.25 * $qty, 'DKK');
            }
        }
    },
    {
        name: 'Stripe',
        logo: 'stripe.svg',
        link: 'https://stripe.com/en-dk/pricing',
        cards: ['visa', 'mastercard', 'amex'],
        features: ['Abonnementsbetaling', 'Apple Pay'],
        fees: {
            trn() {
                return $revenue.scale(1.4 / 100).add(new Currency(1.8 * $qty, 'DKK'));
            }
        }
    },
    {
        name: 'Wannafind Start-Up',
        logo: 'wannafind.svg',
        link: 'https://www.wannafind.dk/betalingssystem/Priser/',
        acqs: ['Dankort', 'Nets', 'Clearhaus', 'Bambora', 'Swedbank'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners', Forbrugsforeningen],
        features: [
            {
                title: 'Abonnementsbetaling',
                monthly: new Currency(99, 'DKK')
            },
            'Apple Pay',
            MobilePay
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
        link: 'https://www.wannafind.dk/betalingssystem/Priser/',
        acqs: ['Dankort', 'Nets', 'Clearhaus', 'Bambora', 'Swedbank'],
        cards: ['dankort', 'visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners', Forbrugsforeningen],
        features: [
            {
                title: 'Abonnementsbetaling',
                monthly: new Currency(99, 'DKK')
            },
            'Apple Pay',
            MobilePay
        ],
        fees: {
            monthly: new Currency(149, 'DKK'),
            trn() {
                const freeTrns = 500;
                if ($qty <= freeTrns) return false;
                return new Currency(0.25 * ($qty - freeTrns), 'DKK');
            }
        }
    },
    {
        name: 'YourPay',
        logo: 'yourpay.png',
        link: 'https://www.yourpay.io',
        cards: ['visa', 'mastercard', 'maestro'],
        features: ['Abonnementsbetaling', MobilePay],
        fees: {
            trn() {
                // TODO: consider adding a 'payout time' dropdown
                if ($avgvalue.scale(1.45 / 100).order('DKK') < 0.7) return new Currency(0.7 * $qty, 'DKK');
                return $revenue.scale(1.45 / 100);
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
