function init() {

	transactions = document.getElementById("transactions").value;
	value = document.getElementById("value").value;

	PSP = [

		{
			name: "paypal",
			logo: "paypal.png",
			komplet: true,
			link: "paypal.com",
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
			komplet: true,
			link: "ewire.dk",
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
			komplet: true,
			link: "ewire.dk",
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
			komplet: true,
			link: "skrill.com",
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
			komplet: false,
			link: "quickpay.dk",
			setupFee: 0,
			monthlyFee: 150,
			fixedTransactionFee: 0,
			variableTransactionFee: 0,
			freeTransactions: 500,
			totalTransactionCosts: 0,
			totalCosts: 0
		},
		{
			name: "ePay Business",
			logo: "epay.png",
			komplet: false,
			link: "epay.dk",
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
			komplet: false,
			link: "epay.dk",
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
			komplet: false,
			link: "dibs.dk",
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
			komplet: false,
			link: "dibs.dk",
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
			komplet: false,
			link: "dibs.dk",
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
			logo: "netaxept.png",
			komplet: false,
			link: "terminalshop.dk",
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
			logo: "netaxept.png",
			komplet: false,
			link: "terminalshop.dk",
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
			logo: "netaxept.png",
			komplet: false,
			link: "terminalshop.dk",
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
			komplet: false,
			link: "dandomain.dk/produkter/betalingssystem.html",
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
			komplet: false,
			link: "wannafind.dk/betalingsgateway/",
			setupFee: 0,
			monthlyFee: 198,
			fixedTransactionFee: 0,
			variableTransactionFee: 0,
			freeTransactions: 0,
			totalTransactionCosts: 0,
			totalCosts: 0
		}



	];


	nets_setupFee = 250;
	nets_monthlyFee = 83.33;
	nets_fixedTransactionFee = 0.7;
	nets_variableTransactionFee = 0;
	nets_totalTransactionCosts = 0;
	nets_totalCosts = 0;


	seb_setupFee = 0;
	seb_monthlyFee = 0;
	seb_fixedTransactionFees = 0;
	seb_variableTransactionFees = 1.6;
	seb_totalTransactionCosts = 0;
	seb_totalCosts = 0;


	oms = transactions * value;

	calc();

}


function calc() {

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

	if ( value <= 50 ) { nets_fixedTransactionFee = 0.7; }
	else if ( value <= 100 ) { nets_fixedTransactionFee = 1.1; }
	else if ( value <= 500 ) { nets_fixedTransactionFee = 1.45; }
	else { nets_fixedTransactionFee = 1.45; nets_percentages = 0.001 }


	nets_totalTransactionCosts = 0.8 * ( transactions * nets_fixedTransactionFee + oms * nets_variableTransactionFee );

	seb_totalTransactionCosts = 0.2 * oms * 0.0165;


	seb_totalCosts = seb_totalTransactionCosts;


	/*
		Her udregner jeg transaktionsgebyrer + total
	*/

	for (var i=0; i<PSP.length; i++)
	{


		if ( PSP[i].komplet == true )
		{

			// PSP[0].variableTransactionFee

			PSP[i].totalTransactionCosts = ( PSP[i].fixedTransactionFee * transactions ) + ( PSP[i].variableTransactionFee/100 * oms ) ;

			PSP[i].totalCosts =	PSP[i].monthlyFee + PSP[i].totalTransactionCosts;

		}
		else
		{


		//	PSP[i].setupFee += nets_setupFee;
		//	PSP[i].monthlyFee += nets_monthlyFee;


			if ( i == 5 )
			{
				
			}
			else
			{

				if ( transactions > PSP[i].freeTransactions )
				{

					PSP[i].totalTransactionCosts = ( PSP[i].fixedTransactionFee * (transactions- PSP[i].freeTransactions ) );

				}
				else {

					PSP[i].totalTransactionCosts =  0;

				}


			}


			nets_totalCosts = nets_totalTransactionCosts + nets_monthlyFee;


			PSP[i].totalCosts =	PSP[i].monthlyFee + PSP[i].totalTransactionCosts + nets_totalCosts + seb_totalCosts;


		}
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


		if ( PSP[i].komplet == true )
		{
			var monthly = PSP[i].monthlyFee;
			var transactionsCosts = Math.round(PSP[i].totalTransactionCosts) ;
		}
		else
		{
			var monthly = PSP[i].monthlyFee+nets_monthlyFee+seb_monthlyFee;
			var transactionsCosts = Math.round(PSP[i].totalTransactionCosts+nets_totalTransactionCosts+seb_totalTransactionCosts) ;

		}




		cell1.innerHTML = "<div class=first><a target='_blank' style='font-size: 15px;' href='http://"+PSP[i].link+"'><img style='margin:3px 0 3px;' height='26' src='logo/"+PSP[i].logo+"' /> "+PSP[i].name+"</a></div>";

		cell2.innerHTML = "<div class=kort><img src='http://www.jewlscph.com/_design/common/img/payment/card_dankort.gif' width='24'><img src='http://quickpay.dk/features/payment-methods/gfx/visa-xs.gif' width='26'><img src='http://quickpay.dk/features/payment-methods/gfx/mc-xs.gif' width='24'><img src='http://www.epay.dk/images/forside/betalingskort-kreditkort/maestro-kreditkort.gif' width='24' /><img src='http://www.ehandel.se/bilder/kort-diners.gif' width='24' /></div>";

		cell3.innerHTML = "<img src='logo/netaxept.png' height=15 /><br /><img src='http://quickpay.dk/acquirers/euroline/gfx/euroline-logo.gif' height='13' />";
		cell4.innerHTML = Math.round(PSP[i].setupFee+nets_setupFee) + " kr";
		cell5.innerHTML = Math.round(monthly) + " kr";

		cell7.innerHTML = "<b>" + Math.round(PSP[i].totalCosts) + " kr</b><a href='#' class='tooltip'>?<span>"+ PSP[i].name +":"+ (PSP[i].totalTransactionCosts+PSP[i].monthlyFee ) + "<br />Nets: "+ nets_totalCosts +"<br />SEB: "+ seb_totalCosts +"</span></a>";

		cell8.innerHTML = "<b>"+(PSP[i].totalCosts/transactions).toFixed(2)+" kr</b>";


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
