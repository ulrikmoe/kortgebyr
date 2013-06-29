


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
		
		
		
		
		
		

		logo_cell.innerHTML = "<div class=psp><a target='_blank' href='http://"+PSP[i].link+"'><p style='background-position: 0 -"+32*(PSP[i].logo - 1)+"px'></p>"+ PSP[i].name +"</a></div>";

		kort_cell.innerHTML = "<div class=kort>"+ HTML_cards +"</div>";

		acquirer_cell.innerHTML = HTML_acquirer;
		
		
		
	
		
		
		
		
		oprettelse_cell.innerHTML = Math.round(PSP[i].totalSetupFee) + " kr";
		faste_cell.innerHTML = Math.round(PSP[i].totalMonthlyFee) + " kr";



		samlet_cell.innerHTML = Math.round(PSP[i].totalCosts) + " kr";

		kortgebyr_cell.innerHTML = (PSP[i].totalCosts/transactions).toFixed(2)+" kr"+ tooltip;


	}



}

