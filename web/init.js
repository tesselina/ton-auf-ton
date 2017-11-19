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

//setting up a socket on our local server
var io = require('socket.io')(server);
io.on('connection', clientConnection);

var board = require('./server/board');
var read = require('./server/fileReader');
const WavDecoder = require("wav-decoder");


function clientConnection (socket){
  socket.on('selection', function(data){
    decodeWav(data, socket);
  });
    console.log('client connection: ', socket.id);
}

function decodeWav(data, socket){
    read(data).then((buffer) => {
      return WavDecoder.decode(buffer);
    }).then(function(audioData) {
      //by sending float32array to client it becomes an object. 
      //to keep that from happening we only send the buffer and 
      //create new float32array on client
        socket.emit('decodedAudioBuffer', audioData.channelData[0].buffer); 
        //console.log(audioData.channelData[0]); // Float32Array
    
    });
}