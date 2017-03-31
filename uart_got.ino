void setup() {  
  Serial.begin(115200);   // "Serial" correspond to the Serial Monitor of the IDE  
  Serial1.begin(115200);  // "Serial1" correspond to the pins 0 and 1  
    
  Serial.println("Sending data through Serial1 (IO1 - Tx)");  
}  
  
  
void loop() {  
  Serial1.println("Radhi");  
  Serial.println("String 'test' sent");  
    
  delay(100); // Delay of 30 msec before send data again  
} 
