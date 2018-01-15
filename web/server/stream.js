/** 
 * @author    Tesselina Spaeth <tesselina.spaeth@hs-augsburg.de>
 * @copyright 2018
 * @license   CC-BY-NC-SA-4.0
 */

var Listener = require('./listener');
var transform = require('./transform');

const usbDetect = require('usb-detection');
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
var port = {};
var parser;

port.listener = new Listener();

var streaming = false;
var gcode = [];
var i = 0;

SerialPort.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log('list', port);
  });
});


const ports = [{
  locationId: 339738624, 
  path: '/dev/cu.usbmodem1441' //left upper port
  },{
  locationId: 341835776,
  path: '/dev/cu.usbmodem1461' //left lower port
  },{
  locationId: 336592896,
  path: '/dev/cu.usbmodem1411' //right upper port
  },{
  locationId: 340787200, 
  path: '/dev/cu.usbmodem1451' //right lower port
  }  
];

//usbDetect.stopMonitoring(); //remove or change event
usbDetect.startMonitoring();
 //vid: restrict search to a certain vendor id -> add:vid filtered by vendor id 

 usbDetect.on('remove:9025', function(device) {
   //if(port && port.isOpen) port.close(function(err){ console.log('close port', err)});
 });

 usbDetect.on('add:9025', function(device) {
   var usb = ports.find(function (obj) { return obj.locationId === device.locationId ; });
   handlePort(usb);
 });

usbDetect.find(9025, function(err, devices) { 
  //if (devices.length >0) port.listener.arduinoConnected(devices[0].locationId);
}).then(function(device){
  return  ports.find(function (obj) { return obj.locationId === device[0].locationId ; });
}).then(function(usb){
  handlePort(usb);
});


function handlePort(usb){
  port = new SerialPort(usb.path, { 
    baudRate: 9600
  }, function (err) {
    if (err) {
      return console.log('Error on open: ', err.message);
    }
  });
  parser = port.pipe(new Readline({ delimiter: '\r\n' }));

  parser.on('data', function (data) { //waits for feedback from arduino 
    console.log('Serial: ', data);
    if (data.trim().startsWith("ok")) stream();
        //if (data.trim().startsWith("TON")) port.listener.arduinoConnected();
  }); 


  port.on('open', function() {
    console.log('Die Maschine ist nun verbunden.');
  });
  port.on('close', function(err) {
    console.log("Die Verbindung zur Maschine wurde getrennt.");
  });
  port.on('error', function(err) {
    console.log("Maschine konnte nicht verbunden werden.");
  });
}







function stream(){
  //console.log('stream', gcode[1]);
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
  });
  i++;
}

transform.listener.on('gcodeReady', function (code) {
  gcode = code;
  if (gcode == null) return;
  streaming = true;
  stream();
});

 module.exports = port;