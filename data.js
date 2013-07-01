function init() {

	transactions = document.getElementById("transactions").value;
	value = document.getElementById("value").value;
	dankort = document.getElementById("dankort").checked;
	visamc = document.getElementById("visamc").checked;
	jcb = false;


	dankortfrekvens = 80;

	cards = [


	// hover effect : http://www.catskillflies.com/collections/simms?page=2

		{
			name: "Dankort", // 0
			logo: "dankort.png"
		},
		{
			name: "eDankort", // 1
			logo: "edankort.png"
		},
		{
			name: "Visa", // 2
			logo: "visa.png"
		},
		{
			name: "Visa Electron", // 3
			logo: "visaelectron.png"
		},
		{
			name: "MasterCard", // 4
			logo: "mastercard.gif"
		},
		{
			name: "Maestro", // 5
			logo: "maestro.png"
		},
		{
			name: "Diners", // 6
			logo: "diners.gif"
		},
		{
			name: "JCB", // 7
			logo: "jcb.gif"
		},
		{
			name: "UnionPay", // 8
			logo: "unionpay.gif"
		},
		{
			name: "American Express", // 9
			logo: "amex.png"
		},
		{
			name: "Discover", // 10
			logo: "discover.png"
		}

	];



	acquirer =
	[
		{
			name: "nets", //0
			logo: 1,
			cards: [0,1],
			setupFee: 250,
			monthlyFee: 83.33,
			fixedTransactionFee: 0.7,
			variableTransactionFee: 0,
			transactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "SEB", // 1
			logo: 2,
			cards: [2,3,4,5,6],
			setupFee: 0,
			monthlyFee: 200,
			fixedTransactionFee: 0,
			variableTransactionFee: 2.65,
			transactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "Teller", // 2
			logo: 3,
			cards: [2,3,4,5,6,7,8,9],
			setupFee: 1000,
			monthlyFee: 100,
			fixedTransactionFee: 0,
			variableTransactionFee: 1.5,
			transactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "SWE Bank", // 3
			logo: 4,
			cards: [2,3,4,5,6],
			setupFee: 1900,
			monthlyFee: 100,
			fixedTransactionFee: 0,
			variableTransactionFee: 1.7,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "Handelsbanken", // 4
			logo: 5,
			cards: [2,3,4,5,6],
			setupFee: 1900,
			monthlyFee: 100,
			fixedTransactionFee: 0,
			variableTransactionFee: 1.7,
			totalTransactionCosts: 0,
			totalCosts: 0
		}

	];



	PSP =
	[
		{
			name: "paypal", // 0
			logo: 6,
			link: "paypal.com",
			cards: [2,3,4,5,9,10],
			setupFee: 0,
			monthlyFee: 0,
			fixedTransactionFee: 2.6,
			variableTransactionFee: 3.4,
			freeTransactions: 0,
			transactionCosts: 0,
			costs: 0,
			totalSetupFee: 0,
			totalMonthlyFee: 0,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "ewire", // 1
			logo: 4,
			link: "ewire.dk",
			cards: [0,2,3,4,5],
			setupFee: 1195,
			monthlyFee: 99.58,
			fixedTransactionFee: 0.7,
			variableTransactionFee: 2.45,
			freeTransactions: 0,
			transactionCosts: 0,
			costs: 0,
			totalSetupFee: 0,
			totalMonthlyFee: 0,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "ewire", // 2
			logo: 4,
			link: "ewire.dk",
			cards: [0,2,3,4,5],
			setupFee: 395,
			monthlyFee: 0,
			fixedTransactionFee: 1.1,
			variableTransactionFee: 2.45,
			freeTransactions: 0,
			transactionCosts: 0,
			costs: 0,
			totalSetupFee: 0,
			totalMonthlyFee: 0,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "skrill", // 3
			logo: 8,
			link: "skrill.com",
			cards: [2,3,4,6,7,9],
			setupFee: 0,
			monthlyFee: 148.75,
			fixedTransactionFee: 1.86,
			variableTransactionFee: 1.9,
			freeTransactions: 0,
			transactionCosts: 0,
			costs: 0,
			totalSetupFee: 0,
			totalMonthlyFee: 0,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "quickpay", // 4
			logo: 7,
			link: "quickpay.dk",
			acquirer: 1,
			availableAcquirers: [1,2,3],
			cards: [0,1,2,3,4,5,6,7,8,9],
			setupFee: 0,
			monthlyFee: 150,
			fixedTransactionFee: 0,
			variableTransactionFee: 0,
			freeTransactions: 500,
			transactionCosts: 0,
			costs: 0,
			totalSetupFee: 0,
			totalMonthlyFee: 0,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "ePay Light", // 5
			logo: 3,
			link: "epay.dk",
			acquirer: 0,
			availableAcquirers: [0],
			cards: [0,1],
			setupFee: 399,
			monthlyFee: 99,
			fixedTransactionFee: 0.25,
			variableTransactionFee: 0,
			freeTransactions: 500,
			transactionCosts: 0,
			costs: 0,
			totalSetupFee: 0,
			totalMonthlyFee: 0,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "ePay Business", // 6
			logo: 3,
			link: "epay.dk",
			acquirer: 1,
			availableAcquirers: [1,2,3],
			cards: [0,1,2,3,4,5,6,7,8,9],
			setupFee: 999,
			monthlyFee: 299,
			fixedTransactionFee: 0.25,
			variableTransactionFee: 0,
			freeTransactions: 500,
			transactionCosts: 0,
			costs: 0,
			totalSetupFee: 0,
			totalMonthlyFee: 0,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "ePay Pro", // 7
			logo: 3,
			link: "epay.dk",
			acquirer: 2,
			availableAcquirers: [2],
			cards: [0,1,2,3,4,5,6,7,8,9],
			setupFee: 599,
			monthlyFee: 199,
			fixedTransactionFee: 0.25,
			variableTransactionFee: 0,
			freeTransactions: 500,
			transactionCosts: 0,
			costs: 0,
			totalSetupFee: 0,
			totalMonthlyFee: 0,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "DIBS Entrepreneur", // 8
			logo: 2,
			link: "dibs.dk",
			acquirer: 0,
			availableAcquirers: [0],
			cards: [0,1],
			setupFee: 0,
			monthlyFee: 149,
			fixedTransactionFee: 3,
			variableTransactionFee: 0,
			freeTransactions: 250,
			transactionCosts: 0,
			costs: 0,
			totalSetupFee: 0,
			totalMonthlyFee: 0,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
	  	{
			name: "DIBS Business", // 9
			logo: 2,
			link: "dibs.dk",
			acquirer: 1,
			availableAcquirers: [1,2,3],
			cards: [0,1,2,3,4,5,6,7,8,9],
			setupFee: 0,
			monthlyFee: 249,
			fixedTransactionFee: 3,
			variableTransactionFee: 0,
			freeTransactions: 500,
			transactionCosts: 0,
			costs: 0,
			totalSetupFee: 0,
			totalMonthlyFee: 0,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "DIBS Professional", // 10
			logo: 2,
			link: "dibs.dk",
			acquirer: 1,
			availableAcquirers: [1,2,3],
			cards: [0,1,2,3,4,5,6,7,8,9],
			setupFee: 0,
			monthlyFee: 249,
			fixedTransactionFee: 1.5,
			variableTransactionFee: 0,
			freeTransactions: 500,
			transactionCosts: 0,
			costs: 0,
			totalSetupFee: 0,
			totalMonthlyFee: 0,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "Netaxept start", // 11
			logo: 5,
			link: "terminalshop.dk",
			acquirer: 1,
			availableAcquirers: [2],
			cards: [0,1,2,3,4],
			setupFee: 1000,
			monthlyFee: 180,
			fixedTransactionFee: 1.5,
			variableTransactionFee: 0,
			freeTransactions: 0,
			transactionCosts: 0,
			costs: 0,
			totalSetupFee: 0,
			totalMonthlyFee: 0,
			totalTransactionCosts: 0,
			totalCosts: 0
		},

		{
			name: "Netaxept plus", // 12
			logo: 5,
			link: "terminalshop.dk",
			acquirer: 2,
			availableAcquirers: [2],
			cards: [0,1,2,3,4,5,6,7,8,9],
			setupFee: 3000,
			monthlyFee: 500,
			fixedTransactionFee: 1,
			variableTransactionFee: 0,
			freeTransactions: 0,
			transactionCosts: 0,
			costs: 0,
			totalSetupFee: 0,
			totalMonthlyFee: 0,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "Netaxept advanced", // 13
			logo: 5,
			link: "terminalshop.dk",
			acquirer: 2,
			availableAcquirers: [2],
			cards: [0,1,2,3,4,5,6,7,8,9],
			setupFee: 7500,
			monthlyFee: 700,
			fixedTransactionFee: 0.7,
			variableTransactionFee: 0,
			freeTransactions: 0,
			transactionCosts: 0,
			costs: 0,
			totalSetupFee: 0,
			totalMonthlyFee: 0,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "Dandomain", // 14
			logo: 1,
			link: "dandomain.dk/produkter/betalingssystem.html",
			acquirer: 2,
			availableAcquirers: [2],
			cards: [0,2,3,4,5,6,7,9],
			setupFee: 298,
			monthlyFee: 198,
			fixedTransactionFee: 0,
			variableTransactionFee: 0,
			freeTransactions: 0,
			transactionCosts: 0,
			costs: 0,
			totalSetupFee: 0,
			totalMonthlyFee: 0,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "Wannafind", // 15
			logo: 9,
			link: "wannafind.dk/betalingsgateway/",
			acquirer: 1,
			availableAcquirers: [1,2,3],
			cards: [0,1,2,3,4,5],
			setupFee: 0,
			monthlyFee: 198,
			fixedTransactionFee: 0,
			variableTransactionFee: 0,
			freeTransactions: 0,
			transactionCosts: 0,
			costs: 0,
			totalSetupFee: 0,
			totalMonthlyFee: 0,
			totalTransactionCosts: 0,
			totalCosts: 0
		}
	];



	calc();
	

}


window.onload = function () {

	var dato = new Date(document.lastModified);
	var timezone = dato.getTimezoneOffset()*60;
	var sekunder = timezone + Math.floor( ( Date.now() - dato ) / 1000); // minutter
	var opdateret = "";

	if (sekunder < 60) { opdateret = sekunder + " sekunder"; }
	else if ( sekunder < 7200 ) { opdateret = Math.floor(sekunder/60) + " minutter"; }
	else if ( sekunder < 86400 ) { opdateret = Math.floor(sekunder/3600) + " timer"; }
	else if ( sekunder < 172800 ) { opdateret = Math.floor(sekunder/86400) + " dag"; }
	else { opdateret = Math.floor(sekunder/86400) + " dage"; }
	
	document.getElementById("opdateret").innerHTML = opdateret + " siden";

	init();

}
