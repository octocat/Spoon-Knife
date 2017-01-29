#include "stdio.h"
//! [Interesting]
#include "mraa.h"
#include <stdbool.h>
void GSMResponse();
char cmd;
int
main(int argc, char** argv)
{
mraa_uart_context uart;
mraa_init();
uart = mraa_uart_init(0);
  if (uart == NULL) {
  fprintf(stderr, "UART failed to setup\n");
  return EXIT_FAILURE;
  }
if(mraa_uart_set_baudrate(uart,2400)!=MRAA_SUCCESS)
  {
  fprintf(stderr,"Set Baud Failed\n");
  }
cmd = "AT\r";
mraa_uart_write(uart,cmd, sizeof(cmd));
GSMResponse();
}
 
void GSMResponse()
{
char buff[]="JJJJJJJJ";//some data to make sure this is being changed by read
char data;
bool yes;
int bytesread=0;
 
yes = mraa_uart_data_available(uart,10000);
  fprintf(stderr,"Data available = %d\n",yes);
  if(yes)
  {
  bytesread = mraa_uart_read(uart,buff,10);
 
  fprintf(stderr,"Number of bytes read = %d\n",bytesread);
  fprintf(stdout,"ASCII - %d\n",buff[0]);
  fprintf(stdout,"Character - %c\n",buff[0]);
  fprintf(stderr,"%s\n",buff);
  }
  else
  {
  fprintf(stderr,"No response from GSM\n");
  }
}
