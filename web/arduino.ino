#include <Servo.h>
#include <Stepper.h>

#define LINE_BUFFER_LENGTH 512

const int stepsPerRevolution = 100; 


Stepper myStepperY(200, 8,9);            
Stepper myStepperX(100, 3,4);  

struct point { 
  float x; 
  float y; 
};

struct point totalSteps;

int StepDelay = 0;
int LineDelay = 30;
int penDelay = 50;

//float StepsPerMillimeterX = 100.0;
//float StepsPerMillimeterY = 100.0;

float Xmin = 0;
float Xmax = 500;
float Ymin = 0;
float Ymax = 50;



boolean verbose = false;

void setup() {
  Serial.begin( 9600 );
  
  delay(200);

  myStepperX.setSpeed(375);
  myStepperY.setSpeed(200);  //übersetzung rausfinden 

  Serial.println("Mini CNC Plotter alive and kicking!");
  Serial.print("X range is from "); 
  Serial.print(Xmin); 
  Serial.print(" to "); 
  Serial.print(Xmax); 
  Serial.println(" mm."); 
  Serial.print("Y range is from "); 
  Serial.print(Ymin); 
  Serial.print(" to "); 
  Serial.print(Ymax); 
  Serial.println(" mm."); 
}

void loop() 
{
  delay(200);
  char line[ LINE_BUFFER_LENGTH ];
  char c;
  int lineIndex;
  bool lineIsComment, lineSemiColon;

  lineIndex = 0;
  lineSemiColon = false;
  lineIsComment = false;

  while (1) {

    while ( Serial.available()>0 ) {
      c = Serial.read();
      if (( c == '\n') || (c == '\r') ) {             
        if ( lineIndex > 0 ) {                        
          line[ lineIndex ] = '\0';                   
          if (verbose) { 
            Serial.print( "Received : "); 
            Serial.println( line ); 
          }
          processIncomingLine( line, lineIndex );
          lineIndex = 0;
        } 
        else { 
          
        }
        lineIsComment = false;
        lineSemiColon = false;
        Serial.println("ok");    
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

    if (verbose)
  {
    Serial.print("process line: ");
    Serial.print(line);
    Serial.print(", lenght: ");
    Serial.print(charNB);
    Serial.println("");
  } 

  int currentIndex = 0;
  char buffer[ 64 ];                                 // Hope that 64 is enough for 1 parameter
  struct point newStep;

  newStep.x = 0.0;
  newStep.y = 0.0;

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
      case 0:                                   // G00 & G01 - Movement or fast movement. Same here
      case 1:
        // /!\ Dirty - Suppose that X is before Y
        char* indexX = strchr( line+currentIndex, 'X' );  // Get X/Y position in the string (if any)
        char* indexY = strchr( line+currentIndex, 'Y' );
        if ( indexY <= 0 ) newStep.y = 0;
        else newStep.y = atof( indexY + 1);
        
        if ( indexX <= 0 ) newStep.x = 0;
        else newStep.x = atof( indexX + 1); 
          
        drawLine(newStep.x, newStep.y );
        Serial.println("ok");
        totalSteps.x = totalSteps.x + newStep.x;
        totalSteps.y = totalSteps.y + newStep.y;
        break;
      }
      break;
    }
  }



}



void drawLine(float x, float y) {

  
  if (x >= Xmax) { 
    x = Xmax; 
  }
  if (x <= Xmin) { 
    x = Xmin; 
  }
  if (y >= Ymax) { 
    y = Ymax; 
  }
  if (y <= Ymin) { 
    y = Ymin; 
  }

  if (verbose)
  {
    Serial.print("step-x, step-y: ");
    Serial.print(x);
    Serial.print(",");
    Serial.print(y);
    Serial.println("");
  }  


myStepperX.step(x);
myStepperY.step(y);
  
//delayMicroseconds(LineDelay);

}






// rpm

// 1 rpm = 3200 /60 000 000

// 32/600 000
// 16/300 000
// 8/ 150 000
// 1/  18 750 microseconds
// 1/ 18.7 ms

// (1*x)/ 18750 = 1/50
// x = 18750/50

// 375*3200 /60 000 000
// 1200 000 / 60 000 000
// 12/600
// 6/ 300
// 2/100
// 1/50