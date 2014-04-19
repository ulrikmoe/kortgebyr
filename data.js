/*

D A T A

*/


var lostReturnsFromSetupFee = 0.16; // 0.1 = 10% per år
var monthlytotal = 0;
var include_setup_fee = 1;

var CARDS =
{
	"dankort":
	{
		name: "Dankort",
		logo: "dankort.png"
	},
	"visa":
	{
		name: "Visa",
		logo: "visa.png"
	},
	"mastercard":
	{
		name: "MasterCard",
		logo: "master.png"
	},
	"maestro":
	{
		name: "Maestro",
		logo: "maestro.png"
	}

};



function defaultAcquirerCostFn(ntransactions,averageprice)
{

	var monthlytotal = include_setup_fee * this.setupFee * lostReturnsFromSetupFee / 12 + this.monthlyFee;
	monthlytotal += ($('acquirerPercentageRate').value.replace(',','.').replace('%','').replace(' ','') / 100 * averageprice
	+ $('acquirerFixedRate').value.replace(',','.').replace('k','').replace('r','').replace(' ','')*1 )   * ntransactions;

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
		monthlyFee: 1000/12,
		transactionCosts: 0,
		totalCosts: 0,
		costfn: function(ntransactions,averageprice)
		{
			var fee;
			if (averageprice <= 50 ) { fee=0.7; }
			else if (averageprice <= 100) { fee = 1.1; }
			else { fee = 1.39; }
			return fee * ntransactions + this.monthlyFee + include_setup_fee * this.setupFee * lostReturnsFromSetupFee / 12;

		}
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
		costfn: function(ntransactions,averageprice){
			var monthlytotal = include_setup_fee * this.setupFee * lostReturnsFromSetupFee / 12 + this.monthlyFee;
			var averageFee = $('acquirerPercentageRate').value.replace(',','.').replace('%','').replace(' ','') / 100 * averageprice;
			if( averageFee < 0.7){
				averageFee = 0.7;
			}						
			monthlytotal += averageFee * ntransactions;
			return monthlytotal;
		}
	},
	"seb":
	{
		name: "SEB Euroline",
		logo: "euroline.png",
		cards: ["visa", "mastercard", "maestro"],
		setupFee: 0,
		monthlyFee: 0,
		fixedTransactionFee: 0,
		percentageTransactionFee: 1.7,
		transactionCosts: 0,
		totalCosts: 0,
		costfn: defaultAcquirerCostFn
	},
	"swedbank":
	{
		name: "Swedbank",
		logo: "swedbank.png",
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
		name: "Handelsbanken",
		logo: "handelsbanken.png",
		cards: ["visa", "mastercard", "maestro"],
		setupFee: 1900,
		monthlyFee: 100,
		fixedTransactionFee: 0,
		percentageTransactionFee: 1.7,
		totalTransactionCosts: 0,
		totalCosts: 0,
		costfn: defaultAcquirerCostFn
	},
	"valitor":
	{
		name: "Valitor",
		logo: "valitor.png",
		cards: ["visa", "mastercard", "maestro"],
		setupFee: 0,
		monthlyFee: 0,
		fixedTransactionFee: 0,
		percentageTransactionFee: 1.7,
		totalTransactionCosts: 0,
		totalCosts: 0,
		costfn: defaultAcquirerCostFn
	}

};




function defaultCostFn(ntransactions,averageprice)
{

	var monthlytotal = include_setup_fee * this.setupFee * lostReturnsFromSetupFee / 12 + this.monthlyFee + $('3d').checked * this.monthly3dsecureFee;

	if (ntransactions > this.freeTransactions)
	{
		if( this.fixedTransactionFee ){
			monthlytotal += this.fixedTransactionFee * ( ntransactions - this.freeTransactions );
		}
		if (this.percentageTransactionFee)
		{
			monthlytotal += this.percentageTransactionFee / 100 * averageprice * ntransactions;
		}
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

	"yourpay":
	{
		name: "yourpay",
		logo: "yourpay.png",
		link: "http://yourpay.dk",
		isAcquirer: true,
		cards: ["visa", "mastercard"],
		setupFee: 0,
		monthlyFee: 0,
		monthly3dsecureFee: 0,
		chargeback: 275,
		costfn: function(ntransactions,averageprice){
			var freetransactions;
			var rate;
			if(ntransactions <= 2500){
				freetransactions = 25;
				rate = 0.02;
			}
			else if( ntransactions <= 5000){
				freetransactions = 25;
				rate = 0.0175;
			}
			else{
				freetransactions = 50;
				rate = 0.015;
			}
			
			if(ntransactions < freetransactions){
				freetransactions = ntransactions;
			}
			return (ntransactions-freetransactions) * averageprice * rate;
			
		}

	},
	"quickpay":
	{
		name: "quickpay",
		logo: "quickpay.png",
		link: "http://quickpay.dk",
		isAcquirer: false,
		availableAcquirers:  ["seb", "teller", "swedbank","valitor"],
		cards: ["dankort", "visa", "mastercard", "maestro"],
		setupFee: 0,
		monthlyFee: 150,
		monthly3dsecureFee: 0,
		costfn: function(ntransactions,averageprice){
						if(ntransactions===0){return 0;}
						var quickpayLimits=
						[500,600,1000,3000,10000,30000,9007199254740992],
							quickpayPerTransaction=
						[ 0 ,0.5,0.4 ,0.3 ,0.25 ,0.15 , 0.1],
							monthlytotal=this.monthlyFee;
						for(var i=0;i<7;i++){
							if(ntransactions<=quickpayLimits[i])
							{
								if(i-1>=0)
									{ monthlytotal += quickpayPerTransaction[i] * (ntransactions - quickpayLimits[i-1]); }
								break;
							}
							else
							{
								if(i-1>=0)
									{ monthlytotal += (quickpayLimits[i]-quickpayLimits[i - 1]) * quickpayPerTransaction[i]; }
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
		availableAcquirers: [0],
		cards: ["dankort"],
		setupFee: 399,
		monthlyFee: 99,
		monthly3dsecureFee: 0,
		fixedTransactionFee: 0.55,
		freeTransactions: 500,
		costfn:defaultCostFn
	},
	"epaybusiness":
	{
		name: "ePay Business", // 6
		logo: "epay.png",
		link: "http://epay.dk",
		isAcquirer: false,
		availableAcquirers: ["seb","teller","swedbank","handelsbanken","valitor"],
		cards: ["dankort","visa","mastercard","maestro"],
		setupFee: 999,
		monthlyFee: 299,
		monthly3dsecureFee: 0,
		fixedTransactionFee: 0.55,
		freeTransactions: 500,
		costfn:defaultCostFn
	},
	"epaypro":
	{
		name: "ePay Pro", // 7
		logo: "epay.png",
		link: "http://epay.dk",
		isAcquirer: false,
		availableAcquirers: ["teller"],
		cards: ["dankort","visa","mastercard","maestro"],
		setupFee: 599,
		monthlyFee: 199,
		monthly3dsecureFee: 0,
		fixedTransactionFee: 0.55,
		freeTransactions: 500,
		costfn:defaultCostFn
	},
	"dibsent":
	{
		name: "DIBS Entrepre.", // 8
		logo: "dibs.png",
		link: "http://dibs.dk",
		isAcquirer: false,
		availableAcquirers: ["seb","teller","swedbank"],
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
		availableAcquirers: ["seb","teller","swedbank"],
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
		availableAcquirers: ["seb","teller","swedbank"],
		cards: ["dankort","visa","mastercard","maestro"],
		setupFee: 0,
		monthlyFee: 449,
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
		availableAcquirers: ["teller"],
		cards: ["dankort","visa","mastercard"],
		setupFee: 1005,
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
		availableAcquirers: ["teller"],
		cards: ["dankort","visa","mastercard"],
		setupFee: 3016,
		monthlyFee: 502,
		monthly3dsecureFee: 0,
		fixedTransactionFee: 1,
		freeTransactions: 0,
		costfn:defaultCostFn
	},
	"netaxeptadvanced":
	{
		name: "Netaxept adv.", // 13
		logo: "nets.png",
		link: "https://www.terminalshop.dk/Netaxept/",
		isAcquirer: false,
		availableAcquirers: ["teller"],
		cards: ["dankort","visa","mastercard"],
		setupFee: 7540,
		monthlyFee: 703,
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
		availableAcquirers: ["teller"],
		cards: ["dankort","visa","mastercard","maestro"],
		setupFee: 199,
		monthlyFee: 149,
		monthly3dsecureFee: 50, // 49 + 1% af 99 (oprettelse)
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
		availableAcquirers: ["seb","teller","swedbank"],
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
		name: "Paymill", // 16
		logo: "paymill.png",
		link: "https://paymill.com",
		isAcquirer: true,
		cards: ["visa","mastercard","maestro"],
		setupFee: 0,
		monthlyFee: 0,
		monthly3dsecureFee: 0,
		fixedTransactionFee: 2.088,
		percentageTransactionFee: 3.95,
		chargeback: 140,
		freeTransactions: 0,
		costfn:defaultCostFn
	},
	"payson":
	{
		name: "Payson", // 17
		logo: "payson.png",
		link: "https://www.payson.se",
		isAcquirer: true,
		cards: ["visa","mastercard","maestro"],
		setupFee: 0,
		monthlyFee: 0,
		monthly3dsecureFee: 0,
		fixedTransactionFee: 3,
		percentageTransactionFee:3,
		chargeback: 140,
		freeTransactions: 0,
		costfn:defaultCostFn
	},
	"scannet":
	{
		name: "Scannet", // 18
		logo: "scannet.png",
		link: "http://www.scannet.dk/hosting/betalingsloesning/",
		isAcquirer: false,
		availableAcquirers: ["teller"],
		cards: ["dankort","visa","mastercard","maestro"],
		setupFee: 950,
		monthlyFee: 399,
		monthly3dsecureFee: 0,
		fixedTransactionFee: 0,
		freeTransactions: 0,
		costfn:defaultCostFn
	},
	"skrill":
	{
		name: "Skrill",
		logo: "skrill.png",
		link: "https://skrill.com",
		isAcquirer: true,
		cards: ["visa", "mastercard", "maestro"],
		setupFee: 0,
		monthlyFee: 0,
		monthly3dsecureFee: 0,
		chargeback: 187,
		freeTransactions: 0,
		costfn:	function( ntransactions, averageprice)
		{

			var oms = ntransactions * averageprice;
			var fee;
			if (oms < 18666 ) { fee = 2.9; }
			else if (oms <= 186000) { fee = 2.5; }
			else if (oms <= 373324) { fee = 2.1; }
			else { fee = 1.9; }
			return ( fee / 100 * averageprice + 1.87 ) * ntransactions;
		}
	},
	"payza":
	{
		name: "Payza",
		logo: "payza.png",
		link: "https://payza.com",
		isAcquirer: true,
		cards: ["visa", "mastercard", "maestro"],
		setupFee: 0,
		monthlyFee: 0,
		monthly3dsecureFee: 0,
		chargeback: 187,
		freeTransactions: 0,
		costfn:	function( ntransactions, averageprice)
		{

			var oms = ntransactions * averageprice;
			var fee = 4.94;
			return ( fee / 100 * averageprice + 1.9 ) * ntransactions;
		}
	},
	"payer":
	{
		name: "Payer.se", // 19
		logo: "payer.png",
		link: "http://payer.se/betallosning/",
		isAcquirer: false,
		availableAcquirers: ["teller"],
		cards: ["visa","mastercard","maestro"],
		setupFee: 1146.4, // 1400 sek
		monthlyFee: 327.55, // 400 sek
		monthly3dsecureFee: 0,
		fixedTransactionFee: 1.64, // 2 sek
		freeTransactions: 0,
		costfn:defaultCostFn
	},
	"pointbas":
	{
		name: "Point Bas", // 19
		logo: "point.png",
		link: "http://www.point.se/sv/Sweden/Start/E-handel/E-handel-Bas/",
		isAcquirer: false,
		availableAcquirers: ["teller","handelsbanken", "nordea", "seb", "swedbank"],
		cards: ["visa","mastercard","maestro"],
		setupFee: 818.04, // 999 sek
		monthlyFee: 162.92, // 199 sek
		monthly3dsecureFee: 0,
		fixedTransactionFee: 3.27, // 4 sek
		freeTransactions: 100,
		costfn:defaultCostFn
	},
	"pointpremium":
	{
		name: "Point Premium", // 19
		logo: "point.png",
		link: "http://www.point.se/sv/Sweden/Start/E-handel/E-handel-Bas/",
		isAcquirer: false,
		availableAcquirers: ["teller","handelsbanken", "nordea", "seb", "swedbank"],
		cards: ["visa","mastercard","maestro"],
		setupFee: 2046.34, // 2499 sek
		monthlyFee: 408.61, // 499 sek
		monthly3dsecureFee: 0,
		fixedTransactionFee: 2.05, // 2.5 sek
		freeTransactions: 400,
		costfn:defaultCostFn
	},
	"pointpremiumplus":
	{
		name: "Point Plus", // 19
		logo: "point.png",
		link: "http://www.point.se/sv/Sweden/Start/E-handel/E-handel-Bas/",
		isAcquirer: false,
		availableAcquirers: ["teller","handelsbanken", "nordea", "seb", "swedbank"],
		cards: ["visa","mastercard","maestro"],
		setupFee: 4092.6, // 4999 sek
		monthlyFee: 1636.9, // 1999 sek
		monthly3dsecureFee: 0,
		fixedTransactionFee: 0.61, // 0.75 sek
		freeTransactions: 4000,
		costfn:defaultCostFn
	},
	"certitrade":
	{
		name: "Certitrade", // 19
		logo: "certitrade.png",
		link: "http://www.certitrade.net/kortbetalning.php",
		isAcquirer: false,
		availableAcquirers: ["teller","handelsbanken", "nordea", "seb", "swedbank"],
		cards: ["visa","mastercard","maestro"],
		setupFee: 0,
		monthlyFee: 157.19, // 192 sek
		monthly3dsecureFee: 0,
		fixedTransactionFee: 1.23, // 1.5 sek
		percentageTransactionFee: 0.9, // VIRKER IKKE
		freeTransactions: 0,
		costfn:defaultCostFn
	},
	"noirepay":
	{
		name: "Noirepay", // 19
		logo: "noirepay.png",
		link: "http://noirepay.se/",
		isAcquirer: true,
		cards: ["visa","mastercard","maestro"],
		setupFee: 0,
		monthlyFee: 0, // 192 sek
		monthly3dsecureFee: 0,
		fixedTransactionFee: 0.82, // 1 sek
		percentageTransactionFee: 1.9, // VIRKER IKKE
		freeTransactions: 0,
		costfn:defaultCostFn
	},
	"scanpay":
	{
		name: "Scanpay", // 19
		logo: "scanpay.png",
		link: "http://www.certitrade.net/kortbetalning.php",
		isAcquirer: false,
		availableAcquirers: ["teller","handelsbanken", "nordea", "seb", "swedbank"],
		cards: ["dankort","visa","mastercard","maestro"],
		setupFee: 0,
		monthlyFee: 0,
		monthly3dsecureFee: 0,
		fixedTransactionFee: 0,
		freeTransactions: 0,
		costfn:defaultCostFn
	},
	
	
	
};
