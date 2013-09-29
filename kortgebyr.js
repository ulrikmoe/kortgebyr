
function $(s){
	return document.getElementById(s);
}

fieldVars=['transactions','value','3d','incSetupFee','dankort','visamc'];
queryVars=['trn','gns','3ds','mog','dk','vmc'];
defaultVal=[100,570,true,true,true,true];

function parseUrlVars(){
	if (location.search != "")
	{
		varTable=new Array();
		var x = location.search.substr(1).split("&")
		for (var i=0; i<x.length; i++)
		{
			var y = x[i].split("=");
			varTable[y[0]]=y[1];
		}
		
		queryVars.forEach(function(n, i){
			if(varTable[n])
				if($(fieldVars[i]).type != 'checkbox'){
					$(fieldVars[i]).value=varTable[n];
				}
				else{
					$(fieldVars[i]).checked=(varTable[n]==1);
				}
			
		});
	}
}
function saveUrlVars(){
	
	var str='';
	fieldVars.forEach(function(n, i){
		if($(n).type != 'checkbox'&& $(n).value!=defaultVal[i] ){
			str+=queryVars[i]+'='+$(n).value;
			if(str!='')str+='&';
		}
		else if($(n).type == 'checkbox' && $(n).checked!=defaultVal[i]){
			str+=queryVars[i]+'='+(($(n).checked)? 1 : 0);
			if(str!='')str+='&';
		}
	});
	qmark='';
	if(str[str.length - 1]=='&')str=str.substring(0, str.length - 1);
	if(str!=''){qmark='?';}
	history.pushState('','',window.location.pathname+qmark+str);
}

function build() {
	var selectedAcquirer="teller"; //****** tillad ændring af acquirer
	var transactions=$("transactions").value;
	var value=$("value").value;
	var table = $("data");
	var row;
	var rowValue=new Array();
	table.innerHTML = "";

	for (key in PSP)
	{

		var netsSupport=0,otherAcquirerSupport=0;
		var HTML_cards = "";
		var isAcquirer=PSP[key].isAcquirer;
		

		if( !($('dankort').checked&&$('visamc').checked )||(PSP[key].cards.indexOf('visa')>-1&&PSP[key].cards.indexOf('mastercard')) )
			PSP[key].cards.forEach(function(n, i)
			{
			var dankortCheck =($('dankort').checked && n == 'dankort');
			var visamcCheck=( $('visamc').checked && ACQUIRER[selectedAcquirer].cards.indexOf(n) > -1  );
			netsSupport|=dankortCheck;
			otherAcquirerSupport|=visamcCheck;
			if( (visamcCheck|| dankortCheck) && (n!='maestro'|| $('3d').checked ) )
				HTML_cards += "<img src='cards/"+CARDS[n].logo+"'/>";
			});
		if(HTML_cards!=""){

			var indloser_icons='';
			var info_icon ='<p class="tooltip"><img src="tooltip.gif"><span>';
			var info_icon_end='</span></p>';
			var oprettelse_info,faste_info,samlet_info,samletgebyr_info;

			//Assumed 80% Dankort og 20% visa/mastercard jf. statistik
			var dkshare,vmshare;
			if(netsSupport && (!isAcquirer))
			{
				indloser_icons='<img src="acquirer/nets.png">';
				if(otherAcquirerSupport)
				{
					indloser_icons+='<br><img src="acquirer/teller.png">';
					dkshare=0.8;vmshare=0.2;
				}
				else
					{dkshare=1;vmshare=0;}
			}
			else
			{ 	if(!isAcquirer)indloser_icons+='<img src="acquirer/teller.png">';
				dkshare=0  ;vmshare=1;}

			samlet=PSP[key].costfn(transactions,value);
			samlet_info=info_icon+PSP[key].name+': '+': '+samlet.toFixed(2)+'kr';
			samletgebyr_info=info_icon+PSP[key].name+': '+(samlet/transactions).toFixed(2)+'kr';
			oprettelse_info=info_icon+PSP[key].name+': '+PSP[key].setupFee.toFixed(2)+'kr';
			faste_info=info_icon+PSP[key].name+': '+(PSP[key].monthlyFee+$('3d').checked*PSP[key].monthly3dsecureFee).toFixed(2)+'kr';
			if(!isAcquirer&& netsSupport){
				addcost=ACQUIRER['nets'].costfn(transactions*dkshare,value);
				samlet_info+='<br>'+ACQUIRER['nets'].name+' ('+(dkshare*100)+'\% tr.): '+addcost.toFixed(2)+'kr';
				samletgebyr_info+='<br>'+ACQUIRER['nets'].name+' ('+(dkshare*100)+'\% tr.): '+(addcost/transactions).toFixed(2)+'kr';
				oprettelse_info+='<br>'+ACQUIRER['nets'].name+': '+ACQUIRER['nets'].setupFee.toFixed(2)+'kr';
				faste_info+='<br>'+ACQUIRER['nets'].name+': '+ACQUIRER['nets'].monthlyFee.toFixed(2)+'kr';
				samlet+=addcost;
			}
			if(!isAcquirer && otherAcquirerSupport){
				addcost=ACQUIRER[selectedAcquirer].costfn(transactions*vmshare,value);
				samlet_info+='<br>'+ACQUIRER[selectedAcquirer].name+' ('+(vmshare*100)+'\% tr.): '+addcost.toFixed(2)+'kr';
				samletgebyr_info+='<br>'+ACQUIRER[selectedAcquirer].name+' ('+(vmshare*100)+'\% tr.): '+(addcost/transactions).toFixed(2)+'kr';
				oprettelse_info+='<br>'+ACQUIRER[selectedAcquirer].name+': '+ACQUIRER[selectedAcquirer].setupFee.toFixed(2)+'kr';
				faste_info+='<br>'+ACQUIRER[selectedAcquirer].name+': '+ACQUIRER[selectedAcquirer].monthlyFee.toFixed(2)+'kr';
				samlet+=addcost;
			}

			//Insert at the right place to sort the PSPs by cost

			var rowcounter=0;
			while(rowcounter<rowValue.length && samlet>rowValue[rowcounter]){
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

			logo_cell.innerHTML='<div class="psp"><a href='+PSP[key].link+'><img src="psp/'+PSP[key].logo+'"><br>'+PSP[key].name+'</a></div>';

			kort_cell.innerHTML = HTML_cards;
			kort_cell.className='kort';
			oprettelse_cell.innerHTML=(PSP[key].setupFee+ACQUIRER[selectedAcquirer].setupFee*otherAcquirerSupport*(!isAcquirer)+ACQUIRER['nets'].setupFee*netsSupport ).toFixed(0)+' kr';
			faste_cell.innerHTML    =(PSP[key].monthlyFee+$('3d').checked*PSP[key].monthly3dsecureFee+ACQUIRER[selectedAcquirer].monthlyFee*otherAcquirerSupport*(!isAcquirer)+ACQUIRER['nets'].monthlyFee*netsSupport*(!isAcquirer) ).toFixed(2)+' kr';
			indloser_cell.innerHTML=indloser_icons;
			indloser_cell.className='acquirer';


			oprettelse_cell.innerHTML+=oprettelse_info+info_icon_end;
			faste_cell.innerHTML+=faste_info+info_icon_end;
			samlet_info+=info_icon_end;
			samletgebyr_info+=info_icon_end;
			samlet_cell.innerHTML=samlet.toFixed(2)+' kr'+samlet_info;
			samletgebyr_cell.innerHTML=(samlet/transactions).toFixed(2)+' kr'+samletgebyr_info;
		}
	}
	saveUrlVars();

}
