/* @author Ulrik Moe, Christian Blach, Joakim Sindholt */

const DankortFees = {
    // https://www.dankort.dk/dk/priser/
    trn() {
        return $avgvalue.scale(0.32 / 100);
    }
};

const ACQs = {
    clearhaus: {
        name: 'Clearhaus',
        logo: 'clearhaus.svg',
        wh: [76.66, 13],
        link: 'https://www.clearhaus.com/dk/',
        cards: new Set(['visa', 'mastercard', 'maestro']),
        fees: {
            trn() {
                const trnfee = $avgvalue.scale(1.25 / 100);
                return (trnfee.order('DKK') > 0.6) ? trnfee : new Currency(0.6, 'DKK');
            }
        }
    },
    nets: {
        name: 'Nets',
        logo: 'nets.svg',
        wh: [51.3, 15],
        link: 'https://www.nets.eu/dk/payments/online-betalinger/indloesningsaftale/',
        cards: new Set(['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners']),
        fees: {
            //setup: new Currency(500, 'DKK'),
            //monthly: new Currency(129, 'DKK'),
            trn() {
                // EØS: 0.99% + 0,25% (if credit card, ie. 23% of cards)
                const trnfee = $avgvalue.scale(1.05 / 100);
                return (trnfee.order('DKK') > 0.29) ? trnfee : new Currency(0.29, 'DKK');
            }
        }
    },
    handelsbanken: {
        name: 'Handelsbanken',
        logo: 'handelsbanken.svg',
        wh: [90, 9],
        link: 'https://handelsbanken.dk/shb/inet/icentda.nsf/Default/' +
            'qC21926A235427DE6C12578810023DBB9?Opendocument',
        cards: new Set(['visa', 'mastercard', 'maestro']),
        fees: {
            trn() {
                return $avgvalue.scale(1.5 / 100);
            }
        }
    },
    swedbank: {
        name: 'Swedbank',
        logo: 'swedbank.png',
        wh: [75, 12],
        link: 'https://www.swedbank.dk/erhverv/card-services/priser-og-vilkar/#!/CID_2263482',
        cards: new Set(['visa', 'mastercard', 'maestro']),
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
    worldline: {
        name: 'Worldline',
        logo: 'worldline.svg',
        wh: [81.8, 11],
        link: 'http://www.bambora.com/',
        cards: new Set(['visa', 'mastercard', 'maestro']),
        fees: {
            trn() {
                return $avgvalue.scale(1.25 / 100);
            }
        }
    }
};

const PSPs = [
    {
        name: '2checkout',
        title: '2checkout',
        logo: '2checkout.svg',
        wh: [126.3, 15],
        link: 'https://www.2checkout.com/pricing/',
        cards: new Set(['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners']),
        features: new Set(['subscriptions']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'opencart', 'shopify']),
        fees: {
            trn() {
                return $revenue.scale(3.5 / 100).add(new Currency(0.3 * $qty, 'EUR'));
            }
        }
    },
    {
        name: 'Adyen',
        title: 'Adyen',
        logo: 'adyen.svg',
        wh: [90, 30],
        link: 'https://www.adyen.com/da_DK/priser',
        dankort: true,
        cards: new Set(['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners']),
        features: new Set(['subscriptions', 'applepay', 'mobilepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'opencart', 'shopify']),
        fees: {
            trn(o) {
                o.trn['Dankortaftale (0,32%)'] = $revenue.scale($dankortscale).scale(0.32 / 100);
                const intl = o.trn['Visa/Mastercard mm. (1,1%)'] = $revenue.scale(1 - $dankortscale).scale(1.1 / 100);
                const trnfee = o.trn['Adyen transaktionsgebyr (€0,1)'] = new Currency(0.1 * $qty, 'EUR');

                // Minimum fee (€100)
                const adyenTotal = intl.add(trnfee).order('EUR');
                if (adyenTotal < 100) {
                    o.monthly['Adyen minimumsfaktura (€100)'] = new Currency(100 - adyenTotal, 'EUR');
                }
            }
        }
    },
    {
        name: 'Braintree',
        title: 'Braintree',
        logo: 'braintree.svg',
        wh: [120.6, 16],
        link: 'https://www.braintreepayments.com/dk/braintree-pricing',
        cards: new Set(['visa', 'mastercard', 'maestro']),
        features: new Set(['subscriptions', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'opencart', 'shopify']),
        fees: {
            trn() {
                return $revenue.scale(1.9 / 100).add(new Currency(2.25 * $qty, 'DKK'));
            }
        }
    },
    {
        name: 'Certitrade',
        title: 'Certitrade all-in-one',
        logo: 'certitrade.svg',
        wh: [119.7, 25],
        link: 'https://certitrade.se',
        cards: new Set(['visa', 'mastercard', 'maestro']),
        features: new Set(['subscriptions']),
        modules: new Set(['woocommerce']),
        fees: {
            trn() {
                return $revenue.scale(2.1 / 100).add(new Currency(2.1 * $qty, 'SEK'));
            }
        }
    },
    {
        name: 'Certitrade',
        title: 'Certitrade Fast',
        logo: 'certitrade.svg',
        wh: [119.7, 25],
        link: 'https://certitrade.se',
        acqs: new Set(['worldline', 'clearhaus', 'swedbank', 'handelsbanken']),
        features: new Set(['subscriptions']),
        modules: new Set(['woocommerce']),
        fees: {
            monthly: new Currency(1000, 'SEK'),
            trn() {
                const freeTrns = 1000;
                if ($qty <= freeTrns) return new Currency(0, 'SEK');
                return new Currency(0.50 * ($qty - freeTrns), 'SEK');
            }
        }
    },
    {
        name: 'DanDomain',
        title: 'DanDomain Start-Up',
        logo: 'dandomain.svg',
        wh: [119.2, 22],
        link: 'https://dandomain.dk/betalingssystem/priser',
        dankort: true,
        acqs: new Set(['nets', 'clearhaus', 'worldline', 'swedbank']),
        features: new Set(['subscriptions', 'applepay', 'mobilepay']),
        modules: new Set(['woocommerce', 'thirty bees', 'prestashop', 'dandomain']),
        fees: {
            monthly(o) {
                if (opts.features.subscriptions) {
                    o.monthly['DanDomain modul'] = new Currency(99, 'DKK');
                }
            },
            trn() {
                return new Currency($qty, 'DKK');
            }
        }
    },
    {
        name: 'DanDomain',
        title: 'DanDomain Success',
        logo: 'dandomain.svg',
        wh: [119.2, 22],
        link: 'https://dandomain.dk/betalingssystem/priser',
        dankort: true,
        acqs: new Set(['nets', 'clearhaus', 'worldline', 'swedbank']),
        features: new Set(['subscriptions', 'applepay', 'mobilepay']),
        modules: new Set(['woocommerce', 'thirty bees', 'prestashop', 'dandomain']),
        fees: {
            monthly(o) {
                if (opts.features.subscriptions) {
                    o.monthly['DanDomain modul'] = new Currency(99, 'DKK');
                }
                return new Currency(149, 'DKK');
            },
            trn() {
                const freeTrns = 500;
                if ($qty <= freeTrns) return new Currency(0, 'DKK');
                return new Currency(0.25 * ($qty - freeTrns), 'DKK');
            }
        }
    },
    {
        name: 'Worldline',
        title: 'Worldline Checkout',
        logo: 'worldline.svg',
        wh: [118.97, 16],
        note: 'Tidl. Bambora/ePay',
        link: 'https://www.bambora.com/da/dk/online/',
        dankort: true,
        acqs: new Set(['worldline']),
        features: new Set(['subscriptions', 'mobilepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'opencart', 'shopify']),
        fees: {
            monthly(o) {
                if (opts.features.mobilepay) delete o.monthly.MobilePay; // Included for free
                return new Currency(195, 'DKK');
            }
        }
    },
    {
        name: 'Worldline',
        title: 'Worldline Pro+',
        logo: 'worldline.svg',
        wh: [118.97, 16],
        note: 'Tidl. Bambora/ePay',
        link: 'https://www.bambora.com/da/dk/online/',
        dankort: true,
        acqs: new Set(['worldline']),
        features: new Set(['subscriptions', 'mobilepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'shopify', 'shoporama']),
        fees: {
            monthly: new Currency(149, 'DKK'),
            trn() {
                const freeTrns = 250;
                if ($qty <= freeTrns) return new Currency(0, 'DKK');
                return new Currency(0.25 * ($qty - freeTrns), 'DKK');
            }
        }
    },
    {
        name: 'Freepay',
        title: 'Freepay',
        logo: 'freepay.svg',
        wh: [98, 20],
        link: 'https://freepay.dk/da/betalingsgateway/priser',
        dankort: true,
        acqs: new Set(['nets', 'clearhaus']),
        features: new Set(['subscriptions', 'mobilepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'opencart']),
        fees: {
            trn(o) {
                const qty = (o.trn.Clearhaus) ? $qty * $dankortscale : $qty;
                o.trn['Freepay 3D-secure opslag'] = new Currency(0.21 * qty, 'DKK');
            }
        }
    },
    {
        name: 'Lunar',
        title: 'Lunar Solo',
        logo: 'lunar.svg',
        wh: [74, 26],
        link: 'https://www.lunar.app/dk/erhverv/betalingsloesning',
        cards: new Set(['visa', 'mastercard']),
        features: new Set(['']),
        modules: new Set(['woocommerce']),
        fees: {
            trn() {
                return $revenue.scale(1.4 / 100).add(new Currency($qty, 'DKK'));
            }
        }
    },
    {
        name: 'Lunar',
        title: 'Lunar Grow',
        logo: 'lunar.svg',
        wh: [74, 26],
        link: 'https://www.lunar.app/dk/erhverv/betalingsloesning',
        cards: new Set(['visa', 'mastercard']),
        features: new Set(['']),
        modules: new Set(['woocommerce']),
        fees: {
            trn() {
                return $revenue.scale(1 / 100).add(new Currency($qty, 'DKK'));
            }
        }
    },
    {
        name: 'Mollie',
        title: 'Mollie',
        logo: 'mollie.svg',
        wh: [74, 22],
        link: 'https://www.mollie.com/en/pricing',
        cards: new Set(['visa', 'mastercard', 'maestro', 'amex']),
        features: new Set(['subscriptions', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'shopify']),
        fees: {
            trn() {
                return $revenue.scale(1.8 / 100).add(new Currency(0.25 * $qty, 'EUR'));
            }
        }
    },
    {
        name: 'Nets',
        title: 'Nets Easy',
        logo: 'nets-easy.svg',
        wh: [85, 25],
        link: 'https://www.nets.eu/da-DK/payments/online',
        cards: new Set(['dankort', 'visa', 'mastercard', 'maestro']),
        features: new Set(['subscriptions', 'mobilepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'opencart', 'shopify']),
        fees: {
            monthly: new Currency(199, 'DKK'),
            trn(o) {
                o.trn['Dankort (0,39% + 1 DKK)'] = $revenue.scale($dankortscale).scale(0.39 / 100)
                    .add(new Currency($dankortscale * $qty, 'DKK'));
                o.trn['Visa/Mastercard (1,35% + 0,5 DKK)'] = $revenue.scale(1 - $dankortscale).scale(1.35 / 100)
                    .add(new Currency((1 - $dankortscale) * $qty * 0.5, 'DKK'));
            }
        }
    },
    {
        name: 'Paylike',
        title: 'Paylike',
        logo: 'paylike.svg',
        wh: [99, 31],
        link: 'https://paylike.dk/pricing',
        cards: new Set(['visa', 'mastercard', 'maestro']),
        features: new Set(['subscriptions', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'opencart']),
        fees: {
            trn() {
                return $revenue.scale(1.35 / 100).add(new Currency(0.50 * $qty, 'DKK'));
            }
        }
    },
    {
        name: 'PayPal',
        title: 'PayPal',
        logo: 'paypal.svg',
        wh: [123.6, 30],
        link: 'https://www.paypal.com/dk/webapps/mpp/merchant-fees',
        cards: new Set(['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners']),
        features: new Set([]),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'thirtybees', 'opencart', 'shopify']),
        fees: {
            trn() {
                return $revenue.scale(1.9 / 100).add(new Currency(2.6 * $qty, 'DKK'));
            }
        }
    },
    {
        name: 'Payrexx',
        title: 'Payrexx Checkout',
        logo: 'payrexx.svg',
        wh: [100.5, 23],
        link: 'https://www.payrexx.com/da/pricing/',
        cards: new Set(['visa', 'mastercard', 'maestro', 'amex']),
        features: new Set(['subscriptions', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop']),
        fees: {
            monthly: new Currency(112, 'DKK'),
            trn() {
                return $revenue.scale(1.3 / 100).add(new Currency(1.5 * $qty, 'DKK'));
            }
        }
    },
    {
        name: 'Payrexx',
        title: 'Payrexx Starter',
        logo: 'payrexx.svg',
        wh: [100.5, 23],
        link: 'https://www.payrexx.com/da/pricing/',
        cards: new Set(['visa', 'mastercard', 'maestro', 'amex']),
        features: new Set(['subscriptions', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop']),
        fees: {
            monthly: new Currency(141, 'DKK'),
            trn() {
                return $revenue.scale(1.5 / 100).add(new Currency(1.5 * $qty, 'DKK'));
            }
        }
    },
    {
        name: 'Payrexx',
        title: 'Payrexx Plus',
        logo: 'payrexx.svg',
        wh: [100.5, 23],
        link: 'https://www.payrexx.com/da/pricing/',
        cards: new Set(['visa', 'mastercard', 'maestro', 'amex']),
        features: new Set(['subscriptions', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop']),
        fees: {
            monthly: new Currency(216, 'DKK'),
            trn() {
                return $revenue.scale(1.4 / 100).add(new Currency(1.5 * $qty, 'DKK'));
            }
        }
    },
    {
        name: 'Payrexx',
        title: 'Payrexx Pro',
        logo: 'payrexx.svg',
        wh: [100.5, 23],
        link: 'https://www.payrexx.com/da/pricing/',
        cards: new Set(['visa', 'mastercard', 'maestro', 'amex']),
        features: new Set(['subscriptions', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop']),
        fees: {
            monthly: new Currency(365, 'DKK'),
            trn() {
                return $revenue.scale(1.3 / 100).add(new Currency(1.5 * $qty, 'DKK'));
            }
        }
    },
    {
        name: 'Payson',
        title: 'Payson',
        logo: 'payson.png',
        wh: [121, 32],
        link: 'https://www.payson.se/en/company/price-list/',
        cards: new Set(['visa', 'mastercard', 'maestro']),
        features: new Set([]),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'opencart']),
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
        name: 'PensoPay',
        title: 'PensoPay Basis',
        logo: 'pensopay.svg',
        wh: [143, 14],
        note: 'Reseller af Quickpay',
        link: 'https://pensopay.com/hvorfor-pensopay/priser/',
        dankort: true,
        acqs: new Set(['nets', 'clearhaus']),
        features: new Set(['subscriptions', 'mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'thirtybees', 'shopify', 'dandomain']),
        fees: {
            trn() {
                return new Currency(4 * $qty, 'DKK');
            }
        }
    },
    {
        name: 'PensoPay',
        title: 'PensoPay Start-Up',
        logo: 'pensopay.svg',
        wh: [143, 14],
        note: 'Reseller af Quickpay',
        link: 'https://pensopay.com/hvorfor-pensopay/priser/',
        dankort: true,
        acqs: new Set(['nets', 'clearhaus']),
        features: new Set(['subscriptions', 'mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'thirtybees', 'shopify', 'dandomain']),
        fees: {
            monthly: new Currency(49, 'DKK'),
            trn() {
                return new Currency($qty, 'DKK');
            }
        }
    },
    {
        name: 'PensoPay',
        title: 'PensoPay Business',
        logo: 'pensopay.svg',
        wh: [143, 14],
        note: 'Reseller af Quickpay',
        link: 'https://pensopay.com/hvorfor-pensopay/priser/',
        dankort: true,
        acqs: new Set(['nets', 'clearhaus']),
        features: new Set(['subscriptions', 'mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'thirtybees', 'shopify', 'dandomain']),
        fees: {
            monthly: new Currency(99, 'DKK'),
            trn() {
                const freeTrns = 100;
                if ($qty <= freeTrns) return new Currency(0, 'DKK');
                return new Currency(0.35 * ($qty - freeTrns), 'DKK');
            }
        }
    },
    {
        name: 'PensoPay',
        title: 'PensoPay Pro',
        logo: 'pensopay.svg',
        wh: [143, 14],
        note: 'Reseller af Quickpay',
        link: 'https://pensopay.com/hvorfor-pensopay/priser/',
        dankort: true,
        acqs: new Set(['nets', 'clearhaus']),
        features: new Set(['subscriptions', 'mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'thirtybees', 'shopify', 'dandomain']),
        fees: {
            monthly: new Currency(149, 'DKK'),
            trn() {
                const freeTrns = 250;
                if ($qty <= freeTrns) return new Currency(0, 'DKK');
                return new Currency(0.25 * ($qty - freeTrns), 'DKK');
            }
        }
    },
    {
        name: 'Quickpay',
        title: 'Quickpay Professional',
        logo: 'quickpay.svg',
        wh: [138, 22.3],
        link: 'https://quickpay.net/dk/pricing',
        dankort: true,
        acqs: new Set(['clearhaus']),
        features: new Set(['subscriptions', 'mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'thirtybees', 'shopify', 'dandomain', 'shoporama']),
        fees: {
            monthly: new Currency(99, 'DKK'),
            trn(o) {
                o.trn.Clearhaus = $avgvalue.scale(1.35 / 100).scale($qty * (1 - $dankortscale)); // tmp fix
                return new Currency(0.25 * $qty, 'DKK');
            }
        }
    },
    {
        name: 'Reepay',
        title: 'Reepay Basic',
        logo: 'reepay.svg',
        wh: [97, 20],
        link: 'https://reepay.com/da/pricing/',
        dankort: true,
        acqs: new Set(['clearhaus', 'swedbank']),
        features: new Set(['subscriptions', 'mobilepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'dandomain']),
        fees: {
            // subscriptions: 249/mdr, 2kr * qty
            monthly: new Currency(49, 'DKK'),
            trn() {
                return new Currency($qty, 'DKK');
            }
        }
    },
    {
        name: 'Reepay',
        title: 'Reepay Standard',
        logo: 'reepay.svg',
        wh: [97, 20],
        link: 'https://reepay.com/da/pricing/',
        dankort: true,
        acqs: new Set(['clearhaus', 'swedbank', 'handelsbanken', 'worldline']),
        features: new Set(['subscriptions', 'mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'dandomain']),
        fees: {
            // subscriptions: 249/mdr, 1kr * qty
            monthly: new Currency(139, 'DKK'),
            trn() {
                const freeTrns = 250;
                if ($qty <= freeTrns) return new Currency(0, 'DKK');
                return new Currency(0.25 * ($qty - freeTrns), 'DKK');
            }
        }
    },
    {
        name: 'ScanNet',
        title: 'ScanNet Start-Up',
        logo: 'scannet.svg',
        wh: [93, 23],
        link: 'https://www.scannet.dk/betalingsloesning/prisoversigt/',
        dankort: true,
        acqs: new Set(['nets', 'clearhaus', 'swedbank']),
        features: new Set(['subscriptions', 'mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'thirty bees', 'prestashop', 'dandomain']),
        fees: {
            monthly(o) {
                if (opts.features.subscriptions) {
                    o.monthly['ScanNet modul'] = new Currency(99, 'DKK');
                }
                return new Currency(39, 'DKK');
            },
            trn() {
                return new Currency($qty, 'DKK');
            }
        }
    },
    {
        name: 'ScanNet',
        title: 'ScanNet Success',
        logo: 'scannet.svg',
        wh: [93, 23],
        link: 'https://www.scannet.dk/betalingsloesning/prisoversigt/',
        dankort: true,
        acqs: new Set(['nets', 'clearhaus', 'swedbank']),
        features: new Set(['subscriptions', 'mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'thirty bees', 'prestashop', 'dandomain']),
        fees: {
            monthly(o) {
                if (opts.features.subscriptions) {
                    o.monthly['ScanNet modul'] = new Currency(99, 'DKK');
                }
                return new Currency(99, 'DKK');
            },
            trn() {
                const freeTrns = 500;
                if ($qty <= freeTrns) return new Currency(0, 'DKK');
                return new Currency(0.25 * ($qty - freeTrns), 'DKK');
            }
        }
    },
    {
        name: 'Scanpay',
        title: 'Scanpay',
        logo: 'scanpay.svg',
        wh: [104, 23],
        link: 'https://scanpay.dk',
        dankort: true,
        acqs: new Set(['nets', 'clearhaus']),
        features: new Set(['subscriptions', 'mobilepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'thirtybees', 'opencart']),
        fees: {
            trn() {
                return new Currency(0.25 * $qty, 'DKK');
            }
        }
    },
    {
        name: 'Shipmondo',
        title: 'Shipmondo Payments',
        logo: 'shipmondo.svg',
        wh: [112, 24],
        note: 'Reseller af Quickpay',
        link: 'https://shipmondo.com/dk/shipmondo-payments/',
        dankort: true,
        acqs: new Set(['nets', 'clearhaus']),
        features: new Set(['mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'thirtybees', 'shopify', 'dandomain', 'shoporama']),
        fees: {
            trn() {
                const nonChQty = $qty * $dankortscale;
                let fee = 2; // <= 25 trns
                if (nonChQty > 250) fee = 0.2;
                else if (nonChQty > 100) fee = 0.5;
                else if (nonChQty > 50) fee = 0.8;
                else if (nonChQty > 25) fee = 1;
                return new Currency(fee * nonChQty, 'DKK');
            }
        }
    },
    {
        name: 'Shopify',
        title: 'Shopify basic',
        logo: 'shopify.svg',
        wh: [102, 29],
        link: 'https://www.shopify.dk/payments',
        cards: new Set(['visa', 'mastercard', 'jcb']),
        features: new Set(['subscriptions', 'applepay']),
        modules: new Set(['shopify']),
        fees: {
            trn() {
                return $revenue.scale(1.9 / 100).add(new Currency(1.8 * $qty, 'DKK'));
            }
        }
    },
    {
        name: 'Shopify',
        title: 'Shopify',
        logo: 'shopify.svg',
        wh: [102, 29],
        link: 'https://www.shopify.dk/payments',
        cards: new Set(['visa', 'mastercard', 'jcb']),
        features: new Set(['subscriptions', 'applepay']),
        modules: new Set(['shopify']),
        fees: {
            trn() {
                return $revenue.scale(1.8 / 100).add(new Currency(1.8 * $qty, 'DKK'));
            }
        }
    },
    {
        name: 'Shopify',
        title: 'Shopify advanced',
        logo: 'shopify.svg',
        wh: [102, 29],
        link: 'https://www.shopify.dk/payments',
        cards: new Set(['visa', 'mastercard', 'jcb']),
        features: new Set(['subscriptions', 'applepay']),
        modules: new Set(['shopify']),
        fees: {
            trn() {
                return $revenue.scale(1.6 / 100).add(new Currency(1.8 * $qty, 'DKK'));
            }
        }
    },
    {
        name: 'Stripe',
        title: 'Stripe',
        logo: 'stripe.svg',
        wh: [74.5, 31],
        link: 'https://stripe.com/en-dk/pricing',
        cards: new Set(['visa', 'mastercard', 'amex']),
        features: new Set(['subscriptions', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'thirtybees', 'shopify']),
        fees: {
            trn() {
                return $revenue.scale(1.4 / 100).add(new Currency(1.8 * $qty, 'DKK'));
            }
        }
    },
    {
        name: 'Swiipe',
        title: 'Swiipe Basic',
        logo: 'swiipe.svg',
        wh: [90, 26],
        link: 'https://swiipe.com/#pris',
        dankort: true,
        acqs: new Set(['clearhaus']),
        features: new Set(['mobilepay']),
        modules: new Set(['woocommerce', 'magento']),
        fees: {
            monthly: new Currency(49, 'DKK'),
            trn() {
                return new Currency($qty, 'DKK');
            }
        }
    },
    {
        name: 'Swiipe',
        title: 'Swiipe Business',
        logo: 'swiipe.svg',
        wh: [90, 26],
        link: 'https://swiipe.com/#pris',
        dankort: true,
        acqs: new Set(['clearhaus']),
        features: new Set(['mobilepay']),
        modules: new Set(['woocommerce', 'magento']),
        fees: {
            monthly: new Currency(129, 'DKK'),
            trn() {
                return new Currency(0.25 * $qty, 'DKK');
            }
        }
    }
];
