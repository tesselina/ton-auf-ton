/**
 * @author    Tesselina Späth <tesselina.spaeth@hs-augsburg.de>
 * @copyright 2017
 * @license   CC-BY-NC-SA-4.0
 */

var fileInput = document.getElementById("soundFileSelect");
var selectButton = document.getElementById("fileUpload");
var startButton= document.getElementById("startButton");
var toggleButton = document.getElementById("toggleButton");
var arduino = document.getElementById('arduino');
var bar = document.getElementById("bar"); 
var sizeInfo = document.createElement("SPAN");
sizeInfo.id = "sizeInfo";
var pause = false;
var sampleCount;
var streaming;

fileInput.addEventListener("change", getFileName);

socket.on('arduinoConnected', function(state, msg){
   document.getElementById("loader").style.display = "none";
  arduino.innerHTML = msg;
 });

 socket.on('spiralStruct', function(struct){
  sampleCount = struct.length;
  if (sampleCount <= 55000){
    sizeInfo.innerHTML = "";
    startButton.disabled = false;
  } else{
    sizeInfo.innerHTML = " - Das Audiosignal ist zu groß!";
    fileInfo.appendChild(sizeInfo);
    startButton.disabled = true;
  }
});

socket.on('clientStream', function(index){
  if (index >= sampleCount) {
    resetAfterStream();
  } else {
    bar.style.width = index/sampleCount*100 + '%'; 
  }
});

function getFileName(){
  if (fileInput.files.length > 0 && ["audio/mpeg", "audio/mp3", "audio/x-wav"].includes(fileInput.files[0].type)) {
    var fileName = fileInput.files[0].name;
    document.getElementById("fileInfo").innerHTML = fileName;
    socket.emit('selection', fileName);
  } 
}

function toggleView(element) {
  if (element) {
      var display = element.style.display;

      if (display == "none") {
          element.style.display = "block";
      } else {
          element.style.display = "none";
      }
  }
}

function switchColor(newColor){
  var plate = document.getElementById("plate");
  var colors = ['red', 'green', 'blue', 'grey'];
  colors.forEach(function(color) {
    plate.classList.remove(color);
  });
  plate.classList.add(newColor);
}

/**Stream Handling  */
function startStreaming(){
  streaming = true;
  socket.emit('clientStream');
  toggleView(startButton);
  toggleView(toggleButton);
  toggleView(selectButton);
  toggleView(abortButton);
}

function toggleStreamingProcess (){
  pause = !pause;
  socket.emit('pause', pause);
  toggleButton.value = pause? 'Fortfahren' : 'Anhalten';
}

function resetAfterStream(){
  streaming = false;
  fileInput.value = '';
  startButton.disabled = true;
  document.getElementById("fileInfo").innerHTML = "";
  bar.style.width = 0 + '%'; 
  toggleView(startButton);
  toggleView(toggleButton);
  toggleView(selectButton);
  toggleView(abortButton);
}

function endStreaming(){
  socket.emit('endStream');
  resetAfterStream();
}

document.addEventListener("keydown", controlMotors);

function controlMotors(event) {

  if (!streaming){
    if (event.keyCode == '37') {
      socket.emit('left');
      // left arrow
    }
    else if (event.keyCode == '39') {
      socket.emit('right');
      // right arrow
    }
  }
}