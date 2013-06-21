function init() {

	transactions = document.getElementById("transactions").value;
	value = document.getElementById("value").value;


	cards = [

		{
			name: "Dankort", // 0
			logo: "dankort.png"
		},
		{
			name: "eDankort",
			logo: "edankort.png"
		},
		{
			name: "Visa",
			logo: "visa.png"
		},
		{
			name: "MasterCard",
			logo: "mastercard.png"
		},
		{
			name: "JCB",
			logo: "jcb.png"
		},
		{
			name: "UnionPay",
			logo: "unionpay.png"
		},
		{
			name: "Diners",
			logo: "diners.png"
		},
		{
			name: "American Express",
			logo: "amex.png"
		},
		{
			name: "Visa Electron",
			logo: "visaelectron.png"
		},


	];



	acquirer = [

		{
			// fix cards: [0] == false ... strange bug
		},
		{
			name: "nets",
			logo: "nets.png",
			cards: [0,1],
			setupFee: 250,
			monthlyFee: 83.33,
			fixedTransactionFee: 0.7,
			variableTransactionFee: 0,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "SEB",
			logo: "seb.png",
			cards: [1,2,3,4,5,6],
			setupFee: 0,
			monthlyFee: 0,
			fixedTransactionFee: 0,
			variableTransactionFee: 1.65,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "Teller",
			logo: "teller.png",
			cards: [1,2,3,4,5,6],
			setupFee: 0,
			monthlyFee: 0,
			fixedTransactionFee: 0,
			variableTransactionFee: 1.65,
			totalTransactionCosts: 0,
			totalCosts: 0
		}

	];



	PSP = [

		{
			name: "paypal",
			logo: "paypal.png",
			link: "paypal.com",
			acquirer: 0,
			cards: [2,3,4,5],
			setupFee: 0,
			monthlyFee: 0,
			fixedTransactionFee: 2.6,
			variableTransactionFee: 3.4,
			freeTransactions: 0,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "ewire",
			logo: "ewire.png",
			link: "ewire.dk",
			acquirer: 0,
			cards: [0,1,2,3,4,5],
			setupFee: 1195,
			monthlyFee: 99.58,
			fixedTransactionFee: 0.7,
			variableTransactionFee: 2.45,
			freeTransactions: 0,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "ewire",
			logo: "ewire.png",
			link: "ewire.dk",
			acquirer: 0,
			cards: [0,1,2,3,4,5],
			setupFee: 395,
			monthlyFee: 0,
			fixedTransactionFee: 1.1,
			variableTransactionFee: 2.45,
			freeTransactions: 0,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "skrill",
			logo: "skrill.png",
			link: "skrill.com",
			acquirer: 0,
			cards: [2,3,4,5],
			setupFee: 0,
			monthlyFee: 148.75,
			fixedTransactionFee: 1.86,
			variableTransactionFee: 1.9,
			freeTransactions: 0,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "quickpay",
			logo: "quickpay.png",
			link: "quickpay.dk",
			acquirer: [1,2],
			cards: [0,1,2,3,4,5],
			setupFee: 0,
			monthlyFee: 150,
			fixedTransactionFee: 0,
			variableTransactionFee: 0,
			freeTransactions: 500,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "ePay Light",
			logo: "epay.png",
			link: "epay.dk",
			acquirer: [1],
			cards: [1],
			setupFee: 399,
			monthlyFee: 99,
			fixedTransactionFee: 0.25,
			variableTransactionFee: 0,
			freeTransactions: 500,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "ePay Business",
			logo: "epay.png",
			link: "epay.dk",
			acquirer: [1,2],
			cards: [0,1,2,3,4,5],
			setupFee: 999,
			monthlyFee: 299,
			fixedTransactionFee: 0.25,
			variableTransactionFee: 0,
			freeTransactions: 500,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "ePay Pro",
			logo: "epay.png",
			link: "epay.dk",
			acquirer: [1,2],
			cards: [0,1,2,3,4,5],
			setupFee: 599,
			monthlyFee: 199,
			fixedTransactionFee: 0.25,
			variableTransactionFee: 0,
			freeTransactions: 500,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "DIBS Entrepreneur",
			logo: "dibs.png",
			link: "dibs.dk",
			acquirer: [1],
			cards: [0,1],
			setupFee: 0,
			monthlyFee: 149,
			fixedTransactionFee: 3,
			variableTransactionFee: 0,
			freeTransactions: 250,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
	  	{
			name: "DIBS Business",
			logo: "dibs.png",
			link: "dibs.dk",
			acquirer: [1,2],
			cards: [0,1,2,3,4,5],
			setupFee: 0,
			monthlyFee: 249,
			fixedTransactionFee: 3,
			variableTransactionFee: 0,
			freeTransactions: 500,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "DIBS Professional",
			logo: "dibs.png",
			link: "dibs.dk",
			acquirer: [1,2,3],
			cards: [0,1,2,3,4,5],
			setupFee: 0,
			monthlyFee: 249,
			fixedTransactionFee: 1.5,
			variableTransactionFee: 0,
			freeTransactions: 500,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "Netaxept start",
			logo: "nets.png",
			link: "terminalshop.dk",
			acquirer: [1,3],
			cards: [0,1,2,3,4,5],
			setupFee: 1000,
			monthlyFee: 180,
			fixedTransactionFee: 1.5,
			variableTransactionFee: 0,
			freeTransactions: 0,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "Netaxept plus",
			logo: "nets.png",
			link: "terminalshop.dk",
			acquirer: [1,3],
			cards: [0,1,2,3,4,5],
			setupFee: 3000,
			monthlyFee: 500,
			fixedTransactionFee: 1,
			variableTransactionFee: 0,
			freeTransactions: 0,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "Netaxept advanced",
			logo: "nets.png",
			link: "terminalshop.dk",
			acquirer: [1,3],
			cards: [0,1,2,3,4,5],
			setupFee: 7500,
			monthlyFee: 700,
			fixedTransactionFee: 0.7,
			variableTransactionFee: 0,
			freeTransactions: 0,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "Dandomain",
			logo: "dandomain.png",
			link: "dandomain.dk/produkter/betalingssystem.html",
			acquirer: [1,3],
			cards: [0,1,2,3,4,5],
			setupFee: 397,
			monthlyFee: 247,
			fixedTransactionFee: 0,
			variableTransactionFee: 0,
			freeTransactions: 0,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "Wannafind",
			logo: "wannafind.png",
			link: "wannafind.dk/betalingsgateway/",
			acquirer: [1,2,3],
			cards: [0,1,2,3,4,5],
			setupFee: 0,
			monthlyFee: 198,
			fixedTransactionFee: 0,
			variableTransactionFee: 0,
			freeTransactions: 0,
			totalTransactionCosts: 0,
			totalCosts: 0
		}



	];


	oms = transactions * value;

	calc();

}


function calc() {

	// Init variables







	/*
	==========================================
	P	A	Y	P	A	L
	==========================================
	*/

	if (oms < 20000 ) { PSP[0].variableTransactionFee = 3.4; }
	else if (oms <= 80000) { PSP[0].variableTransactionFee = 2.9; }
	else if (oms <= 400000) { PSP[0].variableTransactionFee = 2.7; }
	else if (oms <= 800000) { PSP[0].variableTransactionFee = 2.4; }
	else { PSP[0].variableTransactionFee = 1.9; }



	/*
	==========================================
	S	K	R	I	L	L
	==========================================
	*/





	/*
	==========================================
	N	E	T	S
	==========================================
	*/

	if ( value <= 50 ) { acquirer[1].fixedTransactionFee = 0.7; }
	else if ( value <= 100 ) { acquirer[1].fixedTransactionFee = 1.1; }
	else if ( value <= 500 ) { acquirer[1].fixedTransactionFee = 1.45; }
	else { acquirer[1].fixedTransactionFee = 1.45; acquirer[1].variableTransactionFee = 0.001 }


	acquirer[1].totalTransactionCosts = 0.8 * ( transactions * acquirer[1].fixedTransactionFee + oms * acquirer[1].variableTransactionFee );



	/*
	==========================================
	S	E	B
	==========================================
	*/

	//console.log(acquirer[2].name);

	acquirer[2].totalCosts = acquirer[2].totalTransactionCosts = 0.2 * oms * 0.0165;




	/*
	==========================================
	T	E	L	L	E	R
	==========================================
	*/












	for (var i=0; i<PSP.length; i++)
	{


		var cheapestAcquirer = 0;


		if ( PSP[i].gateway == false ) // Paypal, ewire, Skrill
		{

			PSP[i].totalTransactionCosts = ( PSP[i].fixedTransactionFee * transactions ) + ( PSP[i].variableTransactionFee/100 * oms ) ;

		}
		else
		{


			if ( transactions > PSP[i].freeTransactions ) {

					PSP[i].totalTransactionCosts = ( PSP[i].fixedTransactionFee * ( transactions- PSP[i].freeTransactions ) );

			}



			/*

				FIND BILLIGSTE INDLØSER FOR DENNE PSP

			*/








			acquirer[1].totalCosts = acquirer[1].totalTransactionCosts + acquirer[1].monthlyFee;


			cheapestAcquirer = acquirer[1].totalCosts + acquirer[2].totalCosts;



		}



		PSP[i].totalCosts =	PSP[i].monthlyFee + PSP[i].totalTransactionCosts + cheapestAcquirer;



	}


	build();

}




function build() {


	PSP.sort(function (b, a) {

		return a.totalCosts - b.totalCosts;

	});


	var table = document.getElementById("data");
	var row;


	table.innerHTML = "";

	for (var i=0; i<PSP.length; i++)
	{

		row=table.insertRow(0);
		var cell1=row.insertCell(0);
		var cell2=row.insertCell(1);
		var cell3=row.insertCell(2);
		var cell4=row.insertCell(3);
		var cell5=row.insertCell(4);

		var cell7=row.insertCell(5);
		var cell8=row.insertCell(6);

		var HTML_acquirer = "";


		if ( PSP[i].acquirer == 0 )
		{
			var monthly = PSP[i].monthlyFee;
			var transactionsCosts = Math.round(PSP[i].totalTransactionCosts);
		}
		else
		{
			var monthly = PSP[i].monthlyFee + acquirer[1].monthlyFee + acquirer[2].monthlyFee;
			var transactionsCosts = Math.round(PSP[i].totalTransactionCosts + acquirer[1].totalTransactionCosts+ acquirer[2].totalTransactionCosts) ;

			HTML_acquirer = "<img src='logo/nets.png' height='15'>";

			for (var u=1; u<PSP[i].acquirer.length; u++)
			{
				HTML_acquirer += "<img src='logo/"+acquirer[PSP[i].acquirer[u]].name+".png' height=15 /><br />";
			}

		}


		/*
		HTML_cards = "";

		for (var u=1; u<PSP[i].acquirer.length; u++)
		{
			HTML_acquirer += "<img src='logo/"+acquirer[PSP[i].acquirer[u]].name+".png' height=15 /><br />";
		}
		*/






		cell1.innerHTML = "<div class=first><a target='_blank' style='font-size: 13px;' href='http://"+PSP[i].link+"'><img style='margin:3px 0 3px;' height='32' src='logo/"+PSP[i].logo+"' /></a></div>";

		cell2.innerHTML = "<div class=kort><img src='http://www.jewlscph.com/_design/common/img/payment/card_dankort.gif' width='24'><img src='http://quickpay.dk/features/payment-methods/gfx/visa-xs.gif' width='26'><img src='http://quickpay.dk/features/payment-methods/gfx/mc-xs.gif' width='24'><img src='http://www.epay.dk/images/forside/betalingskort-kreditkort/maestro-kreditkort.gif' width='24' /><img src='http://www.ehandel.se/bilder/kort-diners.gif' width='24' /></div>";

		cell3.innerHTML = HTML_acquirer;
		cell4.innerHTML = Math.round(PSP[i].setupFee + acquirer[1].setupFee) + " kr";
		cell5.innerHTML = Math.round(monthly) + " kr";

		cell7.innerHTML = Math.round(PSP[i].totalCosts) + " kr<a href='#' class='tooltip'>?<span>"+ PSP[i].name +":"+ (PSP[i].totalTransactionCosts+PSP[i].monthlyFee ) + "<br />Nets: "+ acquirer[1].totalCosts +"<br />SEB: "+ acquirer[2].totalCosts +"</span></a>";

		cell8.innerHTML = (PSP[i].totalCosts/transactions).toFixed(2)+" kr";


	}



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
