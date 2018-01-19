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
var clientStruct = [];
var oldRadius = calculate.outerRadius;
var oldTheta = 0;
var pxPerMmScale=2;

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
  clientStruct.push(calculate.getClientStruct(radius, theta, val, pxPerMmScale));
  gcode.push("G1 W"+wPos.toFixed()+ " P"+pPos.toFixed());
});

  //listener.gcodeReady(gcode);
 // listener.clientStructReady(clientStruct);
  return new Promise((resolve, reject) => {
    gcode ? resolve({gcode, clientStruct}) : reject('Error creating gcode.');
    }); 


}

  module.exports = {
    writeGcode,
    listener
  };