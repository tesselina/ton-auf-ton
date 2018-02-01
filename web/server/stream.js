/** 
 * @author    Tesselina Spaeth <tesselina.spaeth@hs-augsburg.de>
 * @copyright 2018
 * @license   CC-BY-NC-SA-4.0
 * 
 * Part of this code, especially the function 'stream', is based on following source 
 * and was adapted to suit my application. 
 * 
 * Title: Processing GUI for grbl
 * Author: David A. Mellis
 * Institution: Github, Inc.
 * Date: 2 Aug 2013
 * Url: https://github.com/damellis/gctrl/blob/master/gctrl.pde
 * 
 * "A simple Processing <http://processing.org/> sketch that acts as an
 * interface to grbl <http://dank.bengler.no/-/page/show/5470_grbl>."
 */

var transform = require('./transform');
var Listener = require('./listener');
var listener = new Listener();

const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
var port = {};
var parser;

var streaming = false;
var gcode = [];
var i;

var serialNumber = 'A4131363139351B041C2'; //is the serial number of the specific arduino used 

/**
 * First the connected ports are listed and checked whether the arduino is connected, then a timeout
 * of 4 secs waits for client to be connected before handling the serial port, passing the specific com path */

SerialPort.list(function (err, ports) {
  var arduino = ports.find(function (obj) { return obj.serialNumber === serialNumber ; });
  arduino ? setTimeout(handlePort, 5000, arduino.comName) : setTimeout(handlePort, 5000, 'none');
});


/** The 'handlePort' function opens a serial port on given path, creates a parser to read incoming data by 'line',
 *  and manages all port and parser events */

function handlePort(path){
  var msg;
  port = new SerialPort(path, { 
    baudRate: 9600
  }, function(err) {
    if (err) {
    msg = "Maschine konnte nicht verbunden werden.";
    listener.arduinoConnected(false, msg);
    console.log(msg);
    }
  });
  parser = port.pipe(new Readline({ delimiter: '\r\n' }));

  parser.on('data', function (data) { //waits for feedback from arduino 
    //console.log('Serial: ', data);
    if (data.trim().startsWith("ok")) stream();
  }); 

  port.on('open', function() {
    msg = 'Die Maschine ist nun verbunden.';
    listener.arduinoConnected(true, msg, port);
    console.log(msg);
  });
  port.on('close', function(err) {
    msg = "Die Verbindung zur Maschine wurde getrennt.";
    listener.arduinoConnected(false, msg);
    console.log(msg);
  });
}

/**
 * When start function is called, the streaming variable is set to true
 * and the entire gcode is passed to the local gcode variable. 
 * Every 'write' follows an answer 'ok' from the arduino, which causes 'stream' 
 * to execute another time, an index keeps track of the gcode array.
 */

function stream(){
  if (!streaming) return;
  while (true) {
    if (i == gcode.length) {
      streaming = false;
      //console.log('streaming finished');
      listener.streaming(i);
      gcode = [ ];
      i = 0;
      return;
    }
    if (gcode[i].trim().length == 0) i++;
    else break;
  }
  port.write(gcode[i] + '\n', function(err) {
    console.log('line:', gcode[i]);
    if (err) {
      return console.log('Error on write: ', err.message);
    }
  });
  i++;
  listener.streaming(i);
}

function start(code){
  gcode = code;
  if (gcode == null) return;
  streaming = true;
  i = 0;
  //listener.streaming(i);
  stream();
}

/** listener contains the 'arduinoConnected' event which is used in init.js 
 * to help interact with websocket */

 module.exports = {
   listener,
   start
 };