/** 
 * @author    Tesselina Spaeth <tesselina.spaeth@hs-augsburg.de>
 * @copyright 2018
 * @license   CC-BY-NC-SA-4.0
 */

/* 
Calculations are based on following source: 
Title: "Length of an Archimedean Spiral", 
Author: Murray Bourne
Institution: SquareCirclez - The IntMath blog
Date: 21 Sep 2011
URL:https://www.intmath.com/blog/mathematics/length-of-an-archimedean-spiral-6595
*/

/*Here are the measurements for my clay discs in mm */
const outerRadius =  132.5;
const innerRadius = 30.0;
const spiralDistance = 5; //distance between spiral arms
const difference = outerRadius -innerRadius; // 102.5 mm
const turns = difference/spiralDistance;  //20.5;
const turnsInRadians = turns * 2 * Math.PI; // = 41*PI = 128.805298797;

/* spiral equation:
r = a + b*theta; 

"r    is the distance from the origin
a     is the start point of the spiral - inside > out 
b     affects the distance between each arm " (radius increase in relation to PI one rotation(2PI) 
      causes radius to shrink by spiralDistance -> 2*PI*b = spiralDistance)
theta is the angle in radians
*/
const multiplicator = spiralDistance/(2 * Math.PI); //in our case: 5/(2*PI) = 0.79577471545

function spiralRadius(theta){ 
  return outerRadius- multiplicator* theta; //from outside to inside: 132.5 - 0.79577471545 * theta;

}

/* 
circumference calculation: 
The first Url shows the integral calculation with my specific measurements, resulting in a circumference of 10466.021510 mm -> 10.466 m: 
http://www.wolframalpha.com/input/?i=%5Cint_%7B0%7D%5E%7B41%5Cpi%7D%5Csqrt%7B(30%2B0.79577471545%5Ctheta)%5E2%2B(0.79577471545)%5E2%7Dd%5Ctheta

f(theta) = sqrt{(innerRadius+multiplicator*theta)^2+(multiplicator)^2}
I put f(theta) into https://www.integralrechner.de to calculate the integral function F(theta) 
but left the innerRadius and multiplicator as variables as the measurements might be altered later.
-> (b^2*arsinh((b*theta+a)/b)+(b*theta+a)*sqrt(b*(theta*(b*theta+2*a)+b)+a^2))/(2*b)
*/

function getSpiralCircumference(){
 return F(innerRadius, multiplicator, turnsInRadians) - F(innerRadius, multiplicator, 0);
}


function F(a, b, theta){ //a is inner radius of spiral, b is multiplicator
  return (Math.pow(b,2)*Math.asinh((b*theta+a)/b)+(b*theta+a)*Math.sqrt(b*(theta*(b*theta+2*a)+b)+Math.pow(a,2)))/(2*b);
  
}

const spiralCircumference = getSpiralCircumference();


/* 
To get an even seperation of sample information on the everchanging radius, 
I calculate the length of the section of circumference each sample should get. 
*/
function getCircumferencePerSample(samplesCount){ //10655
return spiralCircumference/ samplesCount; //-> 10466.021510/50000 ~ 21/100 ~ 0.21 mm  ~ umfang 10500 mm
}


/* 
radius equation: 
To have an even layout of samples on the spiral, the angle "theta" that turns the plate 
and the decrease in radius have to be calculated according to the prior radius -> oldRadius

Since CircumferencePerSample = r*theta we can solve the equation for theta:
theta        = CircumferencePerSample/(2*oldRadius) 

theta is set into spiral equation:
radius       = oldRadius- multiplicator* theta; 
        ->   = oldRadius- multiplicator* (CircumferencePerSample/(2*oldRadius))  -> + samplevalue
example values:
r: 132mm theta: 0.000795454
r: 85mm theta:  0.001235294
r: 35mm theta:  0.003
*/


function getTheta(samplesCount, oldRadius){
 return getCircumferencePerSample(samplesCount)/oldRadius;

}

function getRadius(samplesCount, oldRadius){
  return (oldRadius- multiplicator * getTheta(samplesCount, oldRadius)); //+ samplevalue; 
}


/*Further Calculation towards stepper motor steps 
could be solved differently by sending a request 
to the arduino and get the data directly from there
*/

const steps = {
  w: 200,
  p: 200
}
const microsteps = {
  w: 32,
  p: 32
}

const stepsPerMm = (steps.w * microsteps.w)/32; //pulley has 16 teeth which means 32mm per rotation
//1mm/stepsPerMm = distance per step ( 1step = 0.01 mm) 


const plateTransmission = 16.625; // 266/16 gear to pulley
const totalSteps = {
  w: stepsPerMm * difference, //steps per mm multiplied by the distance covered
  p: turns* plateTransmission * steps.p * microsteps.p 
}

/*
transforming radius in steps and new coordinate system where starting point of cuttin process is 0 
mapToRange function was used from:

xposedbones, „Javascript Map range of number to another range“.Github, Inc.. 
https://gist.github.com/xposedbones/75ebaef3c10060a3ee3b246166caab56, 26.09.2016
*/
function mapToRange(val, in_min, in_max, out_min, out_max) {
  return (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

const range = stepsPerMm * spiralDistance;

function sampleValueToSteps (val){
  return mapToRange(val, -1,1,0, range);

}

function getWPos(radius, val){
  return (outerRadius - radius)* stepsPerMm + sampleValueToSteps(val);
}

  //turnsInRadians -> totalSteps.p
  //128.805298797  ->  2181200 
function getPPos(theta){
  return (theta/turnsInRadians) * totalSteps.p;
}

/**getClientValues:
 * This function acts as a wrapper for the spiral coordinates that will be passed to 
 * the client (sketch.js) to draw the preview spiral.
 */

function getClientStruct(radius, theta, val, scale){
  var lim = spiralDistance*scale;
  return {
    r: (radius*scale + mapToRange(val, -1,1,-lim/2, lim/2)).toFixed(2),
    t: theta.toFixed(5)
  };
}

module.exports = {
  outerRadius,
  getWPos,
  getPPos,
  getRadius,
  getTheta,
  getClientStruct
};