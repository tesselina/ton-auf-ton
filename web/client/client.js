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
var pause = false;

fileInput.addEventListener("change", getFileName);

socket.on('arduinoConnected', function(state, msg){
   document.getElementById("loader").style.display = "none";
  arduino.innerHTML = msg;
 });


function toggle(element) {
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
  console.log('switch', newColor, plate);
  var colors = ['red', 'green', 'blue', 'grey'];
  colors.forEach(function(color) {
    plate.classList.remove(color);
  });
  plate.classList.add(newColor);
}

function getFileName(){
  if (fileInput.files.length > 0 && ["audio/mpeg", "audio/mp3", "audio/x-wav"].includes(fileInput.files[0].type)) {
    var fileName = fileInput.files[0].name;
    document.getElementById("fileInfo").innerHTML = fileName;
    startButton.disabled = false;
    socket.emit('selection', fileName);
  } else {
    startButton.disabled = true;
  }
}

function toggleStreamingProcess (){
  pause = !pause;
  socket.emit('pause', pause);
  toggleButton.value = pause? 'Fortfahren' : 'Anhalten';
}

function startStreaming(){
  fileInput.disabled = true;
  selectButton.classList.add('disabled');
  socket.emit('stream', true);
  toggle(startButton);
  toggle(toggleButton);
}


socket.on('stream', function(state){
  if (!state) {
    fileInput.disabled = false;
    selectButton.classList.remove('disabled');
    fileInput.value = '';
    startButton.disabled = true;
    document.getElementById("fileInfo").innerHTML = "";
    toggle(startButton);
    toggle(toggleButton);
  }
  });


