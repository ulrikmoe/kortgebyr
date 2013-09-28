
/*function init() {

	transactions = document.getElementById("transactions").value;
	value = document.getElementById("value").value;
	dankort = document.getElementById("dankort").checked;
	visamc = document.getElementById("visamc").checked;
	jcb = false;


	dankortfrekvens = 80;
*/
var CARDS = {

"dankort":	{
				name: "Dankort", // 0
				logo: "dankort.gif"
			},
"edankort":	{
			name: "eDankort", // 1
			logo: "edankort.png"
		},
"visa":{
			name: "Visa", // 2
			logo: "visa.gif"
		},
"visaelectron":{
			name: "Visa Electron", // 3
			logo: "visaelectron.png"
		},
"mastercard":{
			name: "MasterCard", // 4
			logo: "master.gif"
		},
"maestro":{
			name: "Maestro", // 5
			logo: "maestro.gif"
		},
"diners":{
			name: "Diners", // 6
			logo: "diners.gif"
		},
"jcb":	{
			name: "JCB", // 7
			logo: "jcb.gif"
		},
"unionpay":{
			name: "UnionPay", // 8
			logo: "unionpay.gif"
		},
"americanexpress":{
			name: "American Express", // 9
			logo: "amex.png"
		},
"discover":{
			name: "Discover", // 10
			logo: "discover.png"
		}

	};

	function defaultAcquirerCostFn(ntransactions,averageprice){
		monthlytotal=$('incSetupFee').checked*this.setupFee/120+this.monthlyFee;
		monthlytotal+=this.percentageTransactionFee/100*averageprice*ntransactions;
		
		return monthlytotal;
		
	}



	var ACQUIRER =
	{
		"nets":
		{
			name: "nets", //0
			logo: "nets.png",
			cards: ["dankort"],
			setupFee: 250,
			monthlyFee: 83.33,
			transactionCosts: 0,
			totalCosts: 0,
			costfn: function(ntransactions,averageprice)
					{
						var fee;
						if(averageprice <= 50 ){fee=0.7}
						else if (averageprice <= 100) { fee = 1.1; }
						else { fee = 1.9; }
						return fee*ntransactions+this.monthlyFee+$('incSetupFee').checked*this.setupFee/120;
					}
		},
		"seb":
		{
			name: "SEB", // 1
			logo: "seb.png",
			cards: ["visa","mastercard","maestro"],
			setupFee: 0,
			monthlyFee: 0,
			fixedTransactionFee: 0,
			percentageTransactionFee: 2.65,
			transactionCosts: 0,
			totalCosts: 0,
			costfn: defaultAcquirerCostFn
		},
		"teller":
		{
			name: "Teller", // 2
			logo: "teller.png",
			cards: ["visa","mastercard","maestro"],
			setupFee: 1000,
			monthlyFee: 100,
			fixedTransactionFee: 0.7,
			percentageTransactionFee: 1.5,
			costfn: defaultAcquirerCostFn
		},
		"swebank":
		{
			name: "SWE Bank", // 3
			logo: "swebank.png",
			cards: ["visa","mastercard","maestro"],
			setupFee: 1900,
			monthlyFee: 100,
			fixedTransactionFee: 0,
			percentageTransactionFee: 1.7,
			totalTransactionCosts: 0,
			totalCosts: 0,
			costfn: defaultAcquirerCostFn
		},
		"handelsbanken":
		{
			name: "Handelsbanken", // 4
			logo: "handelsbanken.png",
			cards: ["visa","mastercard","maestro"],
			setupFee: 1900,
			monthlyFee: 100,
			fixedTransactionFee: 0,
			percentageTransactionFee: 1.7,
			totalTransactionCosts: 0,
			totalCosts: 0,
			costfn: defaultAcquirerCostFn
		}

	};

	function defaultCostFn(ntransactions,averageprice){
		var monthlytotal=$('incSetupFee').checked*this.setupFee/120+this.monthlyFee+$('3d').checked*this.monthly3dsecureFee;
		if(ntransactions>this.freeTransactions)
			monthlytotal+=this.fixedTransactionFee*(ntransactions-this.freeTransactions);
		if(this.isAcquirer)
			monthlytotal+=this.percentageTransactionFee/100*averageprice*ntransactions;

		return monthlytotal;
	}

	PSP =
	{
		"paypal":
		{
			name: "paypal", // 0
			logo: "paypal.png",
			link: "paypal.com",
			isAcquirer: true,
			cards: ["visa","mastercard","maestro"],
			setupFee: 0,
			monthlyFee: 0,
			monthly3dsecureFee: 0,
			chargeback: 120,
			costfn:	function(ntransactions,averageprice)
					{
						var oms=ntransactions*averageprice;
						var fee;
						if (oms < 20000 ) { fee = 3.4; }
						else if (oms <= 80000) { fee = 2.9; }
						else if (oms <= 400000) { fee = 2.7; }
						else if (oms <= 800000) { fee = 2.4; }
						else { fee = 1.9; }
						return (fee/100*averageprice+2.6)*ntransactions;
					}
		},
		"ewirelight":
		{
			name: "ewire light", // 1
			logo: "ewire.png",
			link: "ewire.dk",
			isAcquirer: true,
			cards: ["dankort","visa","mastercard","maestro"],
			setupFee: 395,
			monthlyFee: 0,
			monthly3dsecureFee: 0,
			fixedTransactionFee: 1.1,
			percentageTransactionFee:2.45,
			freeTransactions: 0,
			chargeback: 275,
			costfn: defaultCostFn
			
		},
		"ewirepro":
		{
			name: "ewire pro", // 2
			logo: "ewire.png",
			link: "ewire.dk",
			isAcquirer: true,
			cards: ["dankort","visa","mastercard","maestro"],
			setupFee: 1195,
			monthlyFee: 99.58,
			monthly3dsecureFee: 0,
			fixedTransactionFee: 0.7,
			percentageTransactionFee:2.45,
			freeTransactions: 0,
			chargeback: 275,
			costfn:defaultCostFn
		},
		"quickpay":
		{
			name: "quickpay", // 4
			logo: "quickpay.png",
			link: "quickpay.dk",
			isAcquirer: false,
			acquirer: 1,
			availableAcquirers:  ["seb","teller","swebank"],
			cards: ["dankort","visa","mastercard","maestro"],
			setupFee: 0,
			monthlyFee: 150,
			monthly3dsecureFee: 0,
			costfn: function(ntransactions,averageprice){
						if(ntransactions==0)return 0;
						var quickpayLimits=
						[500,600,1000,3000,10000,30000,9007199254740992],
							quickpayPerTransaction=
						[ 0 ,0.5,0.4 ,0.3 ,0.25 ,0.15 , 0.1],
							monthlytotal=this.monthlyFee;
						for(var i=0;i<7;i++){
							if(ntransactions<=quickpayLimits[i])
							{
								if(i-1>=0)
									monthlytotal+=quickpayPerTransaction[i]*(ntransactions-quickpayLimits[i-1]) ;
								break;
							}
							else
							{
								if(i-1>=0)
									monthlytotal+=(quickpayLimits[i]-quickpayLimits[i-1])*quickpayPerTransaction[i];
							}
						}
						return monthlytotal;
					}
		},
		"epaylight":
		{
			name: "ePay Light", // 5
			logo: "epay.png",
			link: "epay.dk",
			isAcquirer: false,
			acquirer: 0,
			availableAcquirers: [0],
			cards: ["dankort"],
			setupFee: 399,
			monthlyFee: 99,
			monthly3dsecureFee: 0,
			fixedTransactionFee: 0.25,
			freeTransactions: 500,
			costfn:defaultCostFn
		},
		"epaybusiness":
		{
			name: "ePay Business", // 6
			logo: "epay.png",
			link: "epay.dk",
			isAcquirer: false,
			acquirer: 1,
			availableAcquirers: ["seb","teller","swebank"],
			cards: ["dankort","visa","mastercard","maestro"],
			setupFee: 999,
			monthlyFee: 299,
			monthly3dsecureFee: 0,
			fixedTransactionFee: 0.25,
			freeTransactions: 500,
			costfn:defaultCostFn
		},
		"epaypro":
		{
			name: "ePay Pro", // 7
			logo: "epay.png",
			link: "epay.dk",
			isAcquirer: false,
			acquirer: 2,
			availableAcquirers: ["teller"],
			cards: ["dankort","visa","mastercard","maestro"],
			setupFee: 599,
			monthlyFee: 199,
			monthly3dsecureFee: 0,
			fixedTransactionFee: 0.25,
			freeTransactions: 500,
			costfn:defaultCostFn
		},
		"dibsent":
		{
			name: "DIBS Entrepreneur", // 8
			logo: "dibs.png",
			link: "dibs.dk",
			isAcquirer: false,
			acquirer: 1,
			availableAcquirers: [1,2,3],
			cards: ["dankort"],
			setupFee: 0,
			monthlyFee: 149,
			monthly3dsecureFee: 0,
			fixedTransactionFee: 3,
			freeTransactions: 250,
			costfn:defaultCostFn
		},
		"dibsbusiness":
	  	{
			name: "DIBS Business", // 9
			logo: "dibs.png",
			link: "dibs.dk",
			isAcquirer: false,
			acquirer: 1,
			availableAcquirers: ["seb","teller","swebank"],
			cards: ["dankort","visa","mastercard","maestro"],
			setupFee: 0,
			monthlyFee: 249,
			monthly3dsecureFee: 0,
			fixedTransactionFee: 3,
			freeTransactions: 500,
			costfn:defaultCostFn
		},
		"dibsprofessional":
		{
			name: "DIBS Professional", // 10
			logo: "dibs.png",
			link: "dibs.dk",
			isAcquirer: false,
			acquirer: 1,
			availableAcquirers: ["seb","teller","swebank"],
			cards: ["dankort","visa","mastercard","maestro"],
			setupFee: 0,
			monthlyFee: 249,
			monthly3dsecureFee: 0,
			fixedTransactionFee: 1.5,
			freeTransactions: 500,
			costfn:defaultCostFn
		},
		"netaxeptstart":
		{
			name: "Netaxept start", // 11
			logo: "nets.png",
			link: "terminalshop.dk",
			isAcquirer: false,
			acquirer: 1,
			availableAcquirers: ["teller"],
			cards: ["dankort","visa","mastercard","maestro"],
			setupFee: 1000,
			monthlyFee: 180,
			monthly3dsecureFee: 0,
			fixedTransactionFee: 1.5,
			freeTransactions: 0,
			costfn:defaultCostFn
		},
		"netaxeptplus":
		{
			name: "Netaxept plus", // 12
			logo: "nets.png",
			link: "terminalshop.dk",
			isAcquirer: false,
			acquirer: 2,
			availableAcquirers: ["teller"],
			cards: ["dankort","visa","mastercard","maestro"],
			setupFee: 3000,
			monthlyFee: 500,
			monthly3dsecureFee: 0,
			fixedTransactionFee: 1,
			freeTransactions: 0,
			costfn:defaultCostFn
		},
		"netaxeptadvanced":
		{
			name: "Netaxept advanced", // 13
			logo: "nets.png",
			link: "terminalshop.dk",
			isAcquirer: false,
			acquirer: 2,
			availableAcquirers: ["teller"],
			cards: ["dankort","visa","mastercard","maestro"],
			setupFee: 7500,
			monthlyFee: 700,
			monthly3dsecureFee: 0,
			fixedTransactionFee: 0.7,
			freeTransactions: 0,
			costfn:defaultCostFn
		},
		"dandomain":
		{
			name: "Dandomain", // 14
			logo: "dandomain.png",
			link: "dandomain.dk/produkter/betalingssystem.html",
			isAcquirer: false,
			acquirer: 2,
			availableAcquirers: ["teller"],
			cards: ["dankort","visa","mastercard","maestro"],
			setupFee: 199,
			monthlyFee: 149,
			monthly3dsecureFee: 49,
			fixedTransactionFee: 0,
			freeTransactions: 0,
			costfn:defaultCostFn
		},
		"wannafind":
		{
			name: "Wannafind", // 15
			logo: "wannafind.png",
			link: "wannafind.dk/betalingsgateway/",
			isAcquirer: false,
			acquirer: 1,
			availableAcquirers: ["seb","teller","swebank"],
			cards:["dankort","visa","mastercard","maestro"],
			setupFee: 0,
			monthlyFee: 198,
			monthly3dsecureFee: 49,
			fixedTransactionFee: 0,
			freeTransactions: 0,
			costfn:defaultCostFn
		},
		"paymill":
		{
			name: "Paymill", // 0
			logo: "paymill.png",
			link: "paymill.com",
			isAcquirer: true,
			cards: ["visa","mastercard","maestro"],
			setupFee: 0,
			monthlyFee: 0,
			monthly3dsecureFee: 0,
			fixedTransactionFee: 2.088,
			percentageTransactionFee:2.95,
			freeTransactions: 0,
			chargeback: 140,
			costfn:defaultCostFn
		},
		"payson":
		{
			name: "Payson", // 0
			logo: "payson.png",
			link: "payson.se",
			isAcquirer: true,
			cards: ["visa","mastercard","maestro"],
			setupFee: 0,
			monthlyFee: 0,
			monthly3dsecureFee: 0,
			fixedTransactionFee: 3,
			percentageTransactionFee:3,
			freeTransactions: 0,
			chargeback: 140,
			costfn:defaultCostFn
		}
	};



