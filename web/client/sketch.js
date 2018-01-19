/* Spirale von r = 3cm bis r = 12.75cm (durchmesser 25.5cm) Distanz zwischen Spiralenarmen ist 0,5 cm 
https://www.intmath.com/blog/mathematics/length-of-an-archimedean-spiral-6595
*/


//var pxPerMm = 2;
var spiralStruct = null;


function setup() {
  // put setup code here
  canvas = createCanvas(800, 800);
  canvas.id("plate");
  noLoop();
}

socket.on('decodedAudioBuffer', function(struct){
  spiralStruct = struct;
  loop();
  });

function draw() {
  translate(width/2, height/2);
  fill(255);
  strokeWeight(0);
  //stroke(85,110,137); //#556e89
  ellipse(0, 0, 800, 800);

  strokeWeight(1);
  stroke(0);
  noFill();
  if (spiralStruct){
    beginShape();
    for (var j = 0; j<spiralStruct.length; j+=1){
      var x = spiralStruct[j].r * cos(spiralStruct[j].t);
      var y = spiralStruct[j].r * sin(spiralStruct[j].t);
      vertex(x,y);
      }
    endShape();

  }
  noLoop();
}
