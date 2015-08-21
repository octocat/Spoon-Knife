
#include "screenCapture.h"
#include "opencv2/opencv.hpp"
using namespace cv;
int main(int argc, char** argv)
{
 cv::VideoCapture cap(0); //cv::VideoCapture cap(CV_CAP_DSHOW | 1);

   // VideoCapture cap;
    // open the default camera, use something different from 0 otherwise;
    // Check VideoCapture documentation.
    if(!cap.open(0))
        return 0;
    for(;;)
    {
          Mat frame;
          cap >> frame;
          if( frame.empty() ) break; // end of video stream
          imshow("VideoCapture", frame);
          if( waitKey(1) == 27 ) break; // stop capturing by pressing ESC
    }
    // the camera will be closed automatically upon exit
    // cap.close();
    return 0;
}
