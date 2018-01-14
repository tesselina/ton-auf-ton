/** 
 * @author    Tesselina Spaeth <tesselina.spaeth@hs-augsburg.de>
 * @copyright 2017
 * @license   CC-BY-NC-SA-4.0
 */

var Listener = require('./listener');
var listener = new Listener();

var calculate = require('./calculate');

var gcode = [];
  

function writeGcode(samples){
  console.log('gcode',    
  calculate.getSpiralCircumference(),
  calculate.getCircumferencePerSample(samples.length),
  calculate.getRadius(samples.length, 120),
  calculate.getTheta(samples.length, 120)
);

  /*gcode.push("G0 L"+ samples.length);
  samples.forEach(function(val, index, array) {
    gcode.push("G1 W"+val.toFixed(7)+ " I"+index);
  });

 if (gcode){
  listener.gcodeReady(gcode);
  return gcode; 
 } else{
  return new Error('Gcode wasn`t successfully generated.');
 }*/
}

  module.exports = {
    writeGcode,
    listener
  };

