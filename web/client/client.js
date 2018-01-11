/**
 * @author    Tesselina Späth <tesselina.spaeth@hs-augsburg.de>
 * @copyright 2017
 * @license   CC-BY-NC-SA-4.0
 */


fileInput = document.getElementById("soundFileSelect");
fileInput.addEventListener("change", getFileName);

function getFileName(){
    if (fileInput.files.length > 0 && ["audio/mpeg", "audio/mp3", "audio/x-wav"].includes(fileInput.files[0].type)) {
      var fileName = fileInput.files[0].name;
      socket.emit('selection', fileName);
    }
  }
  
