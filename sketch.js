var song;
var amp;
var button;
var fft;
var fileState = false;
var currentAudioBuffer  = null;

var volhistory = [];

var filePath = "assets/";
var fileInput;
var step = 0.2;
var count = 0;
var rad = 500;
var theta = 0;
var a = 0;
var r = 500;

function setup() {
  // put setup code here
  frameRate(100);
  createCanvas(1024, 1024);
  angleMode(DEGREES);
  fft = new p5.FFT();
  amp = new p5.Amplitude();
  playButton = document.getElementById("playButton");
  fileInput = document.forms[0].soundFileSelect; 
  fileInput.addEventListener("change", getUrl);
}


function getFileName(){
  if (fileInput && fileInput.files.length > 0 && ["audio/mpeg", "audio/mp3", "audio/x-wav"].includes(fileInput.files[0].type)) {
    return fileInput.files[0].name;
  }
}

function getUrl(){
  if (fileInput.files.length > 0 && ["audio/mpeg", "audio/mp3", "audio/x-wav"].includes(fileInput.files[0].type)) {
    var url = filePath + fileInput.files[0].name;
    loadMusic(url);
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
                             displayBuffer(buffer);
                             
                    }, onDecodeError);
             else
                  alert('error during the load.Wrong url or cross origin issue');
          }
    } ;
    req.send();
}

function onDecodeError() {  alert('error while decoding your file.');  }


function displayBuffer(buffer){
  var channel = buffer.getChannelData(0);
  console.log('buffer',channel);
};

function draw() {
  visualize();

 if(getFileName() && fileState == false){
    fileState = true; 
    song = new p5.SoundFile('assets/'+ getFileName(),loaded);
  }

}

function loaded(){
  song.play();
  playButton.onclick = function (event) {
    toggleSong();
  }
}

function toggleSong(){
  if (song.isPlaying()){
    song.pause();
  } else {
    song.play();
  }
}

setInterval(function(){ 

      //console.log('file selected?', getFileName());
  //console.log("wave",  normalArray);
}, 3000);




function visualize(){
  noFill();
  strokeWeight(1);
  translate(width/2, height/2);

  stroke(255,0,0);
  ellipse(0, 0, 1020, 1020);





  //background(240);
  //fill("white");

  if (currentAudioBuffer){
    drawSpiral(currentAudioBuffer);
  }

}
/*
function drawSpiral(volhistory){
  stroke(0);
  noFill();

  translate(width/2, height/2);
  beginShape();
  for(var i = 0; i<360; i++) {
    var r = map(volhistory[i], 0, 1, 240, 340);
    var x = r * cos(i);
    var y = r * sin(i);
    vertex(x,y);
  }
  endShape();

}
*/


//umfang = PI*durchmesser / PI*2*r


function drawSpiral(buffer){
  var channel = currentAudioBuffer.getChannelData(0);
var secs = channel.length/22050;

  if(r>0 && step <= 0.5 ){
    for(var i = 0; i<441; i++) {
      var val = channel[count*+ i];
      var x = r * cos(theta);
      var y = r * sin(theta);
      theta += step;
      
      step = 360/(2*r*PI);
      r -= step/18; 

      stroke(0);
      point(x,y);
    }
  }
}

/*  stroke(255,0,0); 


  var step = 0.1;
  for(var i = 0; i<441; i++) {
    var val = channel[count*441+ i];
   if (i%360 >=step){
      console.log(i, step);
    }
    //console.log(count);
    //var r = rad + map(channel[i], -1, 1, -10, 10);
    var r = rad - 0.00555555555;
    var x = r * cos(theta);
    var y = r * sin(theta);
    point(x,y);
  //}
  //endShape();
 // pop();
  theta += step;
  if (theta >=360){
    theta = 0;
  }
  //rad -= 0.15;

}
count+=1;*/


/*
function displayBuffer(buffer) {
   var leftChannel = buff.getChannelData(0); 
   leftChannel.length

*/