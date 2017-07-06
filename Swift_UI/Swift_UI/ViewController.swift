//
//  ViewController.swift
//  Swift_UI
//
//  Created by 张垚 on 2017/5/23.
//  Copyright © 2017年 PX. All rights reserved.
//

import UIKit
import Foundation

class ViewController: UIViewController, FontSizeChangeDelegate {
    var count = 0
    var myLabel : UILabel?
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.view.backgroundColor = UIColor.white
        myLabel = UILabel(frame: CGRect(x: 0, y: 100, width: 200, height: 20))
        myLabel!.text = "哈哈";
        myLabel!.backgroundColor = UIColor.red
        self.view.addSubview(myLabel!)
//
//        let myBtn = UIButton.init(type: UIButtonType.custom)
//        myBtn.frame = CGRect.init(x: 100, y: 300, width: 100, height: 60)
//        myBtn.setTitle("点击", for: .normal)
//        myBtn.backgroundColor = UIColor.green
//        myBtn.addTarget(self, action: #selector(click(button:)), for: .touchUpInside)
//        self.view.addSubview(myBtn)
        
        
        //self.title = "导航控制器"
        let nextItem = UIBarButtonItem.init(title: "编辑", style: .plain, target: self, action: #selector(click))
        self.navigationItem.rightBarButtonItem = nextItem
        // Do any additional setup after loading the view, typically from a nib.
    }

    func click() {
        count += 1
        print("click \(count)")
        let secondVC = SecondViewController()
        secondVC.delegate = self
        self.navigationController?.pushViewController(secondVC, animated: true)
        
    }
    
    func fontSizeDidChange(controller:SecondViewController, fontSize:Float) {
        myLabel?.font = UIFont.boldSystemFont(ofSize: CGFloat(fontSize))
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

