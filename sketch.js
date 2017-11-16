var song;
// var amp;
// var fft;
var fileState = false;
var currentAudioBuffer  = null;


var filePath = "assets/";
var fileInput;
var step = 0.2;
var count = 0;
var scount = 0;
var theta = 0;
var a = 0;
var r = 500;
var fRate = 100;
var sampleFraction;
var canvas;

function setup() {
  // put setup code here
  frameRate(fRate);
  canvas = createCanvas(1024, 1024);
  canvas.id("plate");
  angleMode(DEGREES);
  // fft = new p5.FFT();
  // amp = new p5.Amplitude();
  playButton = document.getElementById("playButton");
  fileInput = document.forms[0].soundFileSelect; 
  fileInput.addEventListener("change", getUrl);
  drawDisc();
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

function drawDisc(){
  fill("#f2efea");
  strokeWeight(0);
  push();
  translate(width/2, height/2);
  //stroke(85,110,137); //#556e89
  ellipse(0, 0, 1020, 1020);
  pop();
}

function draw() {
  strokeWeight(1);
  translate(width/2, height/2);
  

  if (currentAudioBuffer){
    drawSpiral(currentAudioBuffer);
  }

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
console.log('sample count', scount);
  //console.log("wave",  normalArray);
}, 1000);

//umfang = PI*durchmesser / PI*2*r


function drawSpiral(buffer){
  sampleFraction = buffer.sampleRate/fRate;
  console.log('frac', sampleFraction, buffer.sampleRate, fRate );
  var channel = buffer.getChannelData(0);
  var secs = channel.length/buffer.sampleRate;

  if(r>0 && step <= 0.5 ){
    for(var i = 0; i<sampleFraction; i++) {
      var val = channel[count*sampleFraction + i];
      var rad = r + map(val, -1, 1, -1000, 1000);
      var x = rad * cos(theta);
      var y = rad * sin(theta);
      theta += step;
      
      step = 360/(2*r*PI*30);
      r -= step/18; 

      stroke(0);
      point(x,y);
      scount += 1;
    }
    count += 1;
  }
}