
const DankortFees = {
    // https://www.dankort.dk/dk/priser/
    trn() {
        return $avgvalue.scale(0.32 / 100);
    }
};

// Only PrestaShop 1.7 support. PrestaShop and OpenCart are paid modules ($73.65)
const billwerkModules = new Set(['woocommerce', 'magento', 'prestashop-1', 'opencart', 'dandomain', 'shopify']);

const ACQs = {
    clearhaus: {
        name: 'Clearhaus',
        logo: ['clearhaus.svg', 76.66, 13],
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
                return $avgvalue.scale(1.25 / 100).min(0.60, 'DKK')
                    .add(new Currency(0.22, 'DKK'))     // Auth gebyr
                    .add(new Currency(0.30, 'DKK'));    // 3D Secure
            }
        }
    },
    nets: {
        name: 'Nets',
        logo: ['nets.svg', 51.3, 15],
        link: 'https://my.nets.eu/landingpage?landingPageId=DK&language=da',
        cards: new Set(['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners']),
        fees: {
            monthly: new Currency(129, 'DKK'),
            trn() {
                /*
                 * Visa/MC: 0,99 % (min. 0,29 kr.)
                 * Card not present: + 0,30 %
                 * Credit cards: + 0,25 %
                 * ~23% of cards are credit cards
                 * 1,29% + (0,25% * 23%) = 1,35%
                 * ---
                 * 3D secure: 0,35 kr.
                 * Recurring: 0,05%
                 * Visa præ-auth: 0,02%
                 * Mastercard præ-autorisering: 0,08%
                 * Mastercard tokenization: 0,05%
                 */
                return $avgvalue.scale(1.35 / 100).min(0.29, 'DKK')
                    .add(new Currency(0.35, 'DKK'));
            }
        }
    },
    /*
    This needs to be verified.
    shift4: {
        name: 'Shift4',
        logo: ['shift4.svg', 76.66, 13],
        link: 'https://www.shift4.com/',
        cards: new Set(['visa', 'mastercard', 'maestro']),
        fees: {
            trn() {
                return $avgvalue.scale(0.99 / 100).min(0.60, 'DKK');
            }
        }
    },
    */
    swedbank: {
        name: 'Swedbank',
        logo: ['swedbank.png', 75, 12],
        link: 'https://www.swedbankpay.dk/',
        cards: new Set(['visa', 'mastercard', 'maestro']),
        fees: {
            monthly() {
                // There is a minimum fee of 350 DKK / month.
                const TC = $revenueIntl.scale(1.25 / 100).order('DKK');
                const minFee = (TC < 350) ? 350 - TC : 0;
                return new Currency(minFee, 'DKK');
            },
            trn() {
                // 2025-01-14: Swedbank claims there are no auth or 3DS fees.
                return $avgvalue.scale(1.25 / 100);
            }
        }
    },
    /*
    This needs to be verified.
    trust: {
        name: 'Trust',
        logo: ['trust.svg', 76.66, 13],
        link: 'https://www.trustpayments.com/products/acquiring/',
        cards: new Set(['visa', 'mastercard', 'maestro']),
        fees: {
            trn() {
                return $avgvalue.scale(0.99 / 100).min(0.60, 'DKK');
            }
        }
    },
    */
    worldline: {
        name: 'Worldline',
        logo: ['worldline.svg', 81.8, 11],
        link: 'https://worldline.com/da-dk/home',
        cards: new Set(['visa', 'mastercard', 'maestro']),
        fees: {
            trn() {
                // 2025-01-14: Worldline claims there are no auth or 3DS fees.
                return $avgvalue.scale(1.25 / 100);
            }
        }
    }
};

const PSPs = [
    {
        name: '2checkout',
        title: '2SELL',
        logo: ['verifone.svg', 114.78, 22],
        link: 'https://www.2checkout.com/pricing/',
        cards: new Set(['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners']),
        features: new Set([]),
        modules: new Set(['woocommerce', 'magento', 'prestashop-1', 'shopify']),
        term: 0,
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
        logo: ['verifone.svg', 114.78, 22],
        link: 'https://www.2checkout.com/pricing/',
        cards: new Set(['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners']),
        features: new Set(['subscriptions']),
        modules: new Set(['woocommerce', 'magento', 'prestashop-1', 'opencart', 'shopify']),
        term: 0,
        fees: {
            trn(o) {
                o.trn['Indløsning (4,5%)'] = $revenue.scale(4.5 / 100);
                o.trn['Transaktionsgebyr (€0,4)'] = new Currency(.4 * $qty, 'EUR');
                return;
            }
        }
    },
    {
        name: 'Billwerk+',
        title: 'Billwerk+ Pay',
        logo: ['billwerk.png', 130, 16],
        link: 'https://www.billwerk.plus/da/betalingsloesning-priser/',
        dankort: true,
        acqs: new Set(['clearhaus', 'swedbank']),
        features: new Set(['subscriptions', 'mobilepay', 'applepay']),
        modules: billwerkModules,
        term: 3,
        fees: {
            monthly: new Currency(139, 'DKK'),
            trn(o) {
                const freeTrns = Math.min($qty, 250);
                o.trn['Transaktionsgebyr (0,25 kr.)'] = new Currency(0.25 * $qty, 'DKK');
                o.trn[freeTrns + ' gratis transaktioner'] = (new Currency(-0.25 * freeTrns, 'DKK'));
                if (opts.features.mobilepay) {
                    o.trn['MobilePay (' + $qtyMobilepay + ' * 1,02 kr.)'] = new Currency(1.02 * $qtyMobilepay, 'DKK');
                    o.monthly['MobilePay'] = new Currency(49, 'DKK');
                }
                if (opts.module === 'shopify') {
                    o.trn['Billwerk shopify-gebyr (0,25%)'] = $revenueIntl.scale(0.25 / 100);
                }
            }
        }
    },
    {
        name: 'Braintree',
        title: 'Braintree',
        logo: ['braintree.svg', 120.5, 16],
        link: 'https://www.paypal.com/dk/enterprise/paypal-braintree-fees',
        cards: new Set(['visa', 'mastercard', 'maestro']),
        features: new Set(['subscriptions', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop-1', 'opencart', 'shopify']),
        term: 0,
        fees: {
            trn(o) {
                o.trn['Indløsning (1,9%)'] = $revenue.scale(1.9 / 100);
                o.trn['Transaktionsgebyr (2,25 kr.)'] = new Currency(2.25 * $qty, 'DKK');
                return;
            }
        }
    },
    {
        name: 'OnPay',
        title: 'OnPay Start-up',
        logo: ['onpay.svg', 75.5, 24],
        link: 'https://dandomain.dk/betalingssystem/priser',
        dankort: true,
        acqs: new Set(['nets', 'clearhaus', 'worldline', 'swedbank']),
        features: new Set(['subscriptions', 'applepay', 'mobilepay']),
        modules: new Set(['woocommerce', 'thirtybees', 'prestashop-1', 'dandomain', 'magento', 'shoporama']),
        term: 6,
        fees: {
            monthly(o) {
                if (opts.features.subscriptions) {
                    o.monthly['Abonnementsbetalinger'] = new Currency(99, 'DKK');
                }
                return new Currency(9, 'DKK');
            },
            trn(o) {
                o.trn['Transaktionsgebyr (1 kr.)'] = new Currency($qty, 'DKK');
                if (opts.features.mobilepay) {
                    o.trn['MobilePay (' + $qtyMobilepay + ' * 1,02 kr.)'] = new Currency(1.02 * $qtyMobilepay, 'DKK');
                    o.monthly['MobilePay'] = new Currency(49, 'DKK');
                }
                const netsTrns = (o.trn.Nets) ? $qty : $qtyDankort;
                o.trn['OnPay Nets-gebyr (0,5 kr.)'] = new Currency(0.50 * netsTrns, 'DKK');
                return;
            }
        }
    },
    {
        name: 'OnPay',
        title: 'OnPay Success',
        logo: ['onpay.svg', 75.5, 24],
        link: 'https://dandomain.dk/betalingssystem/priser',
        dankort: true,
        acqs: new Set(['nets', 'clearhaus', 'worldline', 'swedbank']),
        features: new Set(['subscriptions', 'applepay', 'mobilepay']),
        modules: new Set(['woocommerce', 'thirtybees', 'prestashop-1', 'dandomain', 'magento', 'shoporama']),
        term: 6,
        fees: {
            monthly(o) {
                if (opts.features.subscriptions) {
                    o.monthly['Abonnementsbetalinger'] = new Currency(99, 'DKK');
                }
                return new Currency(149, 'DKK');
            },
            trn(o) {
                const freeTrns = Math.min($qty, 300);
                o.trn['Transaktionsgebyr (0,25 kr.)'] = new Currency(0.25 * $qty, 'DKK');
                o.trn[freeTrns + ' gratis transaktioner'] = (new Currency(-0.25 * freeTrns, 'DKK'));

                if (opts.features.mobilepay) {
                    o.trn['MobilePay (' + $qtyMobilepay + ' * 1,02 kr.)'] = new Currency(1.02 * $qtyMobilepay, 'DKK');
                    o.monthly['MobilePay'] = new Currency(49, 'DKK');
                }
                const netsTrns = (o.trn.Nets) ? $qty : $qtyDankort;
                o.trn['OnPay Nets-gebyr (0,5 kr.)'] = new Currency(0.50 * netsTrns, 'DKK');
                return;
            }
        }
    },
    {
        name: 'ePay',
        title: 'ePay Light',
        logo: ['epay.svg', 97.7, 22],
        link: 'https://epay.dk/priser',
        cards: new Set(['visa', 'mastercard', 'maestro']),
        features: new Set(['mobilepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'prestashop-1']),
        term: 3,
        fees: {
            monthly: new Currency(99, 'DKK'),
            trn(o) {
                o.trn['Transaktionsgebyr (0,25 kr.)'] = new Currency(0.25 * $qty, 'DKK');
                o.trn['Indløsning (1,25%)'] = $revenue.scale(1.25 / 100);
                if (opts.features.mobilepay) {
                    o.trn['MobilePay (' + $qtyMobilepay + ' * 1 kr.)'] = new Currency($qtyMobilepay, 'DKK');
                    o.monthly['MobilePay'] = new Currency(49, 'DKK');
                }
                return;
            }
        }
    },
    {
        name: 'ePay',
        title: 'ePay Pro',
        logo: ['epay.svg', 97.7, 22],
        link: 'https://epay.dk/priser',
        dankort: true,
        cards: new Set(['visa', 'mastercard', 'maestro']),
        features: new Set(['mobilepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'prestashop-1']),
        term: 3,
        fees: {
            monthly: new Currency(149, 'DKK'),
            trn(o) {
                o.trn['Transaktionsgebyr (0,25 kr.)'] = new Currency(0.25 * $qty, 'DKK');
                o.trn['Indløsning (1,25%)'] = $revenueIntl.scale(1.25 / 100);
                o.trn['Dankort (0,32%)'] = $trnfeeDankort;
                if (opts.features.mobilepay) {
                    o.trn['MobilePay (' + $qtyMobilepay + ' * 1 kr.)'] = new Currency($qtyMobilepay, 'DKK');
                    o.monthly['MobilePay'] = new Currency(49, 'DKK');
                }
                return;
            }
        }
    },
    {
        name: 'ePay',
        title: 'ePay Business',
        logo: ['epay.svg', 97.7, 22],
        link: 'https://epay.dk/priser',
        dankort: true,
        acqs: new Set(['worldline']),
        features: new Set(['subscriptions', 'mobilepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'prestashop-1']),
        term: 3,
        fees: {
            monthly: new Currency(249, 'DKK'),
            trn(o) {
                o.trn['Transaktionsgebyr (0,25 kr.)'] = new Currency(0.25 * $qty, 'DKK');
                if (opts.features.mobilepay) {
                    o.trn['MobilePay (' + $qtyMobilepay + ' * 1 kr.)'] = new Currency($qtyMobilepay, 'DKK');
                    o.monthly['MobilePay'] = new Currency(49, 'DKK');
                }
                return;
            }
        }
    },
    {
        name: 'Flatpay',
        title: 'Flatpay',
        note: 'Reseller af Billwerk+',
        logo: ['flatpay.svg', 104, 23],
        link: 'https://www.flatpay.com/da/produkter/online-betalinger',
        cards: new Set(['visa', 'mastercard', 'maestro']),
        features: new Set(['subscriptions', 'mobilepay', 'applepay']),
        modules: billwerkModules,
        term: 36,
        notice: {
            term: 'Ved opsigelse af din aftale skal du betale et månedligt gebyr på 399 kr. for resten af bindingsperioden. Hvis der eksempelvis er 36 måneder tilbage, vil det samlede beløb udgøre 14.364 kr.',
            monthly: 'Hvis din månedlige kortomsætning er under 10.000 kr, skal du betale et fast månedligt gebyr på 399 kr.'
        },
        fees: {
            monthly(o) {
                if ($revenue.order('DKK') < (10000)) {
                    return new Currency(399, 'DKK');
                }
                return;
            },
            trn(o) {
                o.trn['Indløsning (0.99%)'] = $revenue.scale(0.99 / 100);
                if (opts.features.mobilepay) {
                    o.trn['MobilePay (' + $qtyMobilepay + ' * 0,99 kr.)'] = new Currency(0.99 * $qtyMobilepay, 'DKK');
                    o.monthly['MobilePay'] = new Currency(49, 'DKK');
                }
                if (opts.module === 'shopify') {
                    o.trn['Flatpay shopify-gebyr (0,25%)'] = $revenueIntl.scale(0.25 / 100);
                }
                return;
            }
        }
    },
    {
        name: 'Freepay',
        title: 'Freepay',
        logo: ['freepay.svg', 107.8, 22],
        link: 'https://freepay.dk/da/betalingsgateway/priser',
        dankort: true,
        acqs: new Set(['nets', 'clearhaus', 'nets', 'shift4', 'trust']),
        features: new Set(['subscriptions', 'mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop-1', 'opencart']),
        term: 0,
        fees: {
            monthly(o) {
                o.monthly['Freepay Nets-abonnement'] = new Currency(49, 'DKK');
                return;
            },
            trn(o) {
                // The Freepay Nets fee apply to Dankort + Visa/Mastercard (through Nets)
                const netsTrns = (o.trn.Nets) ? $qty : $qtyDankort;
                o.trn['Freepay Nets-gebyr (0,8 kr.)'] = new Currency(0.80 * netsTrns, 'DKK');
                if (opts.features.mobilepay) {
                    o.trn['MobilePay (' + $qtyMobilepay + ' * 1,02 kr.)'] = new Currency(1.02 * $qtyMobilepay, 'DKK');
                    o.monthly['MobilePay'] = new Currency(49, 'DKK');
                }
                if (o.trn['Shift4'] || o.trn['Trust']) {
                    o.trn['3D Secure gebyr (0,8 kr.)'] = new Currency(0.8 * $qtyIntl, 'DKK');
                }
                return;
            }
        }
    },
    {
        name: 'Mollie',
        title: 'Mollie',
        logo: ['mollie.svg', 74.25, 22],
        link: 'https://www.mollie.com/pricing',
        cards: new Set(['visa', 'mastercard', 'maestro', 'amex']),
        features: new Set(['subscriptions', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop-1', 'shopify']),
        term: 0,
        fees: {
            trn(o) {
                o.trn['Indløsning (1,8%)'] = $revenue.scale(1.8 / 100);
                o.trn['Transaktionsgebyr (€0,25)'] = new Currency(0.25 * $qty, 'EUR');
                return;
            }
        }
    },
    {
        name: 'Nets Easy',
        title: 'Nets Easy',
        logo: ['nets-easy.svg', 82, 24],
        link: 'https://payments.nets.eu/da-DK/checkout',
        dankort: true,
        cards: new Set(['visa', 'mastercard', 'maestro']),
        features: new Set(['subscriptions', 'applepay', 'mobilepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop-1', 'shopify']),
        term: 12,
        fees: {
            monthly: new Currency(199, 'DKK'),
            trn(o) {
                if ($qtyDankort) o.trn['Dankortaftale (0,54 kr. + 0,35%)'] = $revenueDankort.scale(0.35 / 100).add(new Currency(0.54, 'DKK').scale($qtyDankort));
                o.trn['Indløsning (0,50 kr. + 1,35%)'] = $revenueIntl.scale(1.35 / 100).add(new Currency(0.50, 'DKK').scale($qtyIntl));
                if (opts.features.mobilepay) {
                    o.trn['MobilePay (' + $qtyMobilepay + ' * 1,03 kr.)'] = new Currency(1.03 * $qtyMobilepay, 'DKK');
                    o.monthly['MobilePay'] = new Currency(49, 'DKK');
                }
                return;
            }
        }
    },
    {
        name: 'PayPal',
        title: 'PayPal',
        logo: ['paypal.svg', 123.6, 30],
        link: 'https://www.paypal.com/dk/business/paypal-business-fees',
        cards: new Set(['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners']),
        features: new Set(['subscriptions', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop-1', 'thirtybees', 'opencart', 'shopify']),
        term: 0,
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
        name: 'PensoPay',
        title: 'PensoPay Basis',
        logo: ['pensopay.svg', 121.85, 21],
        link: 'https://pensopay.com/priser/',
        cards: new Set(['visa', 'mastercard', 'maestro']),
        dankort: true,
        features: new Set(['subscriptions', 'mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop-1', 'thirtybees', 'shopify', 'dandomain', 'ideal.shop']),
        term: 1,
        fees: {
            trn(o) {
                if ($qtyDankort) o.trn['Dankortaftale (0,32%)'] = $trnfeeDankort;
                o.trn['Indløsning (1,25%)'] = $revenueIntl.scale(1.25 / 100);
                o.trn['Transaktionsgebyr (4 kr.)'] = new Currency(4 * $qty, 'DKK');
                o.trn['Autorisationsgebyr (0,22 kr.)'] = new Currency(0.22 * $qtyIntl, 'DKK');
                o.trn['3D Secure gebyr (0,30 kr.)'] = new Currency(0.3 * $qtyIntl, 'DKK');
                if (opts.features.mobilepay) {
                    o.trn['MobilePay (' + $qtyMobilepay + ' * 1 kr.)'] = new Currency($qtyMobilepay, 'DKK');
                    o.monthly['MobilePay'] = new Currency(49, 'DKK');
                }
                return;
            }
        }
    },
    {
        name: 'PensoPay',
        title: 'PensoPay Start-Up',
        logo: ['pensopay.svg', 121.85, 21],
        link: 'https://pensopay.com/priser/',
        cards: new Set(['visa', 'mastercard', 'maestro']),
        dankort: true,
        features: new Set(['subscriptions', 'mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop-1', 'thirtybees', 'shopify', 'dandomain', 'ideal.shop']),
        term: 1,
        fees: {
            monthly: new Currency(49, 'DKK'),
            trn(o) {
                if ($qtyDankort) o.trn['Dankortaftale (0,32%)'] = $trnfeeDankort;
                o.trn['Indløsning (1,25%)'] = $revenueIntl.scale(1.25 / 100);
                o.trn['Transaktionsgebyr (1 kr.)'] = new Currency($qty, 'DKK');
                o.trn['Autorisationsgebyr (0,22 kr.)'] = new Currency(0.22 * $qtyIntl, 'DKK');
                o.trn['3D Secure gebyr (0,30 kr.)'] = new Currency(0.3 * $qtyIntl, 'DKK');
                if (opts.features.mobilepay) {
                    o.trn['MobilePay (' + $qtyMobilepay + ' * 1 kr.)'] = new Currency($qtyMobilepay, 'DKK');
                    o.monthly['MobilePay'] = new Currency(49, 'DKK');
                }
                return;
            }
        }
    },
    {
        name: 'PensoPay',
        title: 'PensoPay Business',
        logo: ['pensopay.svg', 121.85, 21],
        link: 'https://pensopay.com/priser/',
        cards: new Set(['visa', 'mastercard', 'maestro']),
        dankort: true,
        features: new Set(['subscriptions', 'mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop-1', 'thirtybees', 'shopify', 'dandomain', 'ideal.shop']),
        term: 1,
        fees: {
            monthly: new Currency(99, 'DKK'),
            trn(o) {
                const freeTrns = Math.min($qty, 100);
                if ($qtyDankort) o.trn['Dankortaftale (0,32%)'] = $trnfeeDankort;
                o.trn['Indløsning (1,25%)'] = $revenueIntl.scale(1.25 / 100);
                o.trn['Transaktionsgebyr (0,35 kr.)'] = new Currency(0.35 * $qty, 'DKK');
                o.trn[freeTrns + ' gratis transaktioner'] = new Currency(-0.35 * freeTrns, 'DKK');
                o.trn['Autorisationsgebyr (0,22 kr.)'] = new Currency(0.22 * $qtyIntl, 'DKK');
                o.trn['3D Secure gebyr (0,30 kr.)'] = new Currency(0.3 * $qtyIntl, 'DKK');
                if (opts.features.mobilepay) {
                    o.trn['MobilePay (' + $qtyMobilepay + ' * 1 kr.)'] = new Currency($qtyMobilepay, 'DKK');
                    o.monthly['MobilePay'] = new Currency(49, 'DKK');
                }
                return;
            }
        }
    },
    {
        name: 'PensoPay',
        title: 'PensoPay Pro',
        logo: ['pensopay.svg', 121.85, 21],
        link: 'https://pensopay.com/priser/',
        cards: new Set(['visa', 'mastercard', 'maestro']),
        dankort: true,
        features: new Set(['subscriptions', 'mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop-1', 'thirtybees', 'shopify', 'dandomain', 'ideal.shop']),
        term: 1,
        fees: {
            monthly: new Currency(149, 'DKK'),
            trn(o) {
                const freeTrns = Math.min($qty, 250);
                if ($qtyDankort) o.trn['Dankortaftale (0,32%)'] = $trnfeeDankort;
                o.trn['Indløsning (1,25%)'] = $revenueIntl.scale(1.25 / 100);
                o.trn['Transaktionsgebyr (0,25 kr.)'] = new Currency(0.25 * $qty, 'DKK');
                o.trn[freeTrns + ' gratis transaktioner'] = new Currency(-0.25 * freeTrns, 'DKK');
                o.trn['Autorisationsgebyr (0,22 kr.)'] = new Currency(0.22 * $qtyIntl, 'DKK');
                o.trn['3D Secure gebyr (0,30 kr.)'] = new Currency(0.3 * $qtyIntl, 'DKK');
                if (opts.features.mobilepay) {
                    o.trn['MobilePay (' + $qtyMobilepay + ' * 1 kr.)'] = new Currency($qtyMobilepay, 'DKK');
                    o.monthly['MobilePay'] = new Currency(49, 'DKK');
                }
                return;
            }
        }
    },
    {
        name: 'Quickpay',
        title: 'Quickpay Merchant',
        logo: ['quickpay.svg', 138, 22.3],
        link: 'https://quickpay.net/dk/prices-dk/',
        dankort: true,
        acqs: new Set(['clearhaus']),
        features: new Set(['subscriptions', 'mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'prestashop-1', 'thirtybees', 'shopify', 'dandomain',
            'shoporama', 'ideal.shop']),
        term: 1,
        fees: {
            monthly(o) {
                o.monthly['Abonnement'] = new Currency(99, 'DKK');
                o.monthly['Ekstra månedeligt beløb'] = new Currency(30, 'DKK');
            },
            trn(o) {
                if (o.trn.Clearhaus) {
                    delete o.trn.Clearhaus;
                    let trnfee = $revenueIntl.scale(1.35 / 100);
                    if (trnfee.order('DKK') < 0.75) trnfee = new Currency(0.75, 'DKK');
                    o.trn['Indløsning (1,35%, min. 0,75 kr.)'] = trnfee;
                    o.trn['Autorisationsgebyr (0,22 kr.)'] = new Currency(0.22 * $qtyIntl, 'DKK');
                    o.trn['3D Secure gebyr (0,30 kr.)'] = new Currency(0.3 * $qtyIntl, 'DKK');
                }
                o.trn['Transaktionsgebyr (0,25 kr.)'] = new Currency(0.25 * $qty, 'DKK');
                o.trn['Ekstra transaktionsgebyr (Dankort)'] = new Currency(0.25 * $dankortscale * $qty, 'DKK');
                if (opts.features.mobilepay) {
                    o.trn['MobilePay (' + $qtyMobilepay + ' * 1 kr.)'] = new Currency(1 * $qtyMobilepay, 'DKK');
                    o.monthly['MobilePay'] = new Currency(49, 'DKK');
                }
                if (opts.module === 'shopify') {
                    o.trn['QuickPay integrationsgebyr (' + $qty + ' * 0.95 kr.)'] = new Currency(0.95 * $qty, 'DKK');
                }
                return;
            }
        }
    },
    {
        name: 'Scanpay',
        title: 'Scanpay',
        logo: ['scanpay.svg', 104, 23],
        link: 'https://scanpay.dk',
        dankort: true,
        acqs: new Set(['nets', 'clearhaus']),
        features: new Set(['subscriptions', 'mobilepay', 'applepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'prestashop-1', 'thirtybees', 'opencart']),
        term: 0,
        fees: {
            trn(o) {
                o.trn['Transaktionsgebyr (0,25 kr.)'] = new Currency(0.25 * $qty, 'DKK');
                if (opts.features.mobilepay) {
                    o.trn['MobilePay (' + $qtyMobilepay + ' * 1 kr.)'] = new Currency(1 * $qtyMobilepay, 'DKK');
                    o.monthly['MobilePay (1,6 kr. pr. dag)'] = new Currency(1.6 * 365 / 12, 'DKK');
                }
                return;
            }
        }
    },
    /*
    {
        name: 'Shipmondo',
        title: 'Shipmondo Payments',
        logo: ['shipmondo.svg', 116.67, 25],
        note: 'Reseller af Billwerk+',
        link: 'https://help.shipmondo.com/da/articles/6015622-shipmondo-payments-tilvalg-og-priser',
        dankort: true,
        acqs: new Set(['worldline', 'valitor']),
        features: new Set(['mobilepay', 'applepay']),
        modules: billwerkModules,
        fees: {
            trn(o) {
                let num = Math.min($qty, 25);
                // Shipmondo trappetrinsmodel
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

                if (opts.features.mobilepay) {
                    o.trn['MobilePay (' + $qtyMobilepay + ' * 1,02 kr.)'] = new Currency(1.02 * $qtyMobilepay, 'DKK');
                    o.monthly['MobilePay'] = new Currency(49, 'DKK');
                }
            }
        }
    },
    */
    {
        name: 'Shopify',
        title: 'Shopify Payments',
        logo: ['shopify.svg', 102, 29],
        link: 'https://www.shopify.com/dk/payments',
        cards: new Set(['visa', 'mastercard', 'jcb', 'amex']),
        features: new Set(['subscriptions', 'applepay']),
        modules: new Set(['shopify']),
        term: 0,
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
        logo: ['stripe.svg', 72.1, 30],
        link: 'https://stripe.com/en-dk/pricing',
        cards: new Set(['visa', 'mastercard', 'amex']),
        features: new Set(['subscriptions', 'applepay', 'mobilepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop', 'prestashop-1', 'thirtybees', 'shopify']),
        term: 0,
        fees: {
            trn(o) {
                o.trn[`Indløsning (1,5%)`] = $revenue.scale(1.5 / 100);
                o.trn[`Transaktionsgebyr (1,8 kr.)`] = new Currency(1.8 * $qty, 'DKK');
                if (opts.features.mobilepay) {
                    o.trn['MobilePay (' + $qtyMobilepay + ' * 1 kr.)'] = new Currency($qtyMobilepay, 'DKK');
                    o.monthly['MobilePay'] = new Currency(35, 'DKK');
                }
                return;
            }
        }
    },
    {
        name: 'Viva',
        title: 'viva.com',
        logo: ['vivawallet.svg', 135, 21],
        link: 'https://www.viva.com/da-dk/pricing',
        cards: new Set(['visa', 'mastercard', 'maestro', 'amex', 'jcb', 'diners']),
        features: new Set(['subscriptions', 'applepay', 'mobilepay']),
        modules: new Set(['woocommerce', 'prestashop-1']),
        term: 0,
        fees: {
            trn(o) {
                o.trn['Indløsning (2,19%)'] = $revenue.scale(2.19 / 100);
                o.trn['Process-gebyr (0,5 kr.)'] = new Currency(0.5 * $qty, 'DKK');
                o.trn['3D-Secure (0,25 kr.)'] = new Currency(0.25 * $qty, 'DKK');
                if (opts.features.mobilepay) {
                    o.trn['MobilePay (' + $qtyMobilepay + ' * 0.75 kr.)'] = new Currency(0.75 * $qtyMobilepay, 'DKK');
                    o.monthly['MobilePay'] = new Currency(35, 'DKK');
                }
            }
        }
    },
    {
        name: 'Worldline',
        title: 'Worldline Checkout',
        logo: ['worldline.svg', 118.98, 16],
        link: 'https://worldline.com/da-dk/home/main-navigation/solutions/merchants/solutions-and-services/online.html',
        dankort: true,
        cards: new Set(['visa', 'mastercard', 'maestro']),
        features: new Set(['subscriptions', 'mobilepay']),
        modules: new Set(['woocommerce', 'magento', 'prestashop-1', 'opencart']),
        term: 1,
        fees: {
            monthly: new Currency(195, 'DKK'),
            trn(o) {
                o.trn['Dankortaftale (0,32%)'] = $trnfeeDankort;
                o.trn['Indløsning (1,45%)'] = $revenueIntl.scale(1.45 / 100);
                if (opts.features.mobilepay) {
                    o.trn['MobilePay (' + $qtyMobilepay + ' * 1 kr.)'] = new Currency($qtyMobilepay, 'DKK');
                    o.monthly['MobilePay'] = new Currency(49, 'DKK');
                }
            }
        }
    }
];
