


function calc() {


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
				
				
				
				if ( n > 0 )
				{
					
					 tmp = acquirer[n].totalCosts;
					 					 					
					 if ( tmp < min)
					 {
						 min = tmp;
						 cheapestAcquirer = n;
						 
					 }
					
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

		row=table.insertRow(0);
		var cell1=row.insertCell(0);
		var cell2=row.insertCell(1);
		var cell3=row.insertCell(2);
		var cell4=row.insertCell(3);
		var cell5=row.insertCell(4);

		var cell7=row.insertCell(5);
		var cell8=row.insertCell(6);

		var HTML_acquirer = "";
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
				HTML_acquirer = "<img src='logo/nets.png' width='55' /><br />";
				HTML_cards += "<img src='cards/dankort.gif' width='24' /><img src='cards/edankort.png' width='24' />";
			}
			
			if ( ( PSP[i].acquirer !== 0 ) && ( visamc === true ) )
			{
				HTML_acquirer += "<img src='logo/"+ acquirer[PSP[i].acquirer].logo +"' width='55' />";
				
				
				acquirer[PSP[i].acquirer].cards.forEach(function(n, i)
				{
					HTML_cards += "<img src='cards/"+cards[n].logo+"' width='24' />";
				});
	
			}
						

		}



		cell1.innerHTML = "<div class=first><a target='_blank' style='font-size: 13px;' href='http://"+PSP[i].link+"'><img style='margin:3px 0 3px;' height='32' src='logo/"+PSP[i].logo+"' /></a><br /><a class='external' href='http://"+PSP[i].link+"'>"+ PSP[i].name +"</a></div>";

		cell2.innerHTML = "<div class=kort>"+ HTML_cards +"</div>";

		cell3.innerHTML = HTML_acquirer;
		cell4.innerHTML = Math.round(PSP[i].totalSetupFee) + " kr";
		cell5.innerHTML = Math.round(PSP[i].totalMonthlyFee) + " kr";


		
		var	tooltip = "<a href='#' class='tooltip'>?<span>"+PSP[i].name +":"+ (PSP[i].costs );
		
		if ( PSP[i].acquirer !== undefined )
		{
			
			if (dankort === true )
			{
				tooltip += "<br />Nets: "+ acquirer[0].totalCosts;
			}
			
			if (visamc === true)
			{
				tooltip += "<br />"+acquirer[ PSP[i].acquirer ].name + ": "+ acquirer[ PSP[i].acquirer ].totalCosts;
			}

		}
		
		tooltip += "</span></a>";



		cell7.innerHTML = Math.round(PSP[i].totalCosts) + " kr"+ tooltip;

		cell8.innerHTML = (PSP[i].totalCosts/transactions).toFixed(2)+" kr"+ tooltip;


	}



}

