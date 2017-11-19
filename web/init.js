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
  socket.on('selection', decodeWav);
    console.log('client connection: ', socket.id);
}

function decodeWav(data){
  if(data){
    read(data).then((buffer) => {
      return WavDecoder.decode(buffer);
    }).then(function(audioData) {
        console.log('decodeWav',audioData.sampleRate);
      //console.log(audioData.channelData[0].length); // Float32Array
    
    });
  }
}