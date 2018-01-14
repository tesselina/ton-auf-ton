/** 
 * @author    Tesselina Spaeth <tesselina.spaeth@hs-augsburg.de>
 * @copyright 2017
 * @license   CC-BY-NC-SA-4.0
 */
//https://github.com/damellis/gctrl/blob/master/gctrl.pde#L34
//https://github.com/node-serialport/node-serialport/blob/v6.0.4/README.md#module_serialport--SerialPort.parsers
//http://www.airspayce.com/mikem/arduino/AccelStepper/classAccelStepper.html

var Listener = require('./server/listener');
var listener = new Listener();


var express = require('express');
var app = express();

var server = app.listen(3000, () => {
  console.log("running local sever on port 3000 ");
});

app.use(express.static('node_modules/jquery'));
app.use(express.static('web'));

//setting up a client socket on our local server
var io = require('socket.io')(server);
io.on('connection', clientConnection);

var transform = require('./server/transform');
var decode = require('./server/decode');
var port = require('./server/stream');



function clientConnection (socket){
  console.log('Client connected. ID: ', socket.id);

  socket.on('selection', function(data){
    decode.getSamplesFromWavFile(data);
  });
    

  decode.listener.on('finishedDecoding', function (samples) {
    //by sending float32array to client it becomes an object. so I only send the buffer and create new float32array on client
    socket.emit('decodedAudioBuffer', samples.buffer); 
    transform.writeGcode(samples);
  });

}