/** 
 * @author    Tesselina Spaeth <tesselina.spaeth@hs-augsburg.de>
 * @copyright 2017
 * @license   CC-BY-NC-SA-4.0
 */


var five = require("johnny-five");
var PinListener = require('./pinlistener');

var listener = new PinListener();
var board = new five.Board();

board.on("ready", function () {
//on arduino events set listener.eventname(val);
});

/*listener can be called through board module 
board.listener.on('eventname', function (val) {
      socket.emit('valuename', val);
    });
*/
module.exports.listener = listener;

