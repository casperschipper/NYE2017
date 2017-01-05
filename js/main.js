// set the first element to the center
var module = function ( ) { 
	var angleInRadians = degrToRad(60);

	$(document.body).css(
		"background-color","#343439"
	);

	function degrToRad(degrees) {
		return degrees * (Math.PI / 180);
	}

	function radToDegr(radians) {
		return radians * (180.0 / Math.PI);
	}

	function collectRand(number) {
		var result = [];
		for (var i = 0;i<number;i++) {
			result.push(Math.random())
		}
		return result;
	}

	function collect(number,func) {
		var result = [];
		for (var i = 0;i<number;i++) {
			result.push( func() );
		}
		return result;
	}

	function collectRandInt(number,a,b) {
		return collect(
			number,
			function( ) { 
				return rv(a,b); 
		});
	}


	function ch(seq) {
		return seq[Math.floor(Math.random() * seq.length)]
	}

	function rv(a,b) {
		return (Math.random() * Math.abs(a-b)) + Math.min(a,b);
	}

	function deviation(x,amplitude) {
		return x * ((Math.random() * amplitude * 2) + 1.0);
	}

	function dc2ac(x) {
		return (x * 2.0) - 1.0;
	}

	function range(a,b) {
		result = [];
		for (var i = a;i<(b+1);i++) {
			result.push(i);
		}
		return result;
	}


	function grow(parent,depth,length,angleOffset,isFirst) {
		if (depth < 1) {
			return;
		}

		if (false) {
			return;
		}

		//length = deviation(length,0.05);

		var sel1,sel2,sel3;
		if (depth < 3) {
			sel1 = [0,1,2];
			sel2 = [0,1,2,3,4,5];
			sel3 = [0,2,4];
		} else {
			sel1 = [0,1,2,3,4,5];
			sel2 = [0,2,4];
			sel3 = [0,1,2];
		}

		if (isFirst) {
			sel1 = sel2 = sel3 = [0,1,2,3,4,5];
			isFirst = false;
		}

		var selection = ch([sel1,sel2,sel3]);

		for (var i in selection) {
			//console.log("this is i: "+ i);

			var newX = (Math.cos(((angleInRadians*0.5) * (i+parent.direction)) + angleOffset) * length) + parent.x;
			var newY = (Math.sin(((angleInRadians*0.5) * (i+parent.direction)) + angleOffset) * length) + parent.y;

			//console.log("newx newy:" + (Math.sin(angleInRadians * (i+parent.direction)) + angleOffset));

			//console.log("something ahppended");
			function drawOnCanvas (x,y,x2,y2,length,hasText) {
				var canvas = document.getElementById('myCanvas');
    			var context = canvas.getContext('2d');

				//console.log("" + x + space  + y + space + x2+ space + y2+ space )
				var transparancy = depth * (1.0/7.0);
				if (transparancy < 0.1) {
					transparancy = 0.1;
				}
				var color = 'rgba('+Math.floor(rv(230,255))+','+Math.floor(rv(230,255))+','+Math.floor(rv(230,255))+','+transparancy+')';

				context.fillStyle = color;
				context.strokeStyle = color;
				context.lineWidth = 1.0;

				context.beginPath();
				context.moveTo(x,y);
				context.lineTo(x2,y2);
				context.stroke();

				// here starts the new draw method:
				var calcX = function(index,length,alpha,offset) {
					return (Math.cos(index * alpha) * length)
					+
					offset;
				}

				var calcY = function(index,length,alpha,offset) {
					return (Math.sin(index * alpha) * length)
					+ 
					offset;
				}
				

				xs = [];
				ys = [];

				var n = 6;

				var size = 0.61803398875 * 0.25;
			
				for (var j = 0; j<n ;j++) {
					xs.push(calcX(j,length*size,angleInRadians,x2));
					ys.push(calcY(j,length*size,angleInRadians,y2));
				}

				// draw a polygon:
				transparancy = transparancy * Math.random();
				color = 'rgba('+Math.floor(rv(230,255))+','+Math.floor(rv(230,255))+','+Math.floor(rv(230,255))+','+transparancy+')';
				context.fillStyle = color;

			    context.beginPath();
			    context.moveTo( xs[0], ys[0] );
				for (var k = 1;k < n ;k++) {
				    context.lineTo( xs[k] , ys[k] );
				}
			    context.lineTo( xs[0] , ys[0] );

			    context.closePath();
			    context.fill();

				
				if (hasText) {
					context.fillStyle = "#ffffff33";
					context.font="192px Helvetica";
					context.fillText("2017",newX-19,newY+15);
				}
			}
			
			var hasText = (Math.random() > 0.86) && (depth == 7);

			drawOnCanvas(parent.x,parent.y,newX,newY,length,hasText);

			callBack = function (xa,yb,it,angleOff) { 
				return function ( ) {
					grow( 
						{"x":xa,"y":yb,"direction":it},
						depth - 1,
						(length * 0.61803398875) * rv(0.75,1.0),
						angleOff
					);
				};
			};
	
		 	setTimeout( 
		 		callBack(newX,newY,	i, angleOffset) , 
		 		Math.random() * i * 44 
		 	);

		}
	}

	
	$(document.body).append('<canvas id="myCanvas" width="'+window.innerWidth+ '" height="'+window.innerHeight+ '">Sorry, your browser is old !</canvas>')



	var n = window.innerWidth*window.innerHeight*0.0001;
	var nReset = n;
	var t = 500 - n;
	if (t < 250) { 
		t = 250; 
	}
	console.log('timer:' + t);
	var basicLength = window.innerHeight / 15.0;
	var sizes = [0.1,0.2,0.4,0.8,1.6,3.2,6.4];

	var clearScreen = function ( ) { 
		var canvas = document.getElementById('myCanvas');
		var context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);
	}

	var enviroment,chrystalSize;

	enviroment = collectRand(10);

	var createFlake = function ( ) {
		var x = Math.random() * window.innerWidth;
        var y = Math.random() * window.innerHeight;


	    grow({"x":x,"y":y,"direction":0},ch([1,1,2,3,4,5,6,7]),ch(sizes) * basicLength,Math.random() * Math.PI,true);
		
		if (n < 0) {
			n = nReset;
			clearScreen();
		}
		n = n - 1;
		setTimeout( function ( ) { createFlake() }, Math.random() * t );
	};

	setTimeout( function ( ) { createFlake() }, Math.random() * t )


}();




