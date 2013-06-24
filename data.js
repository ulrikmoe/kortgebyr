function init() {

	transactions = document.getElementById("transactions").value;
	value = document.getElementById("value").value;
	dankort = document.getElementById("dankort").checked;
	visamc = document.getElementById("visamc").checked;
	jcb = document.getElementById("jcb").checked; //jcb, amex, UnionPay


	if (visamc == false && jcb == true)
	{
		document.getElementById("jcb").checked = false;
		jcb = false;
	}


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
			monthlyFee: 0,
			fixedTransactionFee: 0,
			variableTransactionFee: 1.65,
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
			monthlyFee: 0,
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
			monthlyFee: 0,
			fixedTransactionFee: 0,
			variableTransactionFee: 1.7,
			totalTransactionCosts: 0,
			totalCosts: 0
		}

	];



	PSP =
	[
		{
			name: "paypal",
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
			name: "ewire",
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
			name: "ewire",
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
			name: "skrill",
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
			name: "quickpay",
			logo: 7,
			link: "quickpay.dk",
			acquirer: 1,
			availableAcquirers: [1,2,3],
			cards: [0,1,2,3,4,5],
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
			name: "ePay Light",
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
			name: "ePay Business",
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
			name: "ePay Pro",
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
			name: "DIBS Entrepreneur",
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
			name: "DIBS Business",
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
			name: "DIBS Professional",
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
			name: "Netaxept start",
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
			name: "Netaxept plus",
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
			name: "Netaxept advanced",
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
			name: "Dandomain",
			logo: 1,
			link: "dandomain.dk/produkter/betalingssystem.html",
			acquirer: 2,
			availableAcquirers: [2],
			cards: [0,2,3,4,5],
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
			name: "Wannafind",
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


	oms = transactions * value;

	calc();

}




function gateways() {


	for (var i=0; i< gateway_monthly.length; i++)
	{


		var total = gateway_monthly[i]+nets+seb;


		if ( ( i == 0 ) && ( transactions > 500 ) ) {
		// Quickpay

		/*
			501 -> 600	50 øre/stk
			601 -> 1000	40 øre/stk
			1001 -> 3000	30 øre/stk
			3001 -> 10000	25 øre/stk
			10001 -> 30000	15 øre/stk
			30001 -> 60000	10 øre/stk
		*/

			var quickpayFees = 0;


			if ( transactions < 601 )
			{

				quickpayFees += ( transactions - 500 ) * 0.5 ;

			}
			else if ( transactions < 1001 )
			{

				quickpayFees += 99 * 0.5 ;
				quickpayFees += ( transactions - 600 ) * 0.4 ;
			}

			else if ( transactions < 3001 )
			{

				quickpayFees += 99 * 0.5 ;
				quickpayFees += 400 * 0.4 ;
			}


			total = total + quickpayFees;


		}
		else if ( ( i == 1 ) && ( transactions > 500 ) ) {
		// epay

			total = total + ( (transactions - 500) *  0.25);

		}
		else if ( i == 2 ) {

			total = total + (transactions *  1.5);

		}
		else if ( i == 3 ) {

			total = total + (transactions *  1);

		}
		else if ( i == 4 ) {

			total = total + (transactions *  0.7);

		}

		document.getElementById("gateway_total_"+i).innerHTML = total;


	}




}
