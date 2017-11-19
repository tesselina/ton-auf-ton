/** 
 * @author    Tesselina Spaeth <tesselina.spaeth@hs-augsburg.de>
 * @copyright 2017
 * @license   CC-BY-NC-SA-4.0
 */

const fs = require("fs");
const path = require("path");
const WavDecoder = require("wav-decoder");
var wavdata = null;
const fileDir = "/public/assets/";
const fileName = "abtast.wav";
//console.log("__dirname: " + __dirname);
const readFile = (filepath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, (err, buffer) => {
      if (err) {
        return reject(err);
      }
      return resolve(buffer);
    });
  });
};


function readdFile(filename) {
    return fs.readFileSync(path.join(path.dirname(__dirname), fileDir, fileName));
  }

/* readFile("/Users/tesselinaspaeth/Desktop/p5/ton-auf-ton_node/web/public/assets/abtast.wav").then((buffer) => {
  return WavDecoder.decode(buffer);
}).then(function(audioData) {
    console.log(audioData.sampleRate);
  //console.log(audioData.channelData[0].length); // Float32Array
  return module.exports = wavdata;
}).catch((err) => {
    console.log('err', err);
}); */