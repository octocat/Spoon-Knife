import cv2
import numpy as np
import picamera
import time
import RPi.GPIO as GPIO

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
 
def RCtime (RCpin):
        reading = 0
        GPIO.setup(RCpin, GPIO.OUT)
        GPIO.output(RCpin, GPIO.LOW)
        time.sleep(0.1)
 
        GPIO.setup(RCpin, GPIO.IN)
        # This takes about 1 millisecond per loop cycle
        while (GPIO.input(RCpin) == GPIO.LOW):
                reading += 1
        return reading


def camactivate ():

	with picamera.PiCamera() as camera:
		camera.resolution = (512,512)
		time.sleep(2)
		camera.capture('im1.jpg')
		time.sleep(2)
		camera.capture('im2.jpg')
		time.sleep(2)
		camera.capture('im3.jpg')
		time.sleep(2)
		camera.capture('im4.jpg')

	im1=cv2.imread('im1.jpg',1)
	im2=cv2.imread('im2.jpg',1)
	im3=cv2.imread('im3.jpg',1)
	im4=cv2.imread('im4.jpg',1)

	cv2.putText(im1,'Cam1',(10,20),cv2.FONT_HERSHEY_SIMPLEX,1,(255,255,255),2)
	cv2.putText(im2,'Cam2',(10,20),cv2.FONT_HERSHEY_SIMPLEX,1,(255,255,255),2)
	cv2.putText(im3,'Cam3',(10,20),cv2.FONT_HERSHEY_SIMPLEX,1,(255,255,255),2)
	cv2.putText(im4,'Cam4',(10,20),cv2.FONT_HERSHEY_SIMPLEX,1,(255,255,255),2)


	cv2.namedWindow('Catenated Images',cv2.WINDOW_NORMAL)
	concat=np.zeros((1024,1024,3),np.uint8)
	concat[0:512,0:512,:]=im1
	concat[0:512,512:1024,:]=im2
	concat[512:1024,0:512,:]=im3
	concat[512:1024,512:1024,:]=im4

	cv2.imshow('Catenated Images',concat)
	cv2.imwrite('concat.jpg',concat)
	cv2.waitKey(0)
 
while True:                                     
		LDRReading = RCtime(18)
		print(LDRReading)

		if LDRReading <= 60000:
			camactivate()

