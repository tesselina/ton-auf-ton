/** 
 * @author    Tesselina Spaeth <tesselina.spaeth@hs-augsburg.de>
 * @copyright 2017
 * @license   CC-BY-NC-SA-4.0
 */

const fs = require("fs");
const path = require("path");
const fileDir = "/public/assets/";

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

module.exports = readFile;