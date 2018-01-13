/** 
 * @author    Tesselina Spaeth <tesselina.spaeth@hs-augsburg.de>
 * @copyright 2017
 * @license   CC-BY-NC-SA-4.0
 */


function mapToRange(val, in_min, in_max, out_min, out_max) {
  return (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}


function calculate(samples){

  return null;

};

module.exports = calculate;


      // var steps = .map(function(val, i, arr) {
    //   var range = mapToRange(val, -1,1,0,500);
    //   var oldRange = mapToRange(arr[i-1], -1,1,0,500);
    //   if(oldRange) return Math.round(range - oldRange);
    //   else return Math.round(range);
    // }); 




/*startradius =  132.5 mm
endradius = 30.0 mm
difference = startradius -endradius = 102.5 mm
spiralDistance = 5 mm; 
turns = 102.5/5 = 20.5;
turnsToRadians = 20.5*2*PI = 41*PI = 128.805298797;

spiral equation:
r = a + b*theta;
2*PI*b = 5mm  ->  5/(2*PI)  
-> b = 0.79577471545
   a = 30mm;
   -> 30 + 0.79577471545 * theta; 
or -> 132.5 - 0.79577471545 * theta;


circumference: 
\int_{0}^{41\pi}\sqrt{(30+0.79577471545\theta)^2+(0.79577471545)^2}d\theta
spiralCircumference =  10466.021510 mm = 10.466 m

lengthPerSample = circumference/ samples.length
-> 10466.021510/50000 = 21/100 = 0.21 mm  //umfang 10500 mm

sectionCircumference = r*2*PI

radius equation: 

lengthPerSample = r*2*theta 
-> theta = lengthPerSample/(2*r)= 21/(200*r)= 0.105/r

r: 132mm theta: 0.000795454
r: 85mm theta:  0.001235294
r: 35mm theta:  0.003

transmission = 16.625 // 266/16 gear to pulley

totalSteps= 20.5* 16.625 * 32* 200 = 68162.5 (* 32 bzw microsteps)
averageRadianPerStep = turnsToRadians/totalSteps = 41PI/68162.5 = 0.001889679791633


// theta = 0.105/r is set into spiral equation 
newRadius =  oldRadius - b * theta =
          =  oldRadius - (b * lengthPerSample)/(2 * oldRadius) =
          =  oldRadius - (0.79577471545 *0.105)/oldRadius) = 
          =  oldRadius -  0.0835563/oldRadius

->> newRadius =  oldRadius - (b * lengthPerSample)/(2 * oldRadius)(+ samplevalue)
        theta = lengthPerSample/(2*oldRadius)

 */