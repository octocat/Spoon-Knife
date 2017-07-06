//
//  SecondViewController.swift
//  Swift_UI
//
//  Created by 张垚 on 2017/5/23.
//  Copyright © 2017年 PX. All rights reserved.
//

import UIKit
import Foundation

protocol FontSizeChangeDelegate {
    func fontSizeDidChange(controller:SecondViewController, fontSize:Float)
}

class SecondViewController: UIViewController {
    var fontSize : Float = 15
    var delegate : FontSizeChangeDelegate?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.title = "第二界面"
        //self.view.backgroundColor = UIColor.blue
        
//        let btn = UIButton.init(type: .custom)
//        btn.frame = CGRect.init(x: 200, y: 200, width: 200, height: 50)
//        btn.backgroundColor = UIColor.brown
//        btn.setTitle("增大字体大小", for: .normal)
//        btn.addTarget(self, action: #selector(back), for: .touchUpInside)
//        self.view.addSubview(btn)
        let image = UIImage.init(named: "160PG21006-1.jpg")
        let ZYiamegView = ZYImageView.init(frame: CGRect.init(x: 0, y: 100, width: 50, height: 50))
        ZYiamegView.image = image
        self.view.addSubview(ZYiamegView)
        ZYiamegView.addTarget(self, with:#selector(click))
        
        
        
        // Do any additional setup after loading the view.
    }

    func click() {
        print("点击图片")
    }
    
    func back() {
//        self.navigationController?.popViewController(animated: true)
        fontSize += 1
        print("\(fontSize)")
        if (delegate != nil) {
            self.delegate?.fontSizeDidChange(controller: self, fontSize: fontSize)
        }
        
        
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
