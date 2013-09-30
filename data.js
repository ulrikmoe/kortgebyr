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
