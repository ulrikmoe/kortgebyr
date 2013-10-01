/*
	
D A T A

*/

function $(s){

	return document.getElementById(s);
}

var VARS=
{
	'transactions':
	{
		field: 'transactions',
		query: 'trn',
		type: 'int',
		default: 100
	},
	'average_value':
	{
		field: 'value',
		query: 'gns',
		type: 'int',
		default: 570
	},
	'acquirer_selection':
	{
		field: 'selectacquirer',
		query: 'ind',
		type: 'select',
		default: 'teller'
	},
	'3dsecure':
	{
		field: '3d',
		query: '3ds',
		type: 'checkbox',
		default: 1
	},
	'include_setup_fee':
	{
		field: 'incSetupFee',
		query: 'mog', //Med OprettelsesGebyr
		type: 'checkbox',
		default: 1
	},
	'dankort':
	{
		field: 'dankort',
		query: 'dk', 
		type: 'checkbox',
		default: 1
	},
	'visa_mastercard':
	{
		field: 'visamc',
		query: 'vmc',
		type: 'checkbox',
		default: 1
	}
	
}
function setFieldValue(key,value){
	switch(VARS[key].type)
	{
	case 'int':
		$(VARS[key].field).value=value;
		break;
	case 'checkbox':
		$(VARS[key].field).checked =( value === 1);
		break;
	case 'select':
		$('option_'+value).selected = true;
	}
}
function getFieldValue(key){
	var value;
	switch(VARS[key].type)
	{
	case 'int':
		value=$(VARS[key].field).value;
		break;
	case 'checkbox':
		value=$(VARS[key].field).checked;
		break;
	case 'select':
		value=$(VARS[key].field).options[ $(VARS[key].field).selectedIndex ].id.substr(7);
		break;
	}
	return value;
}


function parseUrlVars()
{
	if ( location.search !== "" )
	{
		var varTable = [];
		var x = location.search.substr(1).toLowerCase().split("&");
		
		for (var i=0; i<x.length; i++)
		{
			var y = x[i].split("=");
			varTable[y[0]] = y[1];
		}
	}
	for(key in VARS)
	{
		if(varTable && varTable[VARS[key].query])
		{

			setFieldValue( key , varTable[VARS[key].query] );
		}
		else
		{
			setFieldValue( key , VARS[key].default );	
		}

	}
}

function saveUrlVars()
{
	
	var str='';
	
	for(key in VARS)
	{
		if(getFieldValue(key) != VARS[key].default){
			str += VARS[key].query+'='+getFieldValue(key);
			if (str!=='') { str+='&'; }
		}
	}
	var qmark = '';
	if (str[str.length - 1]==='&') { str=str.substring(0, str.length - 1); }
	if (str!=='') { qmark='?'; }
	if(window.location.pathname+qmark+str !== window.location.pathname+window.location.search )
	{
		history.pushState({ foo: window.location.search },'b', window.location.pathname+qmark+str);
	}
}
window.addEventListener('popstate', function(event) {
    if (event.state) {
		parseUrlVars();
		build('popstate');
    }
}, false);


function build(condition)
{
	//Generer muligheden for at vælge indløser, samt vælg indløser:
	
	if(condition === 'init')
	{
		var acquirersString="";
		for(var key in ACQUIRER)
		{
			if( key !== 'nets' )
			{
				acquirersString += '<option id="option_'+ key + '">' + ACQUIRER[key].name + '</option>';
			}
		}
		$('selectacquirer').innerHTML = acquirersString;
		parseUrlVars();
		history.replaceState({ foo: window.location.search },'b',window.location.pathname+window.location.search);
	}
	var selectedAcquirer = $('selectacquirer').options[ $('selectacquirer').selectedIndex ].id.substring(7);
		
	// Variable brugt hele vejen igennem genereringen af tabellen:
		
	var transactions = $("transactions").value.replace(",", ".");
	var value = $("value").value.replace(",", ".");
	var table = $("data");
	var rowValue = [];
	table.innerHTML = "";

	for (var key in PSP)
	{
	
		if ((PSP[key].isAcquirer || PSP[key].availableAcquirers.indexOf(selectedAcquirer) >-1)  
		&& ( !( $('dankort').checked && $('visamc').checked ) 
			|| ( PSP[key].cards.indexOf('visa') > -1 && PSP[key].cards.indexOf('mastercard') > -1 ) ) )
		{
			var netsSupport = 0, otherAcquirerSupport = 0;
			var HTML_cards = "";
			var isAcquirer = PSP[key].isAcquirer;
			
			for(var i in PSP[key].cards)
			{
				var n= PSP[key].cards[i];
				var dankortCheck = ( $('dankort').checked && n === 'dankort');
				var visamcCheck= ( $('visamc').checked && ACQUIRER[selectedAcquirer].cards.indexOf(n) > -1  );
				
				netsSupport|= dankortCheck;
				otherAcquirerSupport|=visamcCheck;
			
				if ( (visamcCheck|| dankortCheck) && (n!=='maestro'|| $('3d').checked ) ) 
				{

					HTML_cards += "<img src='cards/"+CARDS[n].logo+"'/>";

				}
			}
			
			// Fortsæt kun hvis PSP'en supporter nogen af de valgte kort:
			if ( HTML_cards !== "")
			{
				var indloser_icons='';
				var info_icon ='<p class="tooltip"><img src="tooltip.gif"><span>';
				var info_icon_end='</span></p>';
	
				//Assumed 80% Dankort og 20% visa/mastercard jf. statistik
				var dkshare, vmshare;
				
				if ( netsSupport && (!isAcquirer) )
				{
					indloser_icons='<img src="acquirer/nets.png">';
					if ( otherAcquirerSupport )
					{
						indloser_icons += '<br><img src="acquirer/' + ACQUIRER[ selectedAcquirer ].logo + '">';
						dkshare = 0.82; vmshare=0.18;
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
						indloser_icons+= '<br><img src="acquirer/' + ACQUIRER[ selectedAcquirer ].logo + '">';
						dkshare=0  ;vmshare=1;
					}
					
				}
				
				// Rækken bliver nu konstrueret:
	
				var samlet = PSP[key].costfn(transactions,value);
				var samlet_info = info_icon + PSP[key].name + ': ' + samlet.toFixed(2).replace(".", ",") + 'kr';		
				var samletgebyr_info = info_icon + PSP[key].name + ': ' + (samlet / transactions).toFixed(2).replace(".", ",") + 'kr';
				var oprettelse_info = info_icon + PSP[key].name + ': ' + PSP[key].setupFee.toFixed(2).replace(".", ",") + 'kr';
				var faste_info = info_icon + PSP[key].name + ': '+ (PSP[key].monthlyFee + $('3d').checked * PSP[key].monthly3dsecureFee).toFixed(2).replace(".", ",") + 'kr';
				var addcost;
				if (!isAcquirer && netsSupport)
				{
					addcost = ACQUIRER.nets.costfn( transactions * dkshare,value );
					samlet_info += '<br>' + ACQUIRER.nets.name + ' ('+(dkshare * 100) + '% tr.): '+addcost.toFixed(2).replace(".", ",")+'kr';
					samletgebyr_info += '<br>'+ACQUIRER.nets.name+' ('+(dkshare * 100)+'% tr.): '+(addcost/transactions).toFixed(2).replace(".", ",") + 'kr';
					oprettelse_info += '<br>'+ACQUIRER.nets.name+': '+ ACQUIRER.nets.setupFee.toFixed(2).replace(".", ",") + 'kr';
					faste_info += '<br>'+ACQUIRER.nets.name + ': '+ACQUIRER.nets.monthlyFee.toFixed(2).replace(".", ",") + 'kr';
					samlet += addcost;
				}
				if (!isAcquirer && otherAcquirerSupport)
				{
					addcost = ACQUIRER[selectedAcquirer].costfn( transactions * vmshare, value);
					samlet_info += '<br>'+ACQUIRER[selectedAcquirer].name + ' (' + (vmshare * 100) + '% tr.): ' + addcost.toFixed(2).replace(".", ",") + 'kr';
					samletgebyr_info += '<br>' + ACQUIRER[selectedAcquirer].name+' (' + (vmshare * 100) + '% tr.): ' + (addcost/transactions).toFixed(2).replace(".", ",") + 'kr';
					oprettelse_info += '<br>' + ACQUIRER[selectedAcquirer].name + ': ' + ACQUIRER[selectedAcquirer].setupFee.toFixed(2).replace(".", ",") + 'kr';
					faste_info += '<br>' + ACQUIRER[selectedAcquirer].name + ': ' + ACQUIRER[selectedAcquirer].monthlyFee.toFixed(2).replace(".", ",") + 'kr';
					samlet += addcost;
				}
	
				//Insert at the right place to sort the PSPs by cost
	
				var rowcounter=0;
				while(rowcounter<rowValue.length && samlet>rowValue[rowcounter])
				{
					rowcounter++;
				}
				
				var row = table.insertRow(rowcounter);
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
				oprettelse_cell.innerHTML = (PSP[key].setupFee+ACQUIRER[selectedAcquirer].setupFee * otherAcquirerSupport * (!isAcquirer)+ACQUIRER.nets.setupFee*netsSupport*(!isAcquirer) ).toFixed(0) + ' kr';
				
				faste_cell.innerHTML = ( PSP[key].monthlyFee + $('3d').checked*PSP[key].monthly3dsecureFee + ACQUIRER[selectedAcquirer].monthlyFee * otherAcquirerSupport * (!isAcquirer)+ACQUIRER.nets.monthlyFee*netsSupport * (!isAcquirer) ).toFixed(2).replace(".", ",")+' kr';
				indloser_cell.innerHTML = indloser_icons;
				indloser_cell.className = 'acquirer';


				oprettelse_cell.innerHTML += oprettelse_info+info_icon_end;
				faste_cell.innerHTML += faste_info+info_icon_end;
				samlet_info += info_icon_end;
				samletgebyr_info += info_icon_end;
				samlet_cell.innerHTML=samlet.toFixed(2).replace(".", ",")+' kr' + samlet_info;
				samletgebyr_cell.innerHTML = (samlet/transactions).toFixed(2).replace(".", ",")+' kr' +samletgebyr_info;
			}
		
		}
		
	}
	if(condition!=='init' && condition !== 'popstate' && condition!=='keyup')
		saveUrlVars();

}
