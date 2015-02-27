TARGET = EigenValue
INC_PATH = -I/opt/amdappsdk/include -I/opt/amdappsdk/include/SDKUtil
LIB_PATH = -L/opt/amdappsdk/lib/x86_64
LIBS = -lOpenCL
$(TARGET) : 
	g++  $(INC_PATH) $(LIB_PATH) -o $(TARGET)  EigenValue.cpp  $(LIBS)
clean :
	rm $(TARGET)
