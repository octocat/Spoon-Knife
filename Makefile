CC = g++
CFLAGS = -c -g -O -Wall

all: issue.o
	$(CC) issue.o -o issue

issue.o: issue.cpp
	$(CC) $(CFLAGS) issue.cpp

run:
	@./issue

clean:
	rm -f issue *.o *~
