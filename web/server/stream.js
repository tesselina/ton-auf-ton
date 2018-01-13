/** 
 * @author    Tesselina Spaeth <tesselina.spaeth@hs-augsburg.de>
 * @copyright 2017
 * @license   CC-BY-NC-SA-4.0
 */

var Listener = require('./listener');
var listener = new Listener();
var transform = require('./transform');

const path = '/dev/cu.usbmodem';
const usbModems = ['1441', '1461', '1411', '1451']; //left upper port, left lower port, right upper port, right lower port

const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort(path+usbModems[3], { 
    baudRate: 9600
  });


const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

var streaming = false;
var gcode = [];
var i = 0;


port.on('open', function() {
  console.log('Serial Port Open');
});

function stream()
{
  if (!streaming) return;
  
  while (true) {
    if (i == gcode.length) {
      streaming = false;
      gcode = [ ];
      return;
    }
    
    if (gcode[i].trim().length == 0) i++;
    else break;
  }
  //console.log('stream', gcode[i], i);
  
  port.write(gcode[i] + '\n', function(err) {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
    //console.log('gcode written');
  });

  i++;
}

parser.on('data', function (data) { //waits for feedback from arduino 
//console.log('Data:', data);
  if (data.trim().startsWith("ok")) stream();
});


transform.listener.on('gcodeReady', function (code) {
    gcode = code;
    if (gcode == null) return;
    streaming = true;
    stream();
 });


 module.exports = port;