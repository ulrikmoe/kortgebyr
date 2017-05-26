/**
*   @author Ulrik Moe, Christian Blach, Joakim Sindholt
*   @license GPLv3
**/

const CARDs = {
    mobilepay: {
        setup: new Currency(0, 'DKK'),
        monthly: new Currency(49, 'DKK'),
        trn: new Currency(0, 'DKK') // Add fees later
    },
    forbrugsforeningen: {
        setup: new Currency(0, 'DKK'),
        monthly: new Currency(0, 'DKK'),
        trn: new Currency(0, 'DKK')
    },
    dankort: {
        setup: new Currency(250, 'DKK'),
        monthly: new Currency(1000 / 12, 'DKK'),
        trn: new Currency(0, 'DKK'), // Add fees later
        trn() {
            const avgvalue = $avgvalue.dkk();
            const fee = (avgvalue <= 50) ? 0.7 : (avgvalue <= 100) ? 1.1 : 1.39;
            return new Currency(fee, 'DKK');
        }
    }
};


const ACQs = [
    {
        name: 'Nets',
        logo: 'nets.svg',
        link: 'https://dankort.dk/Pages/Forretninger.aspx',
        cards: {
            dankort: true,
            forbrugsforeningen: CARDs.forbrugsforeningen,
            mobilepay: true
        },
        fees: CARDs.dankort
    },
    {
        name: 'Teller',
        logo: 'teller.svg',
        link: 'https://www.nets.eu/dk/payments/online-betalinger/',
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
            trn() {
                const trnfee = $avgvalue.scale(1.34 / 100).add(new Currency(0.19, 'DKK'));
                return (trnfee.dkk() > 0.7) ? trnfee : new Currency(0.7, 'DKK');
            }
        }
    },
    {
        name: 'Handelsbanken',
        logo: 'handelsbanken.svg',
        link: 'https://handelsbanken.dk/shb/inet/icentda.nsf/Default/qC21926A235427DE6C12578810023DBB9?Opendocument',
        cards: {
            visa: true,
            mastercard: true,
            maestro: true
        },
        fees: {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(0, 'DKK'),
            trn() {
                return $avgvalue.scale(1.5 / 100);
            }
        }
    },
    {
        name: 'Swedbank',
        logo: 'swedbank.png',
        link: 'https://www.swedbank.dk/card-services/priser-og-vilkar/#!/CID_2263482',
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
                // TODO: Add minimum fee of 50 DKK / month.
                return $avgvalue.scale(1.1 / 100);
            }
        }
    },
    {
        name: 'Valitor',
        logo: 'valitor.png',
        link: 'https://www.valitor.com/acquiring-services/online-payments/',
        cards: {
            visa: true,
            mastercard: true,
            maestro: true,
        },
        fees: {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(0, 'DKK'),
            trn() {
                return $avgvalue.scale(1.5 / 100);
            }
        }
    },
    {
        name: 'Elavon',
        logo: 'elavon.svg',
        link: 'https://www.elavon.dk/v%C3%A5re-tjenester/sm%C3%A5-bedrifter',
        cards: {
            visa: true,
            mastercard: true,
            maestro: true
        },
        fees: {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(0, 'DKK'),
            trn() {
                return $avgvalue.scale(1.6 / 100);
            }
        }
    },
    {
        name: 'Clearhaus',
        logo: 'clearhaus.svg',
        link: 'https://www.clearhaus.com/dk/',
        cards: {
            visa: true,
            mastercard: true,
            maestro: true,
            mobilepay: true
        },
        fees: {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(0, 'DKK'),
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
        cards: {
            visa: true,
            mastercard: true,
            maestro: true
        },
        fees: {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(0, 'DKK'),
            trn() {
                return $avgvalue.scale(1.45 / 100);
            }
        }
    }
];

let PSPs = [
    {
        name: 'Braintree',
        logo: 'braintree.svg',
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
            trn() {
                return $revenue.scale(1.9 / 100).add(new Currency(2.25 * $qty, 'DKK'));
            }
        }
    },
    {
        name: 'Certitrade',
        logo: 'certitrade.svg',
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
            trn() {
                return $revenue.scale(0.9 / 100).add(new Currency(1.5 * $qty, 'SEK'));
            }
        }
    },
    {
        name: 'Checkout.com',
        logo: 'checkoutcom.svg',
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
            trn() {
                return $revenue.scale(0.95 / 100).add(new Currency(0.20 * $qty, 'GBP'));
            }
        }
    },
    {
        name: 'DanDomain',
        logo: 'dandomain.svg',
        link: 'https://www.dandomain.dk/webshop/betalingssystem',
        features: {
            '3-D secure': true
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
            trn() {
                return new Currency(0, 'DKK');
            }
        }
    },
    {
        name: 'DIBS All-in-one',
        logo: 'dibs.svg',
        link: 'http://dibs.dk',
        features: {
            '3-D secure': {
                setup: new Currency(495, 'DKK'),
                monthly: new Currency(49, 'DKK'), // Ring og spørg.
                trn: new Currency(0, 'DKK')
            },
            recurring: {
                setup: new Currency(495, 'DKK'),
                monthly: new Currency(49, 'DKK'),
                trn: new Currency(0, 'DKK')
            }
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
            trn() {
                let fees = $revenue.scale(1.45 / 100).add(new Currency(0.19 * $qty, 'DKK'));
                if ($qty > 250) {
                    fees.add(new Currency(0.35 * ($qty - 250), 'DKK'));
                }
                return fees;
            }
        }
    },
    {
        name: 'DIBS Basic',
        logo: 'dibs.svg',
        link: 'http://dibs.dk',
        features: {
            '3-D secure': {
                setup: new Currency(495, 'DKK'),
                monthly: new Currency(49, 'DKK'), // Ring og spørg.
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
            setup: new Currency(599, 'DKK'),
            monthly: new Currency(199, 'DKK'),
            trn() {
                if ($qty > 250) {
                    return new Currency(0.35 * ($qty - 250), 'DKK')
                }
                return new Currency(0, 'DKK');
            }
        }
    },
    {
        name: 'ePay Light',
        logo: 'epay.svg',
        link: 'http://epay.dk',
        features: {
            '3-D secure': true,
            antifraud: {
                setup: new Currency(0, 'DKK'),
                monthly: new Currency(0, 'DKK'),
                trn() {
                    return new Currency(0.3 * $qty, 'DKK');
                }
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
            trn() {
                if ($qty > 250) {
                    return new Currency(0.25 * ($qty - 250), 'DKK')
                }
                return new Currency(0, 'DKK');
            }
        }
    },
    {
        name: 'ePay Pro',
        logo: 'epay.svg',
        link: 'http://epay.dk',
        features: {
            '3-D secure': true,
            antifraud: {
                setup: new Currency(0, 'DKK'),
                monthly: new Currency(0, 'DKK'),
                trn() {
                    return new Currency(0.3 * $qty, 'DKK');
                }
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
            trn() {
                if ($qty > 250) {
                    return new Currency(0.25 * ($qty - 250), 'DKK')
                }
                return new Currency(0, 'DKK');
            }
        }
    },
    {
        name: 'ePay Business',
        logo: 'epay.svg',
        link: 'http://epay.dk',
        features: {
            '3-D secure': true,
            antifraud: {
                setup: new Currency(0, 'DKK'),
                monthly: new Currency(0, 'DKK'),
                trn() {
                    return new Currency(0.3 * $qty, 'DKK');
                }
            },
            recurring: {
                setup: new Currency(0, 'DKK'),
                monthly() {
                    return new Currency($qty / 12, 'DKK');
                },
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
            trn() {
                if ($qty > 500) {
                    return new Currency(0.25 * ($qty - 500), 'DKK')
                }
                return new Currency(0, 'DKK');
            }
        }
    },
    {
        name: 'ePay Pro+', // Bambora
        logo: 'epay.svg',
        link: 'http://www.epay.dk/bambora/',
        features: {
            '3-D secure': true,
            antifraud: {
                setup: new Currency(0, 'DKK'),
                monthly: new Currency(0, 'DKK'),
                trn() {
                    return new Currency(0.3 * $qty, 'DKK');
                }
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
            trn() {
                let fees = $revenue.scale(1.45 / 100);
                if ($qty > 250) {
                    fees.add(new Currency(0.25 * ($qty - 250), 'DKK'));
                }
                return fees;
            }
        }
    },
    {
        name: 'Netaxept Start',
        logo: 'netaxept.svg',
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
            trn() {
                return new Currency(1.5 * $qty, 'DKK')
            }
        }
    },
    {
        name: 'Netaxept Advanced',
        logo: 'netaxept.svg',
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
            setup: new Currency(6000, 'DKK'),
            monthly: new Currency(500, 'DKK'),
            trn() {
                return new Currency(0.7 * $qty, 'DKK')
            }
        }
    },
    {
        name: 'Payer',
        logo: 'payer.svg',
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
            trn() {
                return new Currency(2 * $qty, 'SEK');
            }
        }
    },
    {
        name: 'Paylike',
        logo: 'paylike.svg',
        link: 'https://paylike.dk',
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
            trn() {
                return $revenue.scale(1.35 / 100).add(new Currency(0.50 * $qty, 'DKK'));
            }
        }
    },
    {
        name: 'Paymill',
        logo: 'paymill.svg',
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
            trn() {
                return $revenue.scale(2.95 / 100).add(new Currency(0.28 * $qty, 'EUR'));
            }
        }
    },
    {
        name: 'PayPal',
        logo: 'paypal.svg',
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
            trn() {
                return $revenue.scale(2.9 / 100).add(new Currency(0.3 * $qty, 'EUR'));
            }
        }
    },
    {
        name: 'QuickPay Basis',
        logo: 'quickpay.svg',
        link: 'https://quickpay.net/dk',
        features: {
            '3-D secure': true,
            antifraud: true,
            recurring: true
        },
        acquirers: {
            Nets: true,
            Teller: true,
            Clearhaus: true,
            Swedbank: true,
            Handelsbanken: true,
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
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(0, 'DKK'),
            trn() {
                return new Currency(5 * $qty, 'DKK');
            }
        }
    },
    {
        name: 'QuickPay Starter',
        logo: 'quickpay.svg',
        link: 'https://quickpay.net/dk',
        features: {
            '3-D secure': true,
            antifraud: true,
            recurring: true
        },
        acquirers: {
            Nets: true,
            Teller: true,
            Clearhaus: true,
            Swedbank: true,
            Handelsbanken: true,
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
            setup: new Currency(0, 'DKK'),
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
        features: {
            '3-D secure': true,
            antifraud: true,
            recurring: true
        },
        acquirers: {
            Nets: true,
            Teller: true,
            Clearhaus: true,
            Swedbank: true,
            Handelsbanken: true,
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
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(149, 'DKK'),
            trn() {
                if ($qty > 250) {
                    return new Currency(0.25 * ($qty - 250), 'DKK');
                }
                return new Currency(0, 'DKK');
            }
        }
    },
    {
        name: 'Stripe',
        logo: 'stripe.svg',
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
            trn() {
                return $revenue.scale(1.4 / 100).add(new Currency(1.8 * $qty, 'DKK'));
            }
        }
    },
    {
        name: 'YourPay',
        logo: 'yourpay.png',
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
            trn() {
                return $revenue.scale(2.25 / 100);
            }
        }
    },
    {
        name: '2checkout',
        logo: '2checkout.svg',
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
            trn() {
                return $revenue.scale(2.4 / 100).add(new Currency(0.3 * $qty, 'USD'));
            }
        }
    },
    {
        name: 'PayEx One',
        logo: 'payex.svg',
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
            trn() {
                return $revenue.scale(1 / 100).add(new Currency(1.5 * $qty, 'DKK'));
            }
        }
    },
    {
        name: 'Wannafind',
        logo: 'wannafind.svg',
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
            trn() {
                return new Currency(0, 'DKK');
            }
        }
    },
    {
        name: 'PensoPay Basis',
        logo: 'pensopay.svg',
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
            //dankort: CARDs.dankort,
            visa: true,
            mastercard: true,
            maestro: true,
            mobilepay: CARDs.mobilepay
        },
        fees: {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(0, 'DKK'),
            trn() {
                return $revenue.scale(1.45 / 100).add(new Currency(5 * $qty, 'DKK'))
            }
        }
    },
    {
        name: 'PensoPay Iværksætter',
        logo: 'pensopay.svg',
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
            //dankort: CARDs.dankort,
            visa: true,
            mastercard: true,
            maestro: true,
            mobilepay: CARDs.mobilepay
        },
        fees: {
            setup: new Currency(0, 'DKK'),
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
            //dankort: CARDs.dankort,
            visa: true,
            mastercard: true,
            maestro: true,
            mobilepay: CARDs.mobilepay
        },
        fees: {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(99, 'DKK'),
            trn() {
                let fees = $revenue.scale(1.4 / 100);
                if ($qty > 100) {
                    fees.add(new Currency(0.35 * $qty, 'DKK'));
                }
                return fees;
            }
        }
    },
    {
        name: 'PensoPay Pro',
        logo: 'pensopay.svg',
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
            //dankort: CARDs.dankort,
            visa: true,
            mastercard: true,
            maestro: true,
            mobilepay: CARDs.mobilepay
        },
        fees: {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(149, 'DKK'),
            trn() {
                let fees = $revenue.scale(1.35 / 100);
                if ($qty > 250) {
                    fees.add(new Currency(0.25 * $qty, 'DKK'));
                }
                return fees;
            }
        }
    },
    {
        name: 'PensoPay Premium',
        logo: 'pensopay.svg',
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
            //dankort: CARDs.dankort,
            visa: true,
            mastercard: true,
            maestro: true,
            mobilepay: true
        },
        fees: {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(129, 'DKK'),
            trn() {
                let fees = $revenue.scale(1.35 / 100);
                if ($qty > 100) {
                    fees.add(new Currency(0.35 * $qty, 'DKK'));
                }
                return fees;
            }
        }
    },
    {
        name: 'Lemon Way',
        logo: 'lemonway.svg',
        link: 'https://www.lemonway.com/da/',
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
            trn() {
                return $revenue.scale(1.2 / 100).add(new Currency(0.18 * $qty, 'EUR'));
            }
        }
    },
    {
        name: 'ScanNet',
        logo: 'scannet.svg',
        link: 'https://www.scannet.dk/betalingsloesning/',
        features: {
            '3-D secure': true,
            antifraud: true,
            recurring: {
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
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(399, 'DKK'),
            trn() {
                return new Currency(0, 'DKK');
            }
        }
    },
    {
        name: 'Reepay Startup',
        logo: 'reepay.svg',
        link: 'https://reepay.com/da/',
        features: {
            '3-D secure': true,
            'recurring': true
        },
        acquirers: {
            Clearhaus: true
        },
        cards: {
            visa: true,
            mastercard: true,
            maestro: true
        },
        fees: {
            setup: new Currency(0, 'DKK'),
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
        features: {
            '3-D secure': true,
            'recurring': true
        },
        acquirers: {
            Clearhaus: true
        },
        cards: {
            visa: true,
            mastercard: true,
            maestro: true
        },
        fees: {
            setup: new Currency(0, 'DKK'),
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
        features: {
            '3-D secure': true,
            'recurring': true
        },
        acquirers: {
            Clearhaus: true
        },
        cards: {
            visa: true,
            mastercard: true,
            maestro: true
        },
        fees: {
            setup: new Currency(0, 'DKK'),
            monthly: new Currency(949, 'DKK'),
            trn() {
                return new Currency(1.5 * $qty, 'DKK');
            }
        }
    }
];
