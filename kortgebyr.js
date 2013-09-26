


function calc() {


	oms = transactions * value;



	/*
		501 -> 600	50 øre/stk
		601 -> 1000	40 øre/stk
		1001 -> 3000	30 øre/stk
		3001 -> 10000	25 øre/stk
		10001 -> 30000	15 øre/stk
		30001 -> 60000	10 øre/stk
	*/

	if ( transactions > 500) {
		
		var quickpay = 0;
		
		if ( transactions < 601 )
		{
			quickpay = ( transactions - 500 ) * 0.5 ;				
		}
		else if ( transactions < 1001 )
		{
			quickpay = 100 * 0.5 + ( transactions - 600 ) * 0.4;				
		}
		else if ( transactions < 3001 )
		{
			quickpay = 100 * 0.5 + 400 * 0.4 + ( transactions - 1000 ) * 0.3;
		}
		else if ( transactions < 10001 )
		{
			quickpay = 100 * 0.5 + 400 * 0.4 + 2000 * 0.3;
			quickpay += ( transactions - 3000 ) * 0.25;
		}
		else if ( transactions < 30001 )
		{
			quickpay = 100 * 0.5 + 400 * 0.4 + 2000 * 0.3 + 7000 * 0.25 ;
			quickpay += ( transactions - 10000 ) * 0.15;
		}			
		else
		{
			quickpay = 100 * 0.5 + 400 * 0.4 + 2000 * 0.3 + 7000 * 0.25 + 20000 * 0.15 ;
			quickpay += ( transactions - 30000 ) * 0.10;
		}
		
		
		PSP[4].fixedTransactionFee = quickpay / ( transactions - 500 );
			
	}



	// Paypal
	if (oms < 20000 ) { PSP[0].variableTransactionFee = 3.4; }
	else if (oms <= 80000) { PSP[0].variableTransactionFee = 2.9; }
	else if (oms <= 400000) { PSP[0].variableTransactionFee = 2.7; }
	else if (oms <= 800000) { PSP[0].variableTransactionFee = 2.4; }
	else { PSP[0].variableTransactionFee = 1.9; }


	// Nets
	if ( value <= 50 ) { acquirer[0].fixedTransactionFee = 0.7; }
	else if ( value <= 100 ) { acquirer[0].fixedTransactionFee = 1.1; }
	else if ( value <= 500 ) { acquirer[0].fixedTransactionFee = 1.45; }
	else { acquirer[0].fixedTransactionFee = 1.45; acquirer[0].variableTransactionFee = 0.001 }



	// Her udregner jeg costs for samtlige indløsere.

	for (var i=0; i<acquirer.length; i++)
	{


		var kortfordeling = 1;

		if ( ( dankort === true ) && (visamc === true) )
		{
			if ( acquirer[i].name !== "nets" )
			{
				kortfordeling = (100-dankortfrekvens )/100;
			}
			else
			{
				kortfordeling = dankortfrekvens/100;
			}
		}

		acquirer[i].transactionCosts = kortfordeling * ( transactions * acquirer[i].fixedTransactionFee + oms * (acquirer[i].variableTransactionFee / 100));

		acquirer[i].totalCosts = acquirer[i].transactionCosts + acquirer[i].monthlyFee;

		console.log( acquirer[i].name +": " + acquirer[i].totalCosts);

	}


	// Her sorterer jeg indløserne efter totalCosts






	// Her udregner jeg costs for samtlige betalingsløsninger

	for (var i=0; i<PSP.length; i++)
	{





		if ( PSP[i].acquirer == undefined ) // Paypal, ewire, Skrill
		{

			PSP[i].transactionCosts = ( PSP[i].fixedTransactionFee * transactions ) + ( PSP[i].variableTransactionFee/100 * oms ) ;

		}
		else if ( transactions > PSP[i].freeTransactions )
		{

			PSP[i].transactionCosts = ( PSP[i].fixedTransactionFee * ( transactions- PSP[i].freeTransactions ) );


		}

		PSP[i].costs =	PSP[i].monthlyFee + PSP[i].transactionCosts;



		PSP[i].totalCosts = PSP[i].costs;
		PSP[i].totalMonthlyFee = PSP[i].monthlyFee;
		PSP[i].totalSetupFee = PSP[i].setupFee;



		if ( PSP[i].acquirer !== undefined ) {


			var min = Number.POSITIVE_INFINITY;
			var tmp;
			var cheapestAcquirer;

			PSP[i].availableAcquirers.forEach(function(n, x)
			{

				console.log("n="+n + ", x="+x);



				if ( ( n > 0 ) && (jcb === false) )
				{

					 tmp = acquirer[n].totalCosts;

					 if ( tmp < min)
					 {
						 min = tmp;
						 cheapestAcquirer = n;
					 }
				}
				else if ( jcb === true )
				{

					cheapestAcquirer = 2; // Teller

				}


			});


			PSP[i].acquirer = cheapestAcquirer;



			PSP[i].costs =	PSP[i].monthlyFee + PSP[i].transactionCosts;


			if ( ( dankort === true ) && ( PSP[i].acquirer !== undefined ) )
			{

				PSP[i].totalSetupFee += acquirer[0].setupFee;
				PSP[i].totalMonthlyFee += acquirer[0].monthlyFee;
				PSP[i].totalCosts += acquirer[0].totalCosts;
			}

			if ( ( PSP[i].acquirer !== 0 ) && ( visamc === true ) )
			{

				PSP[i].totalSetupFee += acquirer[ PSP[i].acquirer ].setupFee;
				PSP[i].totalMonthlyFee += acquirer[ PSP[i].acquirer ].monthlyFee;
				PSP[i].totalCosts += acquirer[ PSP[i].acquirer ].totalCosts;
			}


		}


	}

	// Her sorterer jeg betalingsgateways efter totalCosts
	PSP.sort(function (b, a) {

		return a.totalCosts - b.totalCosts;

	});



	build();

}




function build() {


	var table = document.getElementById("data");
	var row;


	table.innerHTML = "";

	for (var i=0; i<PSP.length; i++)
	{

		// fjern dankort-only løsninger

		if ( ( visamc === true )  && ( PSP[i].availableAcquirers == 0 ) ) {
				console.log(PSP[i].acquirer);

			continue;
		}

		row = table.insertRow(0);
		var logo_cell = row.insertCell(0);
		var kort_cell = row.insertCell(1);
		var acquirer_cell = row.insertCell(2);
		var oprettelse_cell = row.insertCell(3);
		var faste_cell = row.insertCell(4);
		var samlet_cell = row.insertCell(5);
		var kortgebyr_cell = row.insertCell(6);

		var HTML_acquirer = "<div class='acquirer'>";
		var HTML_cards = "";





		if ( PSP[i].acquirer == undefined )
		{

			PSP[i].cards.forEach(function(n, i)
			{
					HTML_cards += "<img src='cards/"+cards[n].logo+"' width='24' />";
			});

		}
		else
		{

			if ( ( dankort === true ) && ( PSP[i].acquirer !== undefined ) )
			{
				HTML_acquirer += "<p style='background-position: 0 0px'></p>";
				HTML_cards += "<img src='cards/dankort.png' height='16' />";

				if (PSP[i].cards.indexOf(1) > -1)
				{
					HTML_cards += "<img src='cards/edankort.png' height='16' />";

				}
			}

			if ( ( PSP[i].acquirer !== 0 ) && ( visamc === true ) )
			{
				HTML_acquirer += "<p style='background-position: 0 -"+16*(acquirer[PSP[i].acquirer].logo - 1)+"px'></p>";


				acquirer[PSP[i].acquirer].cards.forEach(function(n, x)
				{

					if ( PSP[i].cards.indexOf(n) > -1)
					{
						HTML_cards += "<img src='cards/"+cards[n].logo+"' height='16' />";
					}

				});

			}


		}

		HTML_acquirer += "</div>";
		
		
		
		
		var	tooltip = "<a href='#' class='tooltip'><img src='tooltip.gif' /><span>Kortgebyr er de samlede omkostninger pr. gns. transaktion.</span></a>";
		
		
		
		
		
		

		logo_cell.innerHTML = "<div class=psp><a href='http://"+PSP[i].link+"'><p style='background-position: 0 -"+32*(PSP[i].logo - 1)+"px'></p>"+ PSP[i].name +"</a></div>";

		kort_cell.innerHTML = "<div class=kort>"+ HTML_cards +"</div>";

		acquirer_cell.innerHTML = HTML_acquirer;
		
		
		
	
		
		
		
		
		oprettelse_cell.innerHTML = Math.round(PSP[i].totalSetupFee) + " kr";
		faste_cell.innerHTML = Math.round(PSP[i].totalMonthlyFee) + " kr";



		samlet_cell.innerHTML = Math.round(PSP[i].totalCosts) + " kr";

		kortgebyr_cell.innerHTML = (PSP[i].totalCosts/transactions).toFixed(2)+" kr"+ tooltip;


	}



}










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
		},
		{
			name: "Paymill", // 0
			logo: 10,
			link: "paymill.com",
			cards: [2,3,4,5,9,10],
			setupFee: 0,
			monthlyFee: 0,
			fixedTransactionFee: 2.1,
			variableTransactionFee: 2.95,
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



