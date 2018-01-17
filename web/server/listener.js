/** 
 * @author    Tesselina Spaeth <tesselina.spaeth@hs-augsburg.de>
 * @copyright 2018
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
    this.emit('finishedDecoding', samples);
};


Listener.prototype.gcodeReady = function (gcode) {
    this.emit('gcodeReady', gcode);
};

Listener.prototype.arduinoConnected = function (bool, port) {
    this.emit('arduinoConnected', bool, port);
};

module.exports = Listener;