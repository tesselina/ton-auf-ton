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

fileInput.addEventListener("change", getFileName);

socket.on('arduinoConnected', function(state, msg){
   document.getElementById("loader").style.display = "none";
  arduino.innerHTML = msg;
 });


 socket.on('spiralStruct', function(struct){
   console.log("spiralstruct", struct.length);
  sampleCount = struct.length;

/** Checking for filesize */
  if (sampleCount <= 55000){
    sizeInfo.innerHTML = "";
    startButton.disabled = false;
  } else{
    sizeInfo.innerHTML = " - Das Audiosignal ist zu groß!";
    fileInfo.appendChild(sizeInfo);
    startButton.disabled = true;
  }

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
    console.log("fileInfo");
    document.getElementById("fileInfo").innerHTML = fileName;
    socket.emit('selection', fileName);
  } 
}

function toggleStreamingProcess (){
  pause = !pause;
  socket.emit('pause', pause);
  toggleButton.value = pause? 'Fortfahren' : 'Anhalten';
}

function startStreaming(){
  console.log("count", sampleCount);
  fileInput.disabled = true;
  selectButton.classList.add('disabled');
  socket.emit('clientStream');
  toggle(startButton);
  toggle(toggleButton);
}


socket.on('clientStream', function(index){
  if(index < sampleCount){
    console.log("bar: ", index, sampleCount,  Math.round(index/sampleCount*100));
    bar.style.width = index/sampleCount*100 + '%'; 
  }

  if (index == sampleCount) {
    fileInput.disabled = false;
    selectButton.classList.remove('disabled');
    fileInput.value = '';
    startButton.disabled = true;
    document.getElementById("fileInfo").innerHTML = "";
    toggle(startButton);
    toggle(toggleButton);
  }
  });


