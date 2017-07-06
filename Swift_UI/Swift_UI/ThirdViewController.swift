//
//  ThirdViewController.swift
//  Swift_UI
//
//  Created by 张垚 on 2017/5/23.
//  Copyright © 2017年 PX. All rights reserved.
//

import UIKit
import Foundation

class ThirdViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    var dataArr = NSMutableArray()
    var _tableView : UITableView?
    
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.view.backgroundColor = UIColor.brown
        for i in 0 ..< 100 {
            dataArr .add("LIST\(i)")
        }
        _tableView = UITableView.init(frame: self.view.bounds, style: .plain)
        _tableView!.delegate = self;
        _tableView!.dataSource = self;
        self.view.addSubview(_tableView!)
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
         return dataArr.count
    }
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cellID = "me cell"
        var cell = tableView.dequeueReusableCell(withIdentifier: cellID)
        if cell == nil {
            cell = UITableViewCell.init(style: .default, reuseIdentifier: cellID)
        }
        cell?.selectionStyle = .blue
        cell!.textLabel?.text = dataArr[indexPath.row] as? String
        return cell!
    }
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        print("选中cell\(indexPath.row)")
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
