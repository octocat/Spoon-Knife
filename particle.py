import math
import time

import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation

import minPQ as minPQ

global boxSizeX
boxSizeX = 300
global boxSizeY
boxSizeY = 300


class Particle():
    
    def __init__(self, rx, ry, vx, vy, radius, mass):
        self.rx = rx
        self.ry = ry
        self.vx = vx
        self.vy = vy
        self.radius = radius
        self.mass = mass
        self.count = 0
        
    def __str__(self):
        res = []
        res += [self.rx]
        res += [self.ry]
        res += [self.vx]
        res += [self.vy]
        #res += [self.radius]
        #res += [self.mass]

        return ''.join(str(res))
       
    def move(self, dt):
        """
        rx = self.rx
        ry = self.ry
        vx = self.vx
        vy = self.vy
        radius = self.radius
        
        if (self.rx + self.vx*dt < self.radius) or (self.rx + self.vx*dt > boxSizeX - self.radius):
            self.vx = -self.vx
        if (self.ry + self.vy*dt < self.radius) or (self.ry + self.vy*dt > boxSizeY - self.radius):
            self.vy = -self.vy

        """      
        self.rx = self.rx + self.vx*dt
        self.ry = self.ry + self.vy*dt
  
    def timeToHit(self, other):
        if self == other:
            return np.Infinity
        
        dx = other.rx - self.rx
        dy = other.ry - self.ry
        dvx = other.vx - self.vx
        dvy = other.vy - self.vy
        dvdr = dvx * dx + dvy * dy
        
        if dvdr >= 0:
            return np.Infinity
        
        dvdv = dvx * dvx + dvy * dvy
        
        if dvdv == 0:
            return np.Infinity
                
        drdr = dx * dx + dy * dy
        dist = self.radius + other.radius
        
        d = dvdr * dvdr - dvdv * (drdr - dist * dist)
        
        if (d < 0):
            return np.Infinity
            
        if dvdr + math.sqrt(d) >= 0:
            return np.Infinity

        return -(dvdr + math.sqrt(d)) / dvdv
    
    def timeToHitVerticalWall(self):
        global boxSizeX
        rx = self.rx
        vx = self.vx
        radius = self.radius
        
        if vx < 0:
            return (radius - rx) / vx 
        elif vx > 0:
            return (boxSizeX - radius - rx) / vx
        else:
            return np.Infinity
        
    def timeToHitHorizontalWall(self):
        global boxSizeY
        ry = self.ry
        vy = self.vy
        radius = self.radius
        
        if vy < 0:
            return (radius - ry) / vy
        elif vy > 0:
            return (boxSizeY - radius - ry) / vy
        else:
            return np.Infinity
    
    def bounceOff(self, other):
        dx = other.rx - self.rx
        dy = other.ry - self.ry
        dvx = other.vx - self.vx
        dvy = other.vy - self.vy
        dvdr = dvx * dx + dvy * dy
        dist = self.radius + other.radius
        deltaP = 2 * self.mass * other.mass * dvdr / ((self.mass + other.mass) * dist)
        deltaPx = deltaP * dx / dist
        deltaPy = deltaP * dy / dist
        self.vx += deltaPx / self.mass
        self.vy += deltaPy / self.mass
        other.vx -= deltaPx / other.mass
        other.vy -= deltaPy / other.mass
        self.count += 1
        other.count += 1
        
    def bounceOffVerticalWall(self):
        self.vx = -self.vx
        self.count += 1
        
    def bounceOffHorizontalWall(self):
        self.vy = -self.vy
        self.count += 1
        
        
class Event():
    
    def __init__(self, time, a, b):
        self.time = time
        self.a = a
        self.b = b
        
        if a:
            self.countA = a.count
        else:
            self.countA = -1
            
        if b:
            self.countB = b.count
        else:
            self.countB = -1
        
    def __cmp__(self, other):
        if (self.time < other.time):
            return -1
        if (self.time > other.time):
            return 1
        else:
            return 0
    
    def isValid(self):
        if self.a and (self.a.count != self.countA):
            return False
        if self.b and (self.b.count != self.countB):
            return False
        
        return True
    
    def __str__(self):
        res = []
        res += [str(self.a)]
        res += [str(self.b)]
        res += [self.time]
        return ''.join(str(res))
    

class CollisionSystem():
    
    def __init__(self, particles):
        self.particles = particles
        self.pq = minPQ.MinPQ()
        self.t = 0
        self.limit = 500
        self.images = []
        
    def predictCollision(self, a):
        if not a:
            return
        
        t = self.t
        limit = self.limit
        
        for particle in self.particles:
            dt = a.timeToHit(particle)

            if dt < 0:
                print a, particle

            if (t + dt <= limit):
                self.pq.insert(Event(t + dt, a, particle))
                
        dtX = a.timeToHitVerticalWall()
        if (t + dtX <= limit):
            self.pq.insert(Event(t + dtX, a, None))
            
        dtY = a.timeToHitHorizontalWall()
        if (t + dtY <= limit):
            self.pq.insert(Event(t + dtY, None, a))        
        
    
    def simulate(self, limit, Hz):
        self.limit = limit
        
        for particle in self.particles:
            self.predictCollision(particle)
        
        self.pq.insert(Event(0, None, None))
        
        while not self.pq.isEmpty():
            event = self.pq.delMin()
            #print event ###test###
            
            if not event.isValid():
                continue
            
            for particle in self.particles:
                particle.move(event.time - self.t)
            
            self.t = event.time
            a = event.a
            b = event.b
            
            if a and b:
                a.bounceOff(b)
            elif a and not b:
                a.bounceOffVerticalWall()
            elif not a and b:
                b.bounceOffHorizontalWall()
            elif not a and not b:
                self.draw(Hz)
                
            self.predictCollision(a)
            self.predictCollision(b)
            
    def draw(self, Hz = 1):
        x=[]
        y=[]
         
        for particle in self.particles:
            x += [particle.rx]
            y += [particle.ry]
        
        #ax = plt.axes(xlim = (0,100), ylim = (0,100))
        #temp = plt.plot(x, y, 'o', color = 'r')
        #self.images += [temp]
        
        if (self.t < self.limit):
            self.pq.insert(Event(self.t + 1.0 / Hz, None, None))
            print self.t
            
    def animation(self):
        fig = plt.figure()
        im_ani = animation.ArtistAnimation(fig, self.images, interval=100, repeat_delay=200,blit=True)
        plt.show()
                

class Measurement():
    def __init__(self, collisionSystem):
        self.particles = collisionSystem.particles
        
    def velocity_dist(self):
        velDict = dict()
        velHistogram = []
        
        for particle in self.particles:
            velHistogram += [math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy)]
        
        velMax = max(velHistogram)
        velStep = velMax/30.0
        print 'velMax = ', velMax
        
        print '********************'
        
        for vel in velHistogram:
            print '%.15f' % vel
            
        print '********************'
        
        for vel in velHistogram:
            velGroup = (int(vel / velStep) + 1) * velStep
            velDict[velGroup] = velDict.get(velGroup, 0) + 1
            
        xVelDist, yVelDist = Measurement.dict2twoList(velDict)
        
        return xVelDist, yVelDist
        
    def pressure(self):
        Fx = 0
        Fy = 0
        
        for particle in self.particles:
            Fx += particle.mass * particle.vx * particle.vx / boxSizeX
            Fy += particle.mass * particle.vy * particle.vy / boxSizeY
            
        Px = Fx / boxSizeY
        Py = Fy / boxSizeX
    
    @staticmethod        
    def dict2twoList(d):
        key_sort = []
        res = []
        
        for key, val in d.items():
            key_sort += [key]
            
        key_sort.sort()
        
        for key in key_sort:            
            res += [d[key]]
            
        return key_sort, res


def plot(xList, yList):
    plt.figure()
    plt.plot(xList, yList, 'o-', color = 'b')
    plt.show()


def main():
    initial = open('initial.txt', 'w')
    
    n = 6000
    particles = []
    print '*********************'
    for _ in range(n):
        vx = 10*np.random.random()-5
        vy = math.sqrt(25 - vx*vx)
        if np.random.random_integers(2) % 2:
            vy *= -1
        particles += [Particle(np.random.random_integers(100), np.random.random_integers(100), vx, vy, 1, 1)]
        print _
        initial.write('%g\t%.15f\t%.15f\n' % (_, vx, vy))
        #particles += [Particle(np.random.random_integers(100), np.random.random_integers(100), 2*np.random.random()-1, 2*np.random.random()-1, 1, 1)]
    
    print '*********************'
    system = CollisionSystem(particles)
    
    tStart = time.time()
    system.simulate(12, 1)
    #system.animation()
    tEnd = time.time()
    
    measure = Measurement(system)
    
    xVelDist, yVelDist = measure.velocity_dist()
    
    for x, y in zip(xVelDist, yVelDist):
        print '%g\t%g' % (x, y)
    
    print 'time cost:', tEnd - tStart
    
    plot(xVelDist, yVelDist)
"""
    for i in range(len(xVelDist)):
        print xVelDist[i], 't', yVelDist[i]

    system.draw(1)

    for _ in range (40):
        for particle in system.particles: 
            particle.move(3)
            
            system.draw(1)

    
    system.animation()
"""
    

    
if __name__ == '__main__':
    main()