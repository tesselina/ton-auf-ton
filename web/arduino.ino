//https://create.arduino.cc/projecthub/Yogeshmodi/sketch-it-cnc-plotter-95019d

#include <Stepper.h>

#define LINE_BUFFER_LENGTH 512

/* Structures, global variables    */
struct vector { 
  float w; 
  float p; 
};

// different step rate on howard in stepper and nema17 stepper
struct vector stepsPerRevolution = {200, 200};

/* 
Set microsteps with jumper
MODE0 MODE1	MODE2   Microstep Resolution
Low	Low	Low	        Full step
High Low Low    	Half step
Low	High Low    	1/4 step
High High Low   	1/8 step
Low	Low	High    	1/16 step
High Low High   	1/32 step
Low	High High	    1/32 step
High High High  	1/32 step */
struct vector microSteps = {32, 32};

// Initialize steppers for wave and plate control using Dir end Step Pins on the Arduino and the DRV8825 stepper driver
Stepper stepperPlate(stepsPerRevolution.p * microSteps.p, 3,4);            
Stepper stepperWaves(stepsPerRevolution.w * microSteps.w, 8,9);  

// Current position of plothead
struct vector actuatorPos;

float StepInc = 1;
int StepDelay = 0;
int LineDelay = 1;

//pulley 16 zähne - zahnrad 266 zähne 
float stepsPerMm = (stepsPerRevolution.w * microSteps.w) / 32; //16zähne a 2mm = 32mm
float StepsPerPlateRevolution = (266/16) * stepsPerRevolution.p * microSteps.p;

float Wmin = 0;
float Wmax = stepsPerMm *  102.5;
float Pmin = 0;
float Pmax = 20.5* StepsPerPlateRevolution; //turns

float WPos = Wmin;
float PPos = Pmin;

// Set to true to get debug output.
boolean verbose = false;

void setup() {
  //  Setup
  Serial.begin( 9600 );

  stepperWaves.setSpeed(400); //in rounds per minute
  stepperPlate.setSpeed(400); 

  //  Set & move to initial default position
  Serial.println("TON auf TON Schreibgerät ist angeschlossen und wartet auf Befehle! :)");
}

void loop() 
{
  //main loop 
  delay(200);
  char line[ LINE_BUFFER_LENGTH ];
  char c;
  int lineIndex;
  bool lineIsComment, lineSemiColon;

  lineIndex = 0;
  lineSemiColon = false;
  lineIsComment = false;

  while (1) {

    // Serial reception - Mostly from Grbl, added semicolon support
    while ( Serial.available()>0 ) {
      c = Serial.read();
      if (( c == '\n') || (c == '\r') ) {             // End of line reached
        if ( lineIndex > 0 ) {                        // Line is complete. Then execute!
          line[ lineIndex ] = '\0';                   // Terminate string
          if (verbose) { 
            Serial.print( "Received : "); 
            Serial.println( line ); 
          }
          processIncomingLine( line, lineIndex );
          lineIndex = 0;
        } 
        else { 
          // Empty or comment line. Skip block.
        }
        lineIsComment = false;
        lineSemiColon = false;  
        //Serial.println("ok");   needs to only return when stuff was send= 
      } 
      else {
        if ( (lineIsComment) || (lineSemiColon) ) {   // Throw away all comment characters
          if ( c == ')' )  lineIsComment = false;     // End of comment. Resume line.
        } 
        else {
          if ( c <= ' ' ) {                           // Throw away whitepace and control characters
          } 
          else if ( c == '/' ) {                    // Block delete not supported. Ignore character.
          } 
          else if ( c == '(' ) {                    // Enable comments flag and ignore all characters until ')' or EOL.
            lineIsComment = true;
          } 
          else if ( c == ';' ) {
            lineSemiColon = true;
          } 
          else if ( lineIndex >= LINE_BUFFER_LENGTH-1 ) {
            Serial.println( "ERROR - lineBuffer overflow" );
            lineIsComment = false;
            lineSemiColon = false;
          } 
          else if ( c >= 'a' && c <= 'z' ) {        // Upcase lowercase
            line[ lineIndex++ ] = c-'a'+'A';
          } 
          else {
            line[ lineIndex++ ] = c;
          }
        }
      }
    }
  }
}

void processIncomingLine( char* line, int charNB ) {
  int currentIndex = 0;
  char buffer[ 64 ];                                 // Hope that 64 is enough for 1 parameter
  struct vector newPos;

  newPos.w = 0.0;
  newPos.p = 0.0;

  //  Needs to interpret 
  //  G1 for moving
  //  G4 P300 (wait 150ms)
  //  G1 X60 Y30
  //  G1 X30 Y50

  //  Discard anything with a (
  //  Discard any other command!

  while( currentIndex < charNB ) {
    switch ( line[ currentIndex++ ] ) {              // Select command, if any
    case 'G':
      buffer[0] = line[ currentIndex++ ];          // /!\ Dirty - Only works with 2 digit commands
      //      buffer[1] = line[ currentIndex++ ];
      //      buffer[2] = '\0';
      buffer[1] = '\0';

      switch ( atoi( buffer ) ){                   // Select G command
      case 0:       
      case 1:
        // /!\ Dirty - Suppose that X is before Y
        char* indexW = strchr( line+currentIndex, 'W' );  // Get X/Y position in the string (if any)
        char* indexP = strchr( line+currentIndex, 'P' );
        if ( indexP <= 0 ) {
          newPos.w = atof( indexW + 1); 
          newPos.p = actuatorPos.p;
        } 
        else if ( indexW <= 0 ) {
          newPos.p = atof( indexP + 1);
          newPos.w = actuatorPos.w;
        } 
        else {
          newPos.p = atof( indexP + 1);
          indexP = '\0';
          newPos.w = atof( indexW + 1);
        }
        drawLine(newPos.w, newPos.p );
        Serial.println("ok");
        actuatorPos.w = newPos.w;
        actuatorPos.p = newPos.p;
        break;
      }
      break;
    }
  }



}



void drawLine(float w1, float p1) {

  
  if (w1 >= Wmax) { 
    w1 = Wmax; 
  }
  if (w1 <= Wmin) { 
    w1 = Wmin; 
  }
  // if (p >= Pmax) { 
  //   p = Pmax; 
  // }
  // if (p <= Pmin) { 
  //   p = Pmin; 
  // }

  float w0 = WPos;
  float p0 = PPos;

  //  Let's find out the change for the coordinates
  long dw = abs(w1-w0);
  long dp = abs(p1-p0);
  int sw = w0<w1 ? StepInc : -StepInc;
  int sp = p0<p1 ? StepInc : -StepInc;

  long i;
  long over = 0;

  if (dw > dp) {
    for (i=0; i<dw; ++i) {
      stepperWaves.step(sw);
      over+=dp;
      if (over>=dw) {
        over-=dw;
       stepperPlate.step(sp);
      }
      delay(StepDelay);
    }
  }
  else {
    for (i=0; i<dp; ++i) {
      stepperPlate.step(sp);
      over+=dw;
      if (over>=dp) {
        over-=dp;
        stepperWaves.step(sw);
      }
      delay(StepDelay);
    }    
  }

  if (verbose)
  {
    Serial.print("dw, dp:");
    Serial.print(dw);
    Serial.print(",");
    Serial.print(dp);
    Serial.println("");
  }

  //  Delay before any next lines are submitted
  delay(LineDelay);
  //  Update the positions
  WPos = w1;
  PPos = p1;
}