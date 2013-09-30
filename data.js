/*
	
D A T A

*/


var lostReturnsFromSetupFee = 0.1; // 0.1 = 10% per år
var monthlytotal = 0;

var CARDS =
{
	"dankort":
	{
		name: "Dankort",
		logo: "dankort.gif"
	},
	"edankort":
	{
		name: "eDankort",
		logo: "edankort.png"
	},
	"visa":
	{
		name: "Visa",
		logo: "visa.gif"
	},
	"visaelectron":
	{
		name: "Visa Electron",
		logo: "visaelectron.png"
	},
	"mastercard":
	{
		name: "MasterCard",
		logo: "master.gif"
	},
	"maestro":
	{
		name: "Maestro",
		logo: "maestro.gif"
	},
	"diners":
	{
		name: "Diners",
		logo: "diners.gif"
	},
	"jcb":
	{
		name: "JCB",
		logo: "jcb.gif"
	},
	"unionpay":
	{
		name: "UnionPay",
		logo: "unionpay.gif"
	},
	"americanexpress":
	{
		name: "American Express",
		logo: "amex.png"
	},
	"discover":
	{
		name: "Discover",
		logo: "discover.png"
	}

};



function defaultAcquirerCostFn(ntransactions,averageprice)
{
	
	monthlytotal = $('incSetupFee').checked * this.setupFee * lostReturnsFromSetupFee / 12 + this.monthlyFee;
	monthlytotal += this.percentageTransactionFee / 100 * averageprice * ntransactions;
	
	return monthlytotal;
	
}



var ACQUIRER =
{

	"nets":
	{
		name: "nets",
		logo: "nets.png",
		cards: ["dankort"],
		setupFee: 250,
		monthlyFee: 83.33,
		transactionCosts: 0,
		totalCosts: 0,
		costfn: function(ntransactions,averageprice)
		{
			var fee;
			if (averageprice <= 50 ) { fee=0.7; }
			else if (averageprice <= 100) { fee = 1.1; }
			else { fee = 1.9; }
			return fee * ntransactions + this.monthlyFee + $('incSetupFee').checked * this.setupFee * lostReturnsFromSetupFee / 12;
			
		}
	},
	
	"seb":
	{
		name: "SEB",
		logo: "seb.png",
		cards: ["visa", "mastercard", "maestro"],
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
		name: "Teller",
		logo: "teller.png",
		cards: ["visa", "mastercard", "maestro"],
		setupFee: 1000,
		monthlyFee: 100,
		fixedTransactionFee: 0.7,
		percentageTransactionFee: 1.5,
		costfn: defaultAcquirerCostFn
	},
	
	"swebank":
	{
		name: "SWE Bank",
		logo: "swebank.png",
		cards: ["visa", "mastercard", "maestro"],
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
		cards: ["visa", "mastercard", "maestro"],
		setupFee: 1900,
		monthlyFee: 100,
		fixedTransactionFee: 0,
		percentageTransactionFee: 1.7,
		totalTransactionCosts: 0,
		totalCosts: 0,
		costfn: defaultAcquirerCostFn
	}

};




function defaultCostFn(ntransactions,averageprice)
{	

	monthlytotal = $('incSetupFee').checked * this.setupFee * lostReturnsFromSetupFee / 12 + this.monthlyFee + $('3d').checked * this.monthly3dsecureFee;
	
	if (ntransactions > this.freeTransactions) 
	{
		monthlytotal += this.fixedTransactionFee * ( ntransactions - this.freeTransactions );
	}
	if (this.isAcquirer)
	{
		monthlytotal += this.percentageTransactionFee / 100 * averageprice * ntransactions;
	}
	
	return monthlytotal;
}




var PSP =
{

	"paypal":
	{
		name: "paypal",
		logo: "paypal.png",
		link: "https://paypal.com",
		isAcquirer: true,
		cards: ["visa", "mastercard", "maestro"],
		setupFee: 0,
		monthlyFee: 0,
		monthly3dsecureFee: 0,
		chargeback: 120,
		costfn:	function( ntransactions, averageprice)
		{
		
			var oms = ntransactions * averageprice;
			var fee;
			if (oms < 20000 ) { fee = 3.4; }
			else if (oms <= 80000) { fee = 2.9; }
			else if (oms <= 400000) { fee = 2.7; }
			else if (oms <= 800000) { fee = 2.4; }
			else { fee = 1.9; }
			return ( fee / 100 * averageprice + 2.6 ) * ntransactions;
		}
	},
	
	"ewirelight":
	{
		name: "ewire light",
		logo: "ewire.png",
		link: "http://ewire.dk",
		isAcquirer: true,
		cards: ["dankort", "visa", "mastercard", "maestro"],
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
		name: "ewire pro",
		logo: "ewire.png",
		link: "http://ewire.dk",
		isAcquirer: true,
		cards: ["dankort", "visa", "mastercard", "maestro"],
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
		name: "quickpay",
		logo: "quickpay.png",
		link: "http://quickpay.dk",
		isAcquirer: false,
		acquirer: 1,
		availableAcquirers:  ["seb", "teller", "swebank"],
		cards: ["dankort", "visa", "mastercard", "maestro"],
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
		link: "http://epay.dk",
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
		link: "http://epay.dk",
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
		link: "http://epay.dk",
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
		link: "http://dibs.dk",
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
		link: "http://dibs.dk",
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
		link: "http://dibs.dk",
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
		link: "https://www.terminalshop.dk/Netaxept/",
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
		link: "https://www.terminalshop.dk/Netaxept/",
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
		link: "https://www.terminalshop.dk/Netaxept/",
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
		link: "http://dandomain.dk/produkter/betalingssystem.html",
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
		link: "https://wannafind.dk/betalingsgateway/",
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
		link: "https://paymill.com",
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
		link: "https://www.payson.se",
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




/*
	
D A T A

*/


function $(s){

	return document.getElementById(s);
}

var fieldVars =
[
	'transactions',
	'value',
	'3d',
	'incSetupFee',
	'dankort',
	'visamc'
];
	
var queryVars =
[
	'trn',
	'gns',
	'3ds',
	'mog',
	'dk',
	'vmc'
];

var defaultVal =
[
	100,
	570,
	true,
	true,
	true,
	true
];


function parseUrlVars()
{
	
	if ( location.search !== "" )
	{
		varTable = [];
		var x = location.search.substr(1).split("&");
		
		for (var i=0; i<x.length; i++)
		{
			var y = x[i].split("=");
			varTable[y[0]] = y[1];
		}
		
		queryVars.forEach(function(n, i)
		{
			if(varTable[n])
			{
				if ($(fieldVars[i]).type !== 'checkbox')
				{
					$(fieldVars[i]).value=varTable[n];
				}
				else
				{
					$(fieldVars[i]).checked =( varTable[n] === 1);
				}
			}

		});
	}
}

function saveUrlVars()
{
	
	var str='';
	
	fieldVars.forEach(function(n, i)
	{
		if($(n).type !== 'checkbox'&& $(n).value!=defaultVal[i] ){
			str += queryVars[i]+'='+$(n).value;
			if (str!='') { str+='&'; }
		}
		else if($(n).type == 'checkbox' && $(n).checked!=defaultVal[i])
		{
			str += queryVars[i]+'='+(($(n).checked)? 1 : 0);
			if (str!='') { str+='&'; }
		}
	});
	qmark = '';
	
	if (str[str.length - 1]=='&') { str=str.substring(0, str.length - 1); }
	if (str!='') { qmark='?'; }
	history.pushState('','', window.location.pathname+qmark+str);
}

function build()
{
	var selectedAcquirer="teller"; //****** tillad ændring af acquirer
	var transactions=$("transactions").value;
	var value=$("value").value;
	var table = $("data");
	var row;
	var rowValue=new Array();
	table.innerHTML = "";

	for (key in PSP)
	{

		var netsSupport = 0, otherAcquirerSupport = 0;
		var HTML_cards = "";
		var isAcquirer = PSP[key].isAcquirer;
		

		if ( !($('dankort').checked && $('visamc').checked ) || ( PSP[key].cards.indexOf('visa') > -1 && PSP[key].cards.indexOf('mastercard')) )
		{
			
			PSP[key].cards.forEach(function(n, i)
			{
				var dankortCheck = ( $('dankort').checked && n == 'dankort');
				var visamcCheck= ( $('visamc').checked && ACQUIRER[selectedAcquirer].cards.indexOf(n) > -1  );
				
				netsSupport|= dankortCheck;
				otherAcquirerSupport|=visamcCheck;
			
				if ( (visamcCheck|| dankortCheck) && (n!='maestro'|| $('3d').checked ) ) 
				{

					HTML_cards += "<img src='cards/"+CARDS[n].logo+"'/>";

				}
			});


			if ( HTML_cards != "")
			{
	
				var indloser_icons='';
				var info_icon ='<p class="tooltip"><img src="tooltip.gif"><span>';
				var info_icon_end='</span></p>';
				var oprettelse_info, faste_info, samlet_info, samletgebyr_info;
	
				//Assumed 80% Dankort og 20% visa/mastercard jf. statistik
				var dkshare, vmshare;
				
				if ( netsSupport && (!isAcquirer) )
				{
					indloser_icons='<img src="acquirer/nets.png">';
					if ( otherAcquirerSupport )
					{
						indloser_icons += '<br><img src="acquirer/teller.png">';
						dkshare = 0.8; vmshare=0.2;
					}
					else
					{ 
						dkshare=1; vmshare=0;
					}
				}
				else
				{
				
					if (!isAcquirer)
					{
						indloser_icons+='<img src="acquirer/teller.png">';
						dkshare=0  ;vmshare=1;
					}
					
				}
	
				samlet = PSP[key].costfn(transactions,value);
				
				samlet_info = info_icon + PSP[key].name + ': ' + ': ' + samlet.toFixed(2) + 'kr';
				
				samletgebyr_info = info_icon + PSP[key].name + ': ' + (samlet/transactions).toFixed(2) + 'kr';
				
				oprettelse_info = info_icon + PSP[key].name + ': ' + PSP[key].setupFee.toFixed(2) + 'kr';
				
				faste_info = info_icon + PSP[key].name + ': '+(PSP[key].monthlyFee + $('3d').checked*PSP[key].monthly3dsecureFee).toFixed(2) + 'kr';
				
				if (!isAcquirer && netsSupport)
				{
					addcost = ACQUIRER['nets'].costfn( transactions * dkshare,value );
					samlet_info += '<br>' + ACQUIRER['nets'].name + ' ('+(dkshare*100) + '\% tr.): '+addcost.toFixed(2)+'kr';
					samletgebyr_info += '<br>'+ACQUIRER['nets'].name+' ('+(dkshare*100)+'\% tr.): '+(addcost/transactions).toFixed(2) + 'kr';
					oprettelse_info += '<br>'+ACQUIRER['nets'].name+': '+ ACQUIRER['nets'].setupFee.toFixed(2) + 'kr';
					faste_info += '<br>'+ACQUIRER['nets'].name + ': '+ACQUIRER['nets'].monthlyFee.toFixed(2) + 'kr';
					samlet += addcost;
				}
				if (!isAcquirer && otherAcquirerSupport)
				{
					addcost = ACQUIRER[selectedAcquirer].costfn( transactions * vmshare, value);
					samlet_info += '<br>'+ACQUIRER[selectedAcquirer].name+' ('+(vmshare*100)+'\% tr.): '+addcost.toFixed(2) + 'kr';
					samletgebyr_info += '<br>'+ACQUIRER[selectedAcquirer].name+' ('+(vmshare*100)+'\% tr.): '+(addcost/transactions).toFixed(2) + 'kr';
					oprettelse_info += '<br>'+ACQUIRER[selectedAcquirer].name+': '+ACQUIRER[selectedAcquirer].setupFee.toFixed(2) + 'kr';
					faste_info += '<br>'+ACQUIRER[selectedAcquirer].name+': '+ACQUIRER[selectedAcquirer].monthlyFee.toFixed(2)+ 'kr';
					samlet += addcost;
				}
	
				//Insert at the right place to sort the PSPs by cost
	
				var rowcounter=0;
				while(rowcounter<rowValue.length && samlet>rowValue[rowcounter])
				{
					rowcounter++;
				}
				
				row = table.insertRow(rowcounter);
				rowValue.splice(rowcounter,0,samlet);
	
				// Insert HTML
				var logo_cell = row.insertCell(0);
				var indloser_cell = row.insertCell(1);
				var kort_cell = row.insertCell(2);
				var oprettelse_cell = row.insertCell(3);
				var faste_cell = row.insertCell(4);
				var samlet_cell = row.insertCell(5);
				var samletgebyr_cell = row.insertCell(6);
	
				logo_cell.innerHTML = '<div class="psp"><a href='+PSP[key].link+'><img src="psp/'+PSP[key].logo+'"><br>'+PSP[key].name+'</a></div>';
	
				kort_cell.innerHTML = HTML_cards;
				kort_cell.className = 'kort';
				oprettelse_cell.innerHTML = (PSP[key].setupFee+ACQUIRER[selectedAcquirer].setupFee * otherAcquirerSupport * (!isAcquirer)+ACQUIRER['nets'].setupFee*netsSupport ).toFixed(0) + ' kr';
				
				faste_cell.innerHTML = ( PSP[key].monthlyFee + $('3d').checked*PSP[key].monthly3dsecureFee + ACQUIRER[selectedAcquirer].monthlyFee * otherAcquirerSupport * (!isAcquirer)+ACQUIRER['nets'].monthlyFee*netsSupport * (!isAcquirer) ).toFixed(2)+' kr';
				indloser_cell.innerHTML = indloser_icons;
				indloser_cell.className = 'acquirer';
	
	
				oprettelse_cell.innerHTML += oprettelse_info+info_icon_end;
				faste_cell.innerHTML += faste_info+info_icon_end;
				samlet_info += info_icon_end;
				samletgebyr_info += info_icon_end;
				samlet_cell.innerHTML=samlet.toFixed(2)+' kr' + samlet_info;
				samletgebyr_cell.innerHTML = (samlet/transactions).toFixed(2)+' kr' +samletgebyr_info;
			}
		
		}
		
	}
	saveUrlVars();

}