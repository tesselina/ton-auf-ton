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
var decoder = require('./server/decoder');



function clientConnection (socket){
    console.log('client connection: ', socket.id);
}