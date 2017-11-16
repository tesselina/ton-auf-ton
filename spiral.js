/* Spirale von r = 3cm bis r = 12.75cm (durchmesser 25.5cm) Distanz zwischen Spiralenarmen ist 0,5 cm */

var sr = 3; //start radius
var er = 12.75; //end radius
var ad = 0.5; //distance between spiral arms
var pxPerCm = 40;
var turns = (sr-er)/ad; //turn count of the spiral
var r;

var currentAudioBuffer  = null;


function spiralEquation(startRadius, armDistance, radian){
  var step = armDistance/(2*PI);
  var rad = startRadius + step*radian;
  return rad;
}


function setup() {
  // put setup code here
  frameRate(60);
  createCanvas(1050, 1050);
  noLoop();
  loadMusic("assets/8000.wav");
}

function draw() {
  background(240);
  strokeWeight(1);
  stroke(0);
  noFill();
  translate(width/2, height/2);

  if (currentAudioBuffer){
    var channel = currentAudioBuffer.getChannelData(0);
    for(var i = 0; i< (39*PI); i+=(PI/180)) {
      var count = Math.floor(i * 180/PI);
      console.log(count);
      r = spiralEquation(sr*pxPerCm, ad*pxPerCm, i);
      var rad = r + map(channel[count], -1, 1, -500, 500);
      var x = rad * cos(i);
      var y = rad * sin(i);
      point(x,y);
    }

  } else {
    beginShape();
    for(var i = 0; i< (39*PI); i+=(PI/180)) {

      var r = spiralEquation(sr*pxPerCm, ad*pxPerCm, i);
      var x = r * cos(i);
      var y = r * sin(i);
      vertex(x,y);
    }
    endShape();
  }
}

function loadMusic(url) { 
    var req = new XMLHttpRequest();
    req.open( "GET", url, true );
    req.responseType = "arraybuffer";    
    req.onreadystatechange = function (e) {
          if (req.readyState == 4) {
             if(req.status == 200)
                  getAudioContext().decodeAudioData(req.response, 
                    function(buffer) {
                             currentAudioBuffer = buffer;
                             loop();
                    }, onDecodeError);
             else
                  alert('error during the load.Wrong url or cross origin issue');
          }
    } ;
    req.send();
}

function onDecodeError() {  alert('error while decoding your file.');  }
