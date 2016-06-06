//
//  ViewController.m
//  Singleton(ARC)
//
//  Created by gan on 16/6/1.
//  Copyright © 2016年 GZLProject. All rights reserved.
//

#import "ViewController.h"
#import "Singleton.h"
@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    UIImageView * img = [[UIImageView alloc]initWithFrame:CGRectMake(0, 20,self.view.frame.size.width, self.view.frame.size.height-20)];
//    img.backgroundColor = [UIColor yellowColor];
    img.image = [UIImage imageNamed:@"IOS实现单例模式的几种实现方法.png"];
    [self.view addSubview:img];
//    Singleton *A = [[Singleton alloc] init];
//    
//    NSLog(@"A:%@",A);
    
    Singleton *B = [Singleton sharedInstance];
    
    NSLog(@"B:%@",B);
    
//    Singleton *C = [A copy];
//    
//    NSLog(@"C:%@",C);
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
