/** 
 * @author    Tesselina Spaeth <tesselina.spaeth@hs-augsburg.de>
 * @copyright 2017
 * @license   CC-BY-NC-SA-4.0
 */


var express = require('express');
var app = express();
//local sever on port 3000
var server = app.listen(3000, () => {
  console.log("running on 3000 ");
});

app.use(express.static('node_modules/jquery'));
app.use(express.static('web'));

//setting up a client socket on our local server
var io = require('socket.io')(server);
io.on('connection', clientConnection);

//var board = require('./server/board');
var read = require('./server/fileReader');
const WavDecoder = require("wav-decoder");


const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('/dev/cu.usbmodem1441', { 
  baudRate: 9600
});
const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

port.on('open', function() {
  console.log('Serial Port Open');
});

var streaming = false;
var gcode = [];
var i = 0;


function clientConnection (socket){

  socket.on('selection', function(data){
    decodeWav(data, socket);
  });
    console.log('client connection: ', socket.id);
}


function mapToRange(val, in_min, in_max, out_min, out_max) {
  return (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function decodeWav(filename, socket){
    read(filename).then((buffer) => {
      return WavDecoder.decode(buffer);
    }).then(function(audioData) {
      //by sending float32array to client it becomes an object. 
      //to keep that from happening we only send the buffer and 
      //create new float32array on client
      socket.emit('decodedAudioBuffer', audioData.channelData[0].buffer); 
      //console.log(audioData.channelData[0]); // Float32Array

      var steps = audioData.channelData[0].map(function(val, i, arr) {
        var range = mapToRange(val, -1,1,0,500);
        var oldRange = mapToRange(arr[i-1], -1,1,0,500);
        if(oldRange) return Math.round(range - oldRange);
        else return Math.round(range);
      }); 
    steps.forEach(function(val, index, array) {
        gcode.push("G1 X"+val+ " Y1");
    });

    console.log('gcode: ', gcode);
    if (gcode == null) return;
    streaming = true;
    stream();
    
    });
}



function stream()
{
  if (!streaming) return;
  
  while (true) {
    if (i == gcode.length) {
      streaming = false;
      gcode = [];
      return;
    }
    
    if (gcode[i].trim().length == 0) i++;
    else break;
  }
  console.log(gcode[i]);
  port.write(gcode[i] + '\n', function(err) {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
    console.log('gcode written');
  });
  i++;
}


//parser.on('data', console.log);

parser.on('data', function (data) {
  console.log('Data:', data);
  if (data.trim().startsWith("ok")) stream();
});