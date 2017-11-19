/* Spirale von r = 3cm bis r = 12.75cm (durchmesser 25.5cm) Distanz zwischen Spiralenarmen ist 0,5 cm */

var sr = 3; //start radius
var er = 12.75; //end radius
var ad = 0.5; //distance between spiral arms
var pxPerCm = 40;
var turns = (sr-er)/ad; //turn count of the spiral
var totalRadians; //radian count of turns 
var r;
var path = "../public/assets/";
var currentAudioChannel  = null;
var fRate = 100;
var socket;

function spiralEquationInToOut(startRadius, armDistance, radian){
  var step = armDistance/(2*PI);
  var rad = startRadius + step*radian;
  return rad;
}

function setup() {
  // put setup code here
  frameRate(fRate);
  canvas = createCanvas(1024, 1024);
  canvas.id("plate");
  noLoop();
  totalRadians = turns*2*PI; //radian count of turns 
  socket = io();
  socket.on('decodedAudioBuffer', function(channelBuffer){
    var channelArray = new Float32Array(channelBuffer);
    currentAudioChannel = channelArray;
    loop();
    });
}

function draw() {
  translate(width/2, height/2);
  fill(255);
  strokeWeight(0);
  //stroke(85,110,137); //#556e89
  ellipse(0, 0, 1024, 1024);

  strokeWeight(1);
  stroke(0);
  noFill();

  if (currentAudioChannel){
    for(var i = 0; i< -totalRadians; i+=(PI/180)) {
      var count = Math.floor(i * 180/PI);
      r = spiralEquationInToOut(sr*pxPerCm, ad*pxPerCm, i);
      var rad = r + map(currentAudioChannel[currentAudioChannel.length-count], -1, 1, -50, 50);
      var x = rad * cos(i);
      var y = rad * sin(i);
      point(x,y);
    }

  } else {
    beginShape();
    for(var i = 0; i< -totalRadians; i+=(PI/180)) {

      var r = spiralEquationInToOut(sr*pxPerCm, ad*pxPerCm, i);
      var x = r * cos(i);
      var y = r * sin(i);
      vertex(x,y);
    }
    endShape();
  }
  noLoop();
}
