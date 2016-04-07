//
//  ViewController.swift
//  Swift练手2
//
//  Created by Asxce, on 16/4/6.
//  Copyright © 2016年 Asxce,. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
      
        class Shape{
            var numberOfSides = 0
            func simpleDescription() -> String {
                return"A shape with\(numberOfSides)sides"
            }
            
        }
        
        let shape = Shape()
        //给类的属性  赋值
        shape.numberOfSides = 7
        //调用Shape的函数
        let shapeDescription = shape.simpleDescription()
        print("调用Shape类里面的函数",shapeDescription)
        
        
    
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

