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
                /*
                    TODO: Rework acqs to allow multiple lines
                    o.trn['Clearhaus Indløsning (1,25%)'] = $revenue.scale(1.25 / 100);
                    o.trn['Clearhaus auth gebyr (0,22 DKK)'] = new Currency(.22 * $qty, 'DKK');
                    o.trn['Clearhaus 3D Secure gebyr (0,30 DKK)'] = new Currency(.30 * $qty, 'DKK');
                */
                return $avgvalue.scale(1.25 / 100).add(new Currency(.52, 'DKK'));
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
            monthly() {
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
        title: '2SELL',
        logo: '2checkout.svg',
        wh: [126.3, 15],
        link: 'https://www.2checkout.com/pricing/',
        cards: new Set(['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners']),
        features: new Set([]),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'shopify']),
        fees: {
            trn(o) {
                o.trn['Indløsning (3,5%)'] = $revenue.scale(3.5 / 100);
                o.trn['Transaktionsgebyr (€0,3)'] = new Currency(.3 * $qty, 'EUR');
                return;
            }
        }
    },
    {
        name: '2checkout',
        title: '2SUBSCRIBE',
        logo: '2checkout.svg',
        wh: [126.3, 15],
        link: 'https://www.2checkout.com/pricing/',
        cards: new Set(['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners']),
        features: new Set(['subscriptions']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'opencart', 'shopify']),
        fees: {
            trn(o) {
                o.trn['Indløsning (4,5%)'] = $revenue.scale(4.5 / 100);
                o.trn['Transaktionsgebyr (€0,4)'] = new Currency(.4 * $qty, 'EUR');
                return;
            }
        }
    },
    {
        name: '2checkout',
        title: '2MONETIZE',
        logo: '2checkout.svg',
        wh: [126.3, 15],
        link: 'https://www.2checkout.com/pricing/',
        cards: new Set(['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners']),
        features: new Set(['subscriptions']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'opencart', 'shopify']),
        fees: {
            trn(o) {
                o.trn['Indløsning (6%)'] = $revenue.scale(6 / 100);
                o.trn['Transaktionsgebyr (€0,5)'] = new Currency(.5 * $qty, 'EUR');
                return;
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
                const intl = o.trn['Indløsning (1,1%)'] = $revenue.scale(1 - $dankortscale).scale(1.1 / 100);
                const trnfee = o.trn['Transaktionsgebyr (€0,11)'] = new Currency(0.11 * $qty, 'EUR');

                // Minimum fee (€100) https://www.adyen.com/payment-methods/benefit
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
            trn(o) {
                o.trn['Indløsning (1,9%)'] = $revenue.scale(1.9 / 100);
                o.trn['Transaktionsgebyr (2,25 kr.)'] = new Currency(2.25 * $qty, 'DKK');
                return;
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
            trn(o) {
                o.trn['Indløsning (2,1%)'] = $revenue.scale(2.1 / 100);
                o.trn['Transaktionsgebyr (2,1 SEK)'] = new Currency(2.1 * $qty, 'SEK');
                return;
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
        title: 'DanDomain Start-up',
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
                    o.monthly['Abonnementsbetalinger'] = new Currency(99, 'DKK');
                }
                return;
            },
            trn(o) {
                o.trn['Transaktionsgebyr (1 kr.)'] = new Currency($qty, 'DKK');
                return;
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
                    o.monthly['Abonnementsbetalinger'] = new Currency(99, 'DKK');
                }
                return new Currency(149, 'DKK');
            },
            trn(o) {
                const freeTrns = Math.min($qty, 500);
                o.trn['Transaktionsgebyr (0,25 kr.)'] = new Currency(0.25 * $qty, 'DKK');
                o.trn[freeTrns + ' gratis transaktioner'] = (new Currency(-0.25 * freeTrns, 'DKK'));
                return;
            }
        }
    },
    {
        name: 'Worldline',
        title: 'Worldline Checkout',
        logo: 'worldline.svg',
        wh: [118.97, 16],
        note: 'Tidl. Bambora',
        link: 'https://www.bambora.com/da/dk/online/',
        dankort: true,
        acqs: new Set(['worldline']),
        features: new Set(['subscriptions', 'mobilepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'opencart']),
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
        note: 'Tidl. ePay platform',
        link: 'https://www.bambora.com/da/dk/online/',
        dankort: true,
        acqs: new Set(['worldline']),
        features: new Set(['subscriptions', 'mobilepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'ideal.shop']),
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
        features: new Set(['subscriptions', 'mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'opencart']),
        fees: {
            trn(o) {
                const qty = (o.trn.Clearhaus) ? $qty * $dankortscale : $qty;
                o.trn['Freepay 3-D Secure'] = new Currency(0.25 * qty, 'DKK');
            }
        }
    },
    {
        name: 'Lunar',
        title: 'Lunar',
        logo: 'lunar.svg',
        wh: [74, 26],
        link: 'https://www.lunar.app/dk/erhverv/online-betaling-til-webshops',
        cards: new Set(['visa', 'mastercard']),
        features: new Set(['mobilepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'opencart']),
        fees: {
            monthly: new Currency(49, 'DKK'),
            trn(o) {
                o.trn['Indløsning (1%)'] = $revenue.scale(1 / 100);
                o.trn['Transaktionsgebyr (1 kr.)'] = new Currency($qty, 'DKK');
                return;
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
            trn(o) {
                o.trn['Indløsning (1,8%)'] = $revenue.scale(1.8 / 100);
                o.trn['Transaktionsgebyr (€0,25)'] = new Currency(0.25 * $qty, 'EUR');
                return;
            }
        }
    },
    /*
    2023-04-04: Nets Easy er fjernet pga. manglende prisoversigt.
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
    */
    {
        name: 'Paylike',
        title: 'Paylike',
        logo: 'paylike.svg',
        wh: [99, 31],
        link: 'https://paylike.dk/pricing',
        cards: new Set(['visa', 'mastercard', 'maestro']),
        features: new Set(['subscriptions']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'opencart']),
        fees: {
            trn(o) {
                o.trn['Indløsning (1,35%)'] = $revenue.scale(1.35 / 100);
                o.trn['Transaktionsgebyr (0,5 kr.)'] = new Currency(0.5 * $qty, 'DKK');
                return;
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
        features: new Set(['subscriptions']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'thirtybees', 'opencart', 'shopify']),
        fees: {
            trn(o) {
                // Subscriptions (https://www.paypal.com/merchantapps/appcenter/acceptpayments/subscriptions)
                if (opts.features.subscriptions) {
                    o.trn['Indløsning (3,4%)'] = $revenue.scale(3.4 / 100);
                } else {
                    o.trn['Indløsning (1,9%)'] = $revenue.scale(1.9 / 100);
                }
                o.trn['Transaktionsgebyr (2,6 kr.)'] = new Currency(2.6 * $qty, 'DKK');
                return;
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
            trn(o) {
                o.trn['Indløsning (1,3%)'] = $revenue.scale(1.3 / 100);
                o.trn['Transaktionsgebyr (1,5 kr.)'] = new Currency(1.5 * $qty, 'DKK');
                return;
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
            trn(o) {
                o.trn['Indløsning (1,5%)'] = $revenue.scale(1.5 / 100);
                o.trn['Transaktionsgebyr (1,5 kr.)'] = new Currency(1.5 * $qty, 'DKK');
                return;
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
            trn(o) {
                o.trn['Indløsning (1,4%)'] = $revenue.scale(1.4 / 100);
                o.trn['Transaktionsgebyr (1,5 kr.)'] = new Currency(1.5 * $qty, 'DKK');
                return;
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
            trn(o) {
                o.trn['Indløsning (1,3%)'] = $revenue.scale(1.3 / 100);
                o.trn['Transaktionsgebyr (1,5 kr.)'] = new Currency(1.5 * $qty, 'DKK');
                return;
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
                const str = 'Indløsning (' + fee.toString().replace('.', ',') + '%)';
                o.trn[str] = $revenue.scale(fee / 100);
                return;
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
        cards: new Set(['visa', 'mastercard', 'maestro']),
        dankort: true,
        features: new Set(['subscriptions', 'mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'thirtybees', 'shopify', 'dandomain', 'ideal.shop']),
        fees: {
            trn(o) {
                o.trn['Dankortaftale (0,32%)'] = $revenue.scale($dankortscale).scale(0.32 / 100);
                o.trn['Indløsning (1,25%)'] = $revenue.scale(1 - $dankortscale).scale(1.25 / 100);
                o.trn['Transaktionsgebyr (4 kr.)'] = new Currency(4 * $qty, 'DKK');
                const cqty = (1 - $dankortscale) * $qty;
                o.trn['Autorisationsgebyr (0,22 kr.)'] = new Currency(0.22 * cqty, 'DKK');
                o.trn['3D Secure gebyr (0,30 kr.)'] = new Currency(0.3 * cqty, 'DKK');
                return;
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
        cards: new Set(['visa', 'mastercard', 'maestro']),
        dankort: true,
        features: new Set(['subscriptions', 'mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'thirtybees', 'shopify', 'dandomain', 'ideal.shop']),
        fees: {
            monthly: new Currency(49, 'DKK'),
            trn(o) {
                o.trn['Dankortaftale (0,32%)'] = $revenue.scale($dankortscale).scale(0.32 / 100);
                o.trn['Indløsning (1,25%)'] = $revenue.scale(1 - $dankortscale).scale(1.25 / 100);
                o.trn['Transaktionsgebyr (1 kr.)'] = new Currency($qty, 'DKK');
                const cqty = (1 - $dankortscale) * $qty;
                o.trn['Autorisationsgebyr (0,22 kr.)'] = new Currency(0.22 * cqty, 'DKK');
                o.trn['3D Secure gebyr (0,30 kr.)'] = new Currency(0.3 * cqty, 'DKK');
                return;
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
        cards: new Set(['visa', 'mastercard', 'maestro']),
        dankort: true,
        features: new Set(['subscriptions', 'mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'thirtybees', 'shopify', 'dandomain', 'ideal.shop']),
        fees: {
            monthly: new Currency(99, 'DKK'),
            trn(o) {
                const freeTrns = Math.min($qty, 100);
                o.trn['Dankortaftale (0,32%)'] = $revenue.scale($dankortscale).scale(0.32 / 100);
                o.trn['Indløsning (1,25%)'] = $revenue.scale(1 - $dankortscale).scale(1.25 / 100);
                o.trn['Transaktionsgebyr (0,35 kr.)'] = new Currency(0.35 * $qty, 'DKK');
                o.trn[freeTrns + ' gratis transaktioner'] = new Currency(-0.35 * freeTrns, 'DKK');
                const cqty = (1 - $dankortscale) * $qty;
                o.trn['Autorisationsgebyr (0,22 kr.)'] = new Currency(0.22 * cqty, 'DKK');
                o.trn['3D Secure gebyr (0,30 kr.)'] = new Currency(0.3 * cqty, 'DKK');
                return;
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
        cards: new Set(['visa', 'mastercard', 'maestro']),
        dankort: true,
        features: new Set(['subscriptions', 'mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'thirtybees', 'shopify', 'dandomain', 'ideal.shop']),
        fees: {
            monthly: new Currency(149, 'DKK'),
            trn(o) {
                const freeTrns = Math.min($qty, 250);
                o.trn['Dankortaftale (0,32%)'] = $revenue.scale($dankortscale).scale(0.32 / 100);
                o.trn['Indløsning (1,25%)'] = $revenue.scale(1 - $dankortscale).scale(1.25 / 100);
                o.trn['Transaktionsgebyr (0,25 kr.)'] = new Currency(0.25 * $qty, 'DKK');
                o.trn[freeTrns + ' gratis transaktioner'] = new Currency(-0.25 * freeTrns, 'DKK');
                const cqty = (1 - $dankortscale) * $qty;
                o.trn['Autorisationsgebyr (0,22 kr.)'] = new Currency(0.22 * cqty, 'DKK');
                o.trn['3D Secure gebyr (0,30 kr.)'] = new Currency(0.3 * cqty, 'DKK');
                return;
            }
        }
    },
    {
        name: 'Quickpay',
        title: 'Quickpay Merchant',
        logo: 'quickpay.svg',
        wh: [138, 22.3],
        link: 'https://quickpay.net/prices-dk/',
        dankort: true,
        acqs: new Set(['clearhaus']),
        features: new Set(['subscriptions', 'mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'thirtybees', 'shopify', 'dandomain',
            'shoporama', 'ideal.shop']),
        fees: {
            monthly(o) {
                o.monthly['Abonnement'] = new Currency(99, 'DKK');
                o.monthly['Ekstra abonnement'] = new Currency(30, 'DKK');
            },
            trn(o) {
                o.trn['Ekstra Quickpay dankortgebyr'] = new Currency(0.25 * $dankortscale * $qty, 'DKK');
                o.trn['Transaktionsgebyr (0,25 kr.)'] = new Currency(0.25 * $qty, 'DKK');
                if (o.trn.Clearhaus) {
                    const cqty = (1 - $dankortscale) * $qty;
                    delete o.trn.Clearhaus;
                    o.trn['Indløsning (1,35%)'] = $revenue.scale(1 - $dankortscale).scale(1.35 / 100);
                    o.trn['Autorisationsgebyr (0,22 kr.)'] = new Currency(0.22 * cqty, 'DKK');
                    o.trn['3D Secure gebyr (0,30 kr.)'] = new Currency(0.3 * cqty, 'DKK');
                }
                return;
            }
        }
    },
    {
        name: 'Billwerk+',
        title: 'Billwerk+ Payments',
        logo: 'reepay.svg',
        wh: [97, 20],
        link: 'https://www.billwerk.plus/da/pricing/',
        dankort: true,
        acqs: new Set(['clearhaus', 'swedbank']),
        features: new Set(['mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'dandomain']),
        fees: {
            monthly(o) {
                o.monthly['Abonnement'] = new Currency(139, 'DKK');
            },
            trn(o) {
                o.trn['Transaktionsgebyr (0,25 kr.)'] = new Currency(0.25 * $qty, 'DKK');
                return;
            }
        }
    },
    {
        name: 'Billwerk+',
        title: 'Billwerk+ Subscription Management (Lite)',
        logo: 'reepay.svg',
        wh: [97, 20],
        link: 'https://www.billwerk.plus/da/pricing/',
        dankort: true,
        acqs: new Set(['clearhaus', 'swedbank', 'handelsbanken', 'worldline']),
        features: new Set(['subscriptions', 'mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'dandomain']),
        fees: {
            monthly(o) {
                o.monthly['Abonnement'] = new Currency(349, 'DKK');
            },
            trn(o) {
                o.trn['Transaktionsgebyr (0,25 kr.)'] = new Currency(0.25 * $qty, 'DKK');
                o.trn['Omæstningsgebyr (0,75%)'] = $revenue.scale(0.75 / 100);
                return;
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
        acqs: new Set(['nets', 'clearhaus', 'swedbank', 'worldline']),
        features: new Set(['subscriptions', 'mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'thirty bees', 'prestashop', 'dandomain']),
        fees: {
            monthly(o) {
                if (opts.features.subscriptions) {
                    o.monthly['Abonnementsbetalinger'] = new Currency(99, 'DKK');
                }
                o.monthly['Abonnement'] = new Currency(39, 'DKK');
                return;
            },
            trn(o) {
                o.trn['Transaktionsgebyr (1 kr.)'] = new Currency($qty, 'DKK');
                return;
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
        acqs: new Set(['nets', 'clearhaus', 'swedbank', 'worldline']),
        features: new Set(['subscriptions', 'mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'thirty bees', 'prestashop', 'dandomain']),
        fees: {
            monthly(o) {
                if (opts.features.subscriptions) {
                    o.monthly['Abonnementsbetalinger'] = new Currency(99, 'DKK');
                }
                o.monthly['Abonnement'] = new Currency(149, 'DKK');
                return;
            },
            trn(o) {
                const freeTrns = Math.min($qty, 500);
                o.trn['Transaktionsgebyr (0,25 kr.)'] = new Currency(0.25 * $qty, 'DKK');
                o.trn[freeTrns + ' gratis transaktioner'] = (new Currency(-0.25 * freeTrns, 'DKK'));
                return;
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
        features: new Set(['subscriptions', 'mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'thirtybees', 'opencart']),
        fees: {
            trn(o) {
                o.trn['Transaktionsgebyr (0,25 kr.)'] = new Currency(0.25 * $qty, 'DKK');
                return;
            }
        }
    },
    {
        name: 'Shipmondo',
        title: 'Shipmondo Payments',
        logo: 'shipmondo.svg',
        wh: [112, 24],
        note: 'Reseller af Billwerk+',
        link: 'https://help.shipmondo.com/da/articles/6015622-shipmondo-payments-tilvalg-og-priser',
        dankort: true,
        acqs: new Set(['worldline', 'valitor']),
        features: new Set(['mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'thirtybees', 'shopify', 'dandomain', 'shoporama']),
        fees: {
            trn(o) {
                let num = Math.min($qty, 25);
                o.trn[num + ' * transaktionsgebyr (1 kr.)'] = new Currency(num, 'DKK');

                if ($qty > 25) {
                    num = Math.min(($qty - 25), 25);
                    o.trn[num + ' * transaktionsgebyr (0,8 kr.)'] = new Currency(num * 0.8, 'DKK');
                }
                if ($qty > 50) {
                    num = Math.min(($qty - 50), 50);
                    o.trn[num + ' * transaktionsgebyr (0,4 kr.)'] = new Currency(num * 0.4, 'DKK');
                }
                if ($qty > 100) {
                    num = Math.min(($qty - 100), 51);
                    o.trn[num + ' * transaktionsgebyr (0,3 kr.)'] = new Currency(num * 0.3, 'DKK');
                }
                if ($qty > 151) {
                    num = $qty - 151;
                    o.trn[num + ' * transaktionsgebyr (0,2 kr.)'] = new Currency(num * 0.2, 'DKK');
                }
            }
        }
    },
    {
        name: 'Shopify',
        title: 'Shopify Payments',
        logo: 'shopify.svg',
        wh: [102, 29],
        link: 'https://www.shopify.dk/payments',
        cards: new Set(['visa', 'mastercard', 'jcb', 'amex']),
        features: new Set(['subscriptions', 'applepay']),
        modules: new Set(['shopify']),
        fees: {
            trn(o) {
                const fee = (opts.shopify === 'Basic') ? 1.9 : (opts.shopify === 'Shopify') ? 1.8 : 1.6;
                o.trn[`Indløsning (${fee.toString().replace('.', ',')}%)`] = $revenue.scale(fee / 100);
                o.trn['Transaktionsgebyr (1,8 kr.)'] = new Currency(1.8 * $qty, 'DKK');
                return;
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
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'thirtybees']),
        fees: {
            trn(o) {
                o.trn[`Indløsning (1,5%)`] = $revenue.scale(1.5 / 100);
                o.trn[`Transaktionsgebyr (1,8 kr.)`] = new Currency(1.8 * $qty, 'DKK');
                return;
            }
        }
    },
    {
        name: 'Swiipe',
        title: 'Swiipe Basic',
        logo: 'swiipe.svg',
        wh: [90, 26],
        link: 'https://swiipe.com/priser/',
        cards: new Set(['visa', 'mastercard']),
        features: new Set(['mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'magento']),
        fees: {
            monthly: new Currency(49, 'DKK'),
            trn(o) {
                o.trn[`Indløsning (1,25%)`] = $revenue.scale(1.25 / 100);
                o.trn[`Transaktionsgebyr (1 kr.)`] = new Currency($qty, 'DKK');
                return;
            }
        }
    },
    {
        name: 'Swiipe',
        title: 'Swiipe Business',
        logo: 'swiipe.svg',
        wh: [90, 26],
        link: 'https://swiipe.com/priser/',
        dankort: true,
        cards: new Set(['visa', 'mastercard']),
        features: new Set(['mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'magento']),
        fees: {
            monthly: new Currency(129, 'DKK'),
            trn(o) {
                o.trn['Dankortaftale (0,32%)'] = $revenue.scale($dankortscale).scale(0.32 / 100);
                o.trn['Indløsning (1,25%)'] = $revenue.scale(1 - $dankortscale).scale(1.25 / 100);
                o.trn[`Transaktionsgebyr (0,25 kr.)`] = new Currency(0.25 * $qty, 'DKK');
                return;
            }
        }
    }
];
