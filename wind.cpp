#include <bits/stdc++.h>
#include <GL/glut.h>
using namespace std;

void delay(int msec)
{
 int d = msec+clock();
 while(d > clock());
}

void myinit()
{
 glClearColor(0,0,0,0);
 gluOrtho2D(-700,700,-700,700);
}

void translate(float &x,float &y,float tx,float ty)
{
 float xd = x+tx;
 float yd = y+ty;
 x = xd;
 y = yd;
}

void rot(float &x,float &y,float i)
{
 float xd = x*cos(i)-y*sin(i);
 float yd = x*sin(i)+y*cos(i);
 x = xd;
 y = yd;
}

void circlePts(float x,float y,float xc,float yc,float r,float t)
{
 float xd,yd,tx=xc,ty=yc;

 xd=x+xc,yd=y+yc;
 translate(xd,yd,-tx,-ty);
 rot(xd,yd,t);
 translate(xd,yd,tx,ty);
 glVertex2f(xd,yd);

 xd=y+xc,yd=x+yc;
 translate(xd,yd,-tx,-ty);
 rot(xd,yd,t);
 translate(xd,yd,tx,ty);
 glVertex2f(xd,yd);

 xd=-x+xc,yd=y+yc;
 translate(xd,yd,-tx,-ty);
 rot(xd,yd,t);
 translate(xd,yd,tx,ty);
 glVertex2f(xd,yd);

 xd=-y+xc,yd=x+yc;
 translate(xd,yd,-tx,-ty);
 rot(xd,yd,t);
 translate(xd,yd,tx,ty);
 glVertex2f(xd,yd);

  xd=-x+xc,yd=-y+yc;
 translate(xd,yd,-tx,-ty);
 rot(xd,yd,t);
 translate(xd,yd,tx,ty);
 glVertex2f(xd,yd);

 xd=-y+xc,yd=-x+yc;
 translate(xd,yd,-tx,-ty);
 rot(xd,yd,t);
 translate(xd,yd,tx,ty);
 glVertex2f(xd,yd);

 xd=x+xc,yd=-y+yc;
 translate(xd,yd,-tx,-ty);
 rot(xd,yd,t);
 translate(xd,yd,tx,ty);
 glVertex2f(xd,yd);

 xd=y+xc,yd=-x+yc;
 translate(xd,yd,-tx,-ty);
 rot(xd,yd,t);
 translate(xd,yd,tx,ty);
 glVertex2f(xd,yd);
}

void circle(float xc,float yc,float r,float i)
{
 float x=0,y=r,d=1.25-r;
 circlePts(x,y,xc,yc,r,i);
 while(y >= x)
 {
  if(d < 0)
  {
   d += (2*x+3);
   x++;
  }
  else
  {
   d += (2*x-2*y)+5;
   x++,y--;
  }
  circlePts(x,y,xc,yc,r,i);
 }

}

void ddaLine(float x1,float y1,float x2,float y2,float tx,float ty,float t,bool &flag)
{
  float x=x1,y=y1;
  float dx=x2-x1,dy=y2-y1,steps=0,length;
  if(fabs(dx)>fabs(dy))
  length = fabs(dx);
  else
  length = fabs(dy);
  float xinc = dx/length;
  float yinc = dy/length;
  while(steps <= length)
  {
   float xd=x,yd=y;
   translate(xd,yd,-tx,-ty);
   rot(xd,yd,t);
   translate(xd,yd,tx,ty);
   if(xd >= -5 && xd <= 5 && yd >= -10 && yd <= 110)
   flag = true;
   glVertex2f(xd,yd);
   x += xinc;
   y += yinc;
   steps++;
  }
}

void mydisplay()
{
 glClear(GL_COLOR_BUFFER_BIT);
 glBegin(GL_POINTS);
 circle(0,0,10,0);
 glEnd();
 glFlush();
}

int main(int argc,char **argv)
{
 glutInit(&argc,argv);
 glutInitDisplayMode(GLUT_SINGLE|GLUT_RGB);
 glutInitWindowSize(1400,1400);
 glutInitWindowPosition(0,0);
 glutCreateWindow("Wind Mill");
 myinit();
 glutDisplayFunc(mydisplay);
 glutMainLoop();
 return 0;
}
