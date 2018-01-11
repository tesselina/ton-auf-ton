/* Spirale von r = 3cm bis r = 12.75cm (durchmesser 25.5cm) Distanz zwischen Spiralenarmen ist 0,5 cm 
https://www.intmath.com/blog/mathematics/length-of-an-archimedean-spiral-6595
*/

var sr = 3; //start radius
var er = 12.75; //end radius
var ad = 0.5; //distance between spiral arms
var pxPerCm = 40;
var m = (er+sr)/2; //middle radius 
var turns = (er-sr)/ad; //turn count of the spiral
var totalRadians; //radian count of turns 
var theta = 0;
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
    console.log('buffer', channelArray);
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
    beginShape();
    var step = totalRadians/currentAudioChannel.length;
    for (var j = 0; j<currentAudioChannel.length; j+=1){
      if(theta <= totalRadians){
      r = spiralEquationInToOut(sr*pxPerCm, ad*pxPerCm, theta);
      var rad = r + map(currentAudioChannel[j], -1, 1, -10, 10);
      var x = rad * cos(theta);
      var y = rad * sin(theta);
      vertex(x,y);

      theta += step ; //need to figure out a way to calculate step according to r and j so that steps add up to totalRadians within the for loop. with increasing radius steps should be decreasing
      }
    }
    endShape();

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


/* for(var i = 0; i< -totalRadians; i+=(PI/180)) {
  var count = Math.floor(i * 180/PI);
  r = spiralEquationInToOut(sr*pxPerCm, ad*pxPerCm, i);
  var rad = r + map(currentAudioChannel[currentAudioChannel.length-count], -1, 1, -50, 50);
  var x = rad * cos(i);
  var y = rad * sin(i);
  point(x,y);
} */