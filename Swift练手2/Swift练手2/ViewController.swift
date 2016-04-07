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
        shape.numberOfSides = 7
        let shapeDescription = shape.simpleDescription()
        print("调用Shape类里面的函数",shapeDescription)
        //这是测试
        print("")
        
    
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

