CC = g++
CFLAGS = -c -g -O -Wall

all: issue.o basket.o
	$(CC) issue.o basket.o -o issue

issue.o: issue.cpp
	$(CC) $(CFLAGS) issue.cpp

basket.o: basket.cpp
	$(CC) $(CFLAGS) basket.cpp

run:
	@./issue

clean:
	rm -f issue *.o *~
