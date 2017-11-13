var song;
var amp;
var button;
var fft;
var fileState = false;
var currentAudioBuffer  = null;

var volhistory = [];

var filePath = "assets/";
var fileInput;



function setup() {
  // put setup code here
  frameRate(60);
  createCanvas(1024, 1024);
  angleMode(DEGREES);
  fft = new p5.FFT();
  amp = new p5.Amplitude();
  playButton = document.getElementById("playButton");
  fileInput = document.forms[0].soundFileSelect; 
  fileInput.addEventListener("change", action);
}


function getFileName(){
  if (fileInput && fileInput.files.length > 0 && ["audio/mpeg", "audio/mp3", "audio/x-wav"].includes(fileInput.files[0].type)) {
    return fileInput.files[0].name;
  }
}

function action(){
  var url = filePath + fileInput.files[0].name;
  loadSound(url);
}

function loadSound(url) {   
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
  console.log('buffer', buffer, buffer.getChannelData(0));
};

function draw() {
  visualize();

 if(getFileName() && fileState == false){
   console.log('file selected draw');
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
  background(240);
  var vol = amp.getLevel();
  var waveform = fft.waveform();

  volhistory.push(vol);
  strokeWeight(1);
  //drawSpiral(volhistory);
  //drawDots(volhistory);
  drawWaveform(waveform);

  stroke(0);
  noFill();
  beginShape();
  for(var i = 0; i<volhistory.length; i++) {
    var y = map(volhistory[i], 0, 1, height, 0);
    vertex(i,y);
  }
  endShape();

  if(volhistory.length > 360) {
    volhistory.splice(0,1);
  }
}

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

function drawWaveform(waveform){
  noFill();
  beginShape();
  stroke(255,0,0); // waveform is red
  //strokeWeight(1);
  for (var i = 0; i< waveform.length; i++){
    var x = map(i, 0, waveform.length, 0, width);
    var y = map( waveform[i], -1, 1, 0, height);
    vertex(x,y);
  }
  endShape();
}

/*
function displayBuffer(buffer) {
   var leftChannel = buff.getChannelData(0); 
   leftChannel.length


function drawDots(volhistory){
  stroke(0, 150, 50);
  for(var i = 0; i<360; i++) {
    var r = map(volhistory[i], 0, 0.6, 240, 340);
    var x = r * cos(i);
    var y = r * sin(i);
    point(x,y);
  }
}
*/