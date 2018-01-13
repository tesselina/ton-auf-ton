/** 
 * @author    Tesselina Spaeth <tesselina.spaeth@hs-augsburg.de>
 * @copyright 2017
 * @license   CC-BY-NC-SA-4.0
 */

var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Listener() {
    //var dist = this.distance;

    EventEmitter.call(this);
}

util.inherits(Listener, EventEmitter);


Listener.prototype.finishedDecoding = function (samples) {
    console.log('listener finished called');
    this.emit('finishedDecoding', samples);
};


Listener.prototype.gcodeReady = function (gcode) {
    this.emit('gcodeReady', gcode);
};


module.exports = Listener;