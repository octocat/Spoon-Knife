//
//  main.swift
//  Swift01
//
//  Created by 周城滨 on 16/7/3.
//  Copyright © 2016年 mac. All rights reserved.
//

import Foundation
//输出语句
print("周城滨")
//1.常量（数值，字符，字符串，逻辑常量）
print("123")
//运算
print(3/2)
//定义变量的语法 1.var 变量的名字=初值
var a:Int = 123;
var b:Character="f"
var c:String = "kkkk"
print("a=\(a)  b=\(b)  c=\(c)")
//拼接
print("kk"+"2")

//条件判断语句
// if (条件:比较式 > >= < <= == !=)
//｛
//语句
//｝
if a%2==0
{
print("\(a)是偶数")
}
else
{
print("\(a)是奇数")
}


/*
 布尔类型：Bool :true,flase
 */
let turnOffLight=true
if turnOffLight
{
    print("turn OFF")
}
else
{
print("turn ON")
}

/*
 元祖 ("zhangshan",23,98.5)
*/
let student:(String,Int,Double,Int) = ("zhangshan",23,98.5,12)
print(student.0)
print(student.1)
print(student.2)

let (name,age,_,_)=student
print(name)
print(age)

let student1 = (name:"zhangsan",age:"23")
print(student1.name)
print(student1.age)
/*
 可选值：optionals
*/
var optValue:Int?=0

if (optValue != nil)
{
    print(optValue)
}
//表示对可选值的一个强制解析
//var svalue:Int = optValue!
//print(svalue)

//可选绑定
if var svalue = optValue
{
    print(svalue)
}
/*
隐式解析可选类型
*/








