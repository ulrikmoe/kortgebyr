//This construction enables one to make instantiated classes easily
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  this.Class = function(){};
   Class.extend = function(prop) {
    var _super = this.prototype;
    initializing = true;
    var prototype = new this();
    initializing = false;
       for (var name in prop) {
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
			var tmp = this._super;
			this._super = _super[name];
			var ret = fn.apply(this, arguments);        
			this._super = tmp;
			return ret;
          };
        })(name, prop[name]) :
		prop[name];
	}
	function Class() 
	{
		if ( !initializing && this.init )
	  		this.init.apply(this, arguments);
		}
		Class.prototype = prototype;
		Class.prototype.constructor = Class;
		Class.extend = arguments.callee;
   
	    return Class;
  	};
})();

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}
var circleChartData =
[
	{
		name: 'Over 500 kroner',
		percentage: 20
	},
	{
		name: 'Mellem 250 og 500 kroner',
		percentage: 40
	},
	{
		name: 'Mellem 100 og 250 kroner',
		percentage: 30
	},
	{
		name: 'Under 100 kroner',
		percentage: 10
	}
]


function initCanvas(){
	document.getElementById('graph').style.display='inline-block';
	var cs = new CoordinateSystem('graph',500,350);
	cs.drawGraph([[0,100],[390,260]],{key:'lol1',color:"#1f77b4"});
	cs.drawGraph([[0,0],[100,140],[250,250],[390,300]],{key:'lol2',color:"#ff7f0e"});
	cs.drawGraph([[0,0],[350,300]],{key:'lol3',color:"#2ca02c"});
	cs.getClosestGraph();
	var pc = new PieChart('graph',350,350,circleChartData);
	//document.getElementById('graph').style.clear='both';
}

CanvasRenderingContext2D.prototype.arrowFromTo = function(fromx,fromy,tox,toy,labelx,labely)
{
	var headlen = 8;   // length of head in pixels
	var angle = Math.atan2(toy-fromy,tox-fromx);
	var arrowHeadAngle=Math.PI/3;
	this.beginPath();
	this.moveTo(fromx, fromy);
	this.lineTo(tox, toy);
	this.closePath();
	this.stroke();
	this.beginPath();
	this.moveTo(tox, toy);
	this.lineTo(tox-headlen*Math.cos(angle - arrowHeadAngle/2) , toy - headlen * Math.sin(angle - arrowHeadAngle/2));
	this.lineTo(tox-headlen*Math.cos(angle + arrowHeadAngle/2) , toy - headlen * Math.sin(angle + arrowHeadAngle/2));
	this.closePath();
	this.stroke();
	this.fill();
}

function log10(val) {
  return Math.log(val) / Math.LN10;
}

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

function createLayer(width,height,z,firstLayer){
	var canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	canvas.style.zIndex = z;
	if(!firstLayer)
	{
		canvas.className='layer';
		canvas.style.left=0;
	}
	//canvas.style.border = "1px solid";
	return canvas;
}

function GetAngleOfLineBetweenTwoPoints(x0, y0 , x1 , y1)
{ 
	var xDiff = x1-x0; 
	var yDiff= y1-y0; 
	var angle = (Math.atan2(yDiff,xDiff))-Math.PI/2;
	if(angle<0)
	{
		angle+=2*Math.PI;
	}
	return angle;
} 
var defaultColorPattern = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];


var PieChart = Class.extend({
	chartLayer: null,
	chartCtx: null,
	chartSelectCtx:null,
	chartSelectLayer:null,
	centerX:0,
	centerY:0,
	radius:0,
	data:null,
	bloat: 0.1, // Bloats a slice 10% when hovered
	animationStack:{},
	numObjects:0,
	paused: false,
	init: function(id,width,height,data)
		{
			this.data=data;
			this.radius=(Math.min(width,height))*0.8/2;
			this.centerX=width/2+0.5; this.centerY=height/2+0.5;
			var graphdiv=document.createElement('div');
			document.getElementById(id).appendChild(graphdiv);
			graphdiv.className='layeredGraphDiv';
			chartLayer=createLayer(width,height,1,true);
			this.chartCtx=chartLayer.getContext("2d");

			this.chartCtx.beginPath();
			this.chartCtx.arc(this.centerX,this.centerY,this.radius,0,2*Math.PI);
			this.chartCtx.shadowBlur=2;
			this.chartCtx.shadowColor="black";
			this.chartCtx.shadowOffsetY=0;
			this.chartCtx.stroke();
			
			var fromRad=toRad=3/4*2*Math.PI;
			for(var i in data)
			{
				this.chartCtx.beginPath();
				toRad += data[i].percentage/100*2*Math.PI;
				this.chartCtx.lineTo(this.centerX,this.centerY);
				this.chartCtx.arc(this.centerX,this.centerY,this.radius,fromRad,toRad);
				fromRad+=data[i].percentage/100*2*Math.PI;
				this.chartCtx.closePath();
				this.chartCtx.fillStyle=defaultColorPattern[i];
				this.chartCtx.shadowBlur=0;
				this.chartCtx.strokeStyle=defaultColorPattern[i];
				this.chartCtx.lineWidth = 0;
				this.chartCtx.fill();
				this.chartCtx.stroke();
			}

			
			// Mouse events
			this.chartSelectLayer=createLayer(width,height,2,false);
			this.chartSelectLayer.getClass=this;
			this.chartSelectCtx=this.chartSelectLayer.getContext("2d");
			graphdiv.appendChild(chartLayer);
			graphdiv.appendChild(this.chartSelectLayer);
			var chartSelectLayer=this.chartSelectLayer;
			chartSelectLayer.addEventListener('mousemove', function(evt) 
				{
					var piechartClass=chartSelectLayer.getClass;
					var mousePos = getMousePos(chartSelectLayer, evt);
					var distance = Math.sqrt((mousePos.x-piechartClass.centerX) * (mousePos.x-piechartClass.centerX) 
									+ (mousePos.y-piechartClass.centerY) * (mousePos.y-piechartClass.centerX));

					var slice = piechartClass.getSliceFromAngle( GetAngleOfLineBetweenTwoPoints(mousePos.x,mousePos.y, piechartClass.centerX,piechartClass.centerY ));

					if(distance < piechartClass.radius)
					{
						if( slice.id !== piechartClass.currentHighlight  )
						{
							piechartClass.currentHighlight=slice.id;
							if(requestAnimationFrame){
								if( isEmpty(piechartClass.animationStack) ||  piechartClass.paused){
									
									requestAnimationFrame(function() { piechartClass.animateSlice();});
									piechartClass.paused=false;
								}
								if(!piechartClass.animationStack[slice.id])
								{
									piechartClass.animationStack[slice.id] = slice;
									piechartClass.animationStack[slice.id].currentRadius=piechartClass.radius;
									piechartClass.numObjects++;
								}

							}

						}
					}
					else if( distance > piechartClass.radius)
					{
						if( piechartClass.currentHighlight )
						{
							if(! (distance< piechartClass.radius * (1+piechartClass.bloat)  && slice.id === piechartClass.currentHighlight ) )
							{
								piechartClass.currentHighlight=null; 
								if(piechartClass.paused)
								{
									requestAnimationFrame(function() { piechartClass.animateSlice();});
									piechartClass.paused=false;
								}
								//piechartClass.chartSelectCtx.clearRect(0, 0, chartSelectLayer.width, chartSelectLayer.height);
								
							}
						}
					}
					
				}, false);
		},
		animateSlice: function()
		{
		    //if (start === null) start = timestamp;
		    //var progress = timestamp - start;
			if(this.numObjects ===1 && this.currentHighlight && this.radius*(1+this.bloat) === this.animationStack[this.currentHighlight].currentRadius   )
			{this.paused=true; return;}
			this.chartSelectCtx.clearRect(0, 0, this.chartSelectLayer.width, this.chartSelectLayer.height);
			for(var id in this.animationStack)
			{
				var toRadius;
				var rate = Math.abs()
				if(this.currentHighlight === id)
				{
					toRadius = this.radius*(1+this.bloat);
					this.animationStack[id].currentRadius += 0.05 + 0.1 * Math.abs(toRadius-this.animationStack[id].currentRadius);
				}
				else
				{
					toRadius = this.radius;
					this.animationStack[id].currentRadius -= 0.05 + 0.1 * Math.abs(toRadius-this.animationStack[id].currentRadius);
				}
				var destroy=false;
				if( (this.animationStack[id].currentRadius>toRadius && this.currentHighlight === id) 
				||  (this.animationStack[id].currentRadius<toRadius && this.currentHighlight!== id))
				{
					if(this.animationStack[id].currentRadius<toRadius)
					{
						destroy = true;
					}
					this.animationStack[id].currentRadius = toRadius;
				}
				this.chartSelectCtx.beginPath();
				this.chartSelectCtx.arc(this.centerX,this.centerY, this.animationStack[id].currentRadius,this.animationStack[id].fromRad+3/4*2*Math.PI,this.animationStack[id].toRad+3/4*2*Math.PI);
				this.chartSelectCtx.lineTo(this.centerX,this.centerY);
				this.chartSelectCtx.closePath()
				this.chartSelectCtx.fillStyle=defaultColorPattern[this.animationStack[id].id];
				this.chartSelectCtx.fill();	
				if(destroy)
				{
					delete this.animationStack[id];
					this.numObjects--;
				}
				
			}

		    if (!isEmpty(this.animationStack)) {
				var that = this;
				requestAnimationFrame(function() { that.animateSlice();});
		    }
			else
			{
				//console.log(this.animationStack);
			}
		},
		getSliceFromAngle: function(rad)
		{
			var key=-1;
			var fromRad=0, totalRad=0;
			var i;
			for(i in this.data)
			{
				totalRad+=this.data[i].percentage/100*2*Math.PI;
				if(rad < totalRad)
				{
					key = i;
					break;
				}
				else
				{
					fromRad = totalRad;
				}
			}
			
			return {id: key, fromRad: fromRad, toRad:totalRad};
		}
});

var CoordinateSystem = Class.extend({
	/* The following vars are used, but doesn't need to be initialized
	origin_x: 0,
	origin_y: 0,
	width:0,
	height:0,
	ctx: null,
	graphctx:null,
	cursorctx:null,*/
	graph:{},
	graphColor:{},
	currentHighlight:'',
	
	init: function(id,width,height){

		var x0=40.5,y0=20.5,x1=width-65,y1=height-26.5;
		
		var graphdiv=document.createElement('div');
		graphdiv.className='layeredGraphDiv';
		document.getElementById(id).appendChild(graphdiv);
		
		//Coordinate System Layer
		var canvas=createLayer(width,height,1,true);
		graphdiv.appendChild(canvas);
		this.ctx=canvas.getContext('2d');
		this.width=x1-x0;
		this.height=y1-y0;
		
		//Graph Layer
		var graphLayer=createLayer(this.width,this.height,2,false);
		graphdiv.appendChild(graphLayer);
		graphLayer.style.left=x0+'px';
		graphLayer.style.top=y0+'px';
		this.graphctx=graphLayer.getContext('2d');
		this.graphctx.translate(0, graphLayer.height);
		this.graphctx.scale(1,-1);
		var cursorLayer=createLayer(this.width,this.height,3,false);
		graphdiv.appendChild(cursorLayer);
		cursorLayer.style.left=x0+'px';
		cursorLayer.style.top=y0+'px';
		this.cursorctx=cursorLayer.getContext('2d');
		cursorLayer.cs=this;
		this.cursorctx.translate(0, cursorLayer.height);
		this.cursorctx.scale(1,-1);
		
		this.ctx.beginPath();
		for(var i=1;i<5;i++)
		{
			this.ctx.moveTo(x0+i*(x1-x0)/5,y1);
			this.ctx.lineTo(x0+i*(x1-x0)/5,y0);
			this.ctx.moveTo(x0,y0+i*(y1-y0)/5);
			this.ctx.lineTo(x1,y0+i*(y1-y0)/5);
			this.ctx.font = "bold 12px Arial";
			this.ctx.fillText(10*i, x0-16/*-i*7*/,y1-i*(y1-y0)/5+4);
			this.ctx.fillText(10*i, x0 + i* (x1 - x0)/5 - 8/*-5*i*/,y1+12);
			
		}
		//this.ctx.fillText(5*Math.pow(10,i-1), x0+(x1-x0)/5*i-5*(i-1)-27,y1+12);
		/*this.ctx.fillText(5*Math.pow(10,0), x0+(x1-x0)/5-27,y1+12);
		this.ctx.fillText(5*Math.pow(10,1), x0+(x1-x0)/5*2-32,y1+12);
*/
		
		
		/*var logfactor=(log10(5));
		for(var i=0;i<5;i++)
		{
			this.ctx.moveTo(x0+(logfactor+i)*(x1-x0)/5,y1);
			this.ctx.lineTo(x0+(logfactor+i)*(x1-x0)/5,y0);
			this.ctx.moveTo(x0,y1-(logfactor+i)*(y1-y0)/5);
			this.ctx.lineTo(x1,y1-(logfactor+i)*(y1-y0)/5);
		}
		*/
		this.ctx.strokeStyle='black';
		this.ctx.lineWidth=0.2;
		this.ctx.closePath();
		this.ctx.stroke();
		

		this.ctx.font = "bold 16px Arial";
		this.ctx.fillText("kr", x0-20, y0-5);
		this.ctx.font = "bold 16px Arial";
		this.ctx.fillText("transaktioner", x1-40, y1+12);
		this.origin_x=x0;
		this.origin_y=y1;
		cursorLayer.addEventListener('mousemove', function(evt) 
			{
				var mousePos = getMousePos(cursorLayer, evt);
				var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
				var cs=cursorLayer.cs;
				/*cs.cursorctx.clearRect(0, 0, cursorLayer.width, cursorLayer.height);
				cs.cursorctx.beginPath();
				cs.cursorctx.moveTo(mousePos.x,0);
				cs.cursorctx.lineTo(mousePos.x,cursorLayer.height);
				cs.cursorctx.closePath();
				cs.cursorctx.stroke();
				*/
				var key=cs.getClosestGraph(mousePos.x,this.height-mousePos.y);
				if(key !== this.currentHighlighted)
				{
					this.currentHighlighted=key;
					cs.cursorctx.clearRect(0, 0, cursorLayer.width, cursorLayer.height);
					if(key !== '')
					{
						cs.drawGraph(cs.graph[key],{color:cs.graphColor[key],ctx:cs.cursorctx,lineWidth:6} );
					}	
				}				
					
			}, false);
	},
	getClosestGraph: function(pointX,pointY)
	{
		var minDistance=10; // if further than this, do not register
		var minKey='';
		for(var key in this.graph){
			var nlines=this.graph[key].length-1;
			for(var i=0; i<nlines; i++){
				var xep=this.graph[key][i+1][0],yep=this.graph[key][i+1][1];
				var a=(yep - this.graph[key][i][1])/(xep - this.graph[key][i][0]);
				var b=yep-a*xep;
				var distance=Math.abs(a * pointX - pointY + b)/Math.sqrt(a * a +1);
				if(nlines>1)
				{
					var x0=(a*(pointY-b)+pointX)/(a*a+1);
					if(x0<this.graph[key][i][0] || x0>xep)
					{
						distance=Math.sqrt( (xep - pointX) * (xep-pointX) + (yep-pointY) * (yep - pointY));
					}
				}
				if(distance<minDistance)
				{
					minDistance=distance;
					minKey=key;
				}
			}

			
		}
		//console.log(minDistance);
		return minKey;
	},
	drawGraph: function(points,params){
		var ctx;
		if(params.ctx)
			{ctx=params.ctx;}
		else
			{ctx=this.graphctx;}
		
		ctx.beginPath();
		var fromX=points[0][0],
		fromY=points[0][1];
		ctx.moveTo(0.5 + fromX,0.5 + fromY);
			
		for(var i=0; i<points.length-1; i++)
		{
			if(params.key)
				this.graph[params.key]=points;
			var toX=points[i+1][0],
			toY=points[i+1][1];
			ctx.lineTo(0.5 + toX,0.5 + toY);
			if(params.color)
				ctx.strokeStyle=params.color;
			if(params.key)
				this.graphColor[params.key]=ctx.strokeStyle;

			
		}
		if(params.lineWidth)
		{
			ctx.lineWidth=params.lineWidth;
		}
		else
			ctx.lineWidth=4;
		ctx.lineCap="round";
		ctx.lineJoin="round";
		ctx.shadowBlur=1;
		ctx.shadowColor="black";
		ctx.shadowOffsetY=1;
		ctx.stroke();
	},

	
});
