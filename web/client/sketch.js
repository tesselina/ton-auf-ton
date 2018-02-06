/* Spirale von r = 3cm bis r = 12.75cm (durchmesser 25.5cm) Distanz zwischen Spiralenarmen ist 0,5 cm 
https://www.intmath.com/blog/mathematics/length-of-an-archimedean-spiral-6595
*/


//var pxPerMm = 2;
var spiralStruct = null;
var dotIndex;
var colors = [{
  name: "blue", 
  code: "#6b77ba"}, {
  name: "red",
  code: "#ce8575"}, {
  name: "grey",
  code: "#585353"}, {
  name: "green",
  code: "#a1bdb2"
    }];

function setup() {
  // put setup code here
  canvas = createCanvas(670, 670);
  canvas.id("plate");
  canvas.parent('preview');
  canvas.class("blue");
}

socket.on('spiralStruct', function(struct){
  spiralStruct = struct;
  });


  socket.on('clientStream', function(index){
    dotIndex = index;
  });

function draw() {
  var dotColor; 
  for (var i = 0; i < colors.length; i++){
    if(canvas.class().includes(colors[i].name)){
      (i == colors.length -1)? dotColor = colors[0].code : dotColor = colors[i+1].code;
    }
  }

  canvas.clear();
  translate(width/2, height/2);
  scale(-1.0,1.0);  
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
    if(dotIndex){
      noStroke();
      fill(dotColor);
      var xD = spiralStruct[dotIndex].r * cos(spiralStruct[dotIndex].t);
      var yD = spiralStruct[dotIndex].r * sin(spiralStruct[dotIndex].t);
      ellipse(xD,yD,10);
    }
  }
}