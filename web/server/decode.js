/** 
 * @author    Tesselina Spaeth <tesselina.spaeth@hs-augsburg.de>
 * @copyright 2017
 * @license   CC-BY-NC-SA-4.0
 */


const WavDecoder = require("wav-decoder");
const fs = require("fs");
const path = require("path");
const fileDir = "/public/assets/";
var Listener = require('./listener');
var listener = new Listener();

function readFile(fileName){
  var url = path.join(path.dirname(__dirname), fileDir, fileName);
  return new Promise((resolve, reject) => {
    fs.readFile(url, (err, buffer) => {
      if (err) {
        return reject(err);
      }
      return resolve(buffer);
    });
  });
};


function getSamplesFromWavFile(filename){
  readFile(filename).then((buffer) => {
    return WavDecoder.decode(buffer);
  }).then(function(audioData) {
    listener.finishedDecoding(audioData.channelData[0]);
    return audioData.channelData[0];
  });
}

module.exports = {
  getSamplesFromWavFile,
  listener
};