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
    function Class() {
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

function initCanvas(){
	var cs = new CoordinateSystem('graph',500,350);
	cs.drawGraph([[0,100],[390,260]],{key:'epay',color:"#FF0000"});
	cs.drawGraph([[0,0],[100,140],[250,250],[390,300]],{key:'quickpay',color:"blue"});
	cs.getClosestGraph();
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

function createLayer(id,width,height,z){
	var canvas = document.createElement('canvas');
	canvas.id = id;
	canvas.width = width;
	canvas.height = height;
	canvas.style.position = "absolute";
	canvas.style.zIndex = z;
	//canvas.style.border = "1px solid";
	return canvas;
}

var CoordinateSystem = Class.extend({
	origin_x: 0,
	origin_y: 0,
	width:0,
	height:0,
	ctx: null,
	graphctx:null,
	cursorctx:null,
	graph:{},
	currentHighlight:'',
	
	init: function(id,width,height){

		var x0=40.5,y0=20.5,x1=width-65,y1=height-19.5;
		
		
		//Coordinate System Layer
		var canvas=createLayer('coordinatesystem',width,height,1);
		var csdiv=document.getElementById(id).appendChild(canvas);
		this.ctx=canvas.getContext('2d');
		this.width=x1-x0;
		this.height=y1-y0;
		
		//Graph Layer
		var graphLayer=createLayer('graphlayer',this.width,this.height,2);
		document.getElementById(id).appendChild(graphLayer);
		graphLayer.style.left=x0+'px';
		graphLayer.style.top=y0+'px';
		this.graphctx=graphLayer.getContext('2d');
		this.graphctx.translate(0, graphLayer.height);
		this.graphctx.scale(1,-1);
		var cursorLayer=createLayer('cursorlayer',this.width,this.height,3);
		document.getElementById(id).appendChild(cursorLayer);
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
		    this.ctx.fillText(Math.pow(10,i), x0-9-i*7,y1-i*(y1-y0)/5+4);
		    this.ctx.fillText(Math.pow(10,i), x0+i*(x1-x0)/5-5*i,y1+12);
		}
		var logfactor=(log10(5));
		for(var i=0;i<5;i++)
		{
			this.ctx.moveTo(x0+(logfactor+i)*(x1-x0)/5,y1);
			this.ctx.lineTo(x0+(logfactor+i)*(x1-x0)/5,y0);
			this.ctx.moveTo(x0,y1-(logfactor+i)*(y1-y0)/5);
			this.ctx.lineTo(x1,y1-(logfactor+i)*(y1-y0)/5);
		}
		this.ctx.strokeStyle='black';
		this.ctx.lineWidth=0.2;
		this.ctx.closePath();
		this.ctx.stroke();

	    this.ctx.font = "bold 16px Arial";
	    this.ctx.fillText("kr", x0-10, y0-5);
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
				//console.log(cs.getClosestGraph(mousePos.x,mousePos.y));
				var key=cs.getClosestGraph(mousePos.x,this.height-mousePos.y);
				if(key !== this.currentHighlighted)
				{
					cs.cursorctx.clearRect(0, 0, cursorLayer.width, cursorLayer.height);
					if(key !== '')
					{
						this.currentHighlighted=key;
						cs.drawGraph(cs.graph[key],{color:"yellow", ctx:cs.cursorctx,linewidth:10} );
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
		for(var i=0; i<points.length-1; i++)
		{
			var ctx;
			if(params.ctx)
				ctx=params.ctx;
			else
				ctx=this.graphctx;
			if(params.key)
				this.graph[params.key]=points;
			var fromX=points[i][0],
			fromY=points[i][1],
			toX=points[i+1][0],
			toY=points[i+1][1];
			ctx.beginPath();
			ctx.moveTo(0.5 + fromX,0.5 + fromY);
			ctx.lineTo(0.5 + toX,0.5 + toY);
			if(params.color)
				ctx.strokeStyle=params.color;
			ctx.lineCap="round";
			
			if(params.lineWidth)
				ctx.lineWidth=params.lineWidth;
			else
				ctx.lineWidth=3;
			ctx.shadowBlur=4;
			ctx.shadowColor="black";
			ctx.shadowOffsetY=1;
			ctx.closePath();
			ctx.stroke();
		}
	},

	
});
