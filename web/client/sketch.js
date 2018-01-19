/* Spirale von r = 3cm bis r = 12.75cm (durchmesser 25.5cm) Distanz zwischen Spiralenarmen ist 0,5 cm 
https://www.intmath.com/blog/mathematics/length-of-an-archimedean-spiral-6595
*/


//var pxPerMm = 2;
var spiralStruct = null;


function setup() {
  // put setup code here
  canvas = createCanvas(670, 670);
  canvas.id("plate");
  canvas.parent('preview');
  canvas.class("blue");
  noLoop();
}

socket.on('decodedAudioBuffer', function(struct){
  spiralStruct = struct;
  loop();
  });

function draw() {
  canvas.clear();
  translate(width/2, height/2);
  strokeWeight(1);
  stroke(255);
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
