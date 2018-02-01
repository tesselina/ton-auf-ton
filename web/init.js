/** 
 * @author    Tesselina Spaeth <tesselina.spaeth@hs-augsburg.de>
 * @copyright 2018
 * @license   CC-BY-NC-SA-4.0
 */


var Listener = require('./server/listener');
var listener = new Listener();


var express = require('express');
var app = express();

var server = app.listen(3000, () => {
  console.log("Server: 3000 ");
});

app.use(express.static('node_modules/jquery'));
app.use(express.static('web'));

//setting up a client socket on our local server
var io = require('socket.io')(server);
io.on('connection', clientConnection);

var transform = require('./server/transform');
var decode = require('./server/decode');
var stream = require('./server/stream');



function clientConnection (socket){
/** 
 * Upon correct serial connection, arduinoConnected is emitted and 
 * passed onto client. Within the callback function of the listener, 
 * we have access to the port and its pause and resume functions.
 * */
  stream.listener.on('arduinoConnected', function (state, msg, port) {
    console.log('client-arduino-connection', state);
     socket.emit('arduinoConnected', state, msg);
     socket.on('pause', function(state){
       console.log('pause', state );
      state ? port.pause() : port.resume(); 
     });
  });
  console.log('Client: ', socket.id);

  /** Ugly: This works only when soundfiles are located in the public/assets folder. 
   * Upon Selection filename is passed to decode module which reads file and emits the 
   * event 'finishedDecoding' passing an array of the sample information  */

  socket.on('selection', function(fileName){
    decode.getSamplesFromWavFile(fileName);
  });
  
  decode.listener.on('finishedDecoding', function (samples) {
    /** transform returns and object containing the gcode for the arduino
     *  and the sprial coordinates for the client preview */
    transform(samples).then((obj) => {
      socket.emit('spiralStruct', obj.clientStruct);

      socket.on('clientStream', function(){
        stream.start(obj.gcode);
       });
       socket.on('endStream', function(){
        stream.end();
       });
    });
  });

  //whenever streaming variable is changed streaming event is triggered and passes variable to client
  stream.listener.on('streaming', function (index) {
    socket.emit('clientStream', index);
  });

}