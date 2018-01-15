/** 
 * @author    Tesselina Spaeth <tesselina.spaeth@hs-augsburg.de>
 * @copyright 2018
 * @license   CC-BY-NC-SA-4.0
 */

var Listener = require('./listener');
var listener = new Listener();

var calculate = require('./calculate');
  



//ask arduino for step information


function writeGcode(samples){
var gcode = [];
var oldRadius = calculate.outerRadius;
var oldTheta = 0;

samples.forEach(function(val, index, array) {
  /*calculating radius and theta:
  - radius is the actual radius in mm on clay disc 
  - theta is the angle in radians between oldRadius and radius 
  */
  var radius = calculate.getRadius(samples.length, oldRadius);
  var theta = oldTheta + calculate.getTheta(samples.length, oldRadius);
  /*calculating wPos and pPos, 
  which are the position coordinates for the motors according to their starting point, 
  the unit is in steps
  - wPos is the position of the wave/knife
  - pPos is the position of the plate
  */
  var wPos = calculate.getWPos(radius, val);
  var pPos = calculate.getPPos(theta);

  oldTheta = theta;
  oldRadius = radius;
  gcode.push("G1 W"+wPos.toFixed()+ " P"+pPos.toFixed());
});

if (gcode){
  console.log(gcode[20000]);
  listener.gcodeReady(gcode);
  return gcode; 
 } else{
  return new Error('Gcode wasn`t successfully generated.');
 }

}

  module.exports = {
    writeGcode,
    listener
  };

  /*gcode.push("G0 L"+ samples.length);


      var steps = .map(function(val, i, arr) {
      var range = mapToRange(val, -1,1,0,500);
      var oldRange = mapToRange(arr[i-1], -1,1,0,500);
      if(oldRange) return Math.round(range - oldRange);
      else return Math.round(range);
    }); 

  */
