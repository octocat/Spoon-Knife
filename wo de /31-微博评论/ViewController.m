//
//  ViewController.m
//  31-微博评论
//
//  Created by teacher on 16/1/29.
//  Copyright © 2016年 teacher. All rights reserved.
//

#import "ViewController.h"
#import "AMBlogModel.h"
#import "AMBlogCell.h"
#import "AMBlogHeaderFooterView.h"
#import "AMInputView.h"


@interface ViewController () <UITableViewDataSource, UITableViewDelegate>
@property (weak, nonatomic) IBOutlet UITableView *tableView;

@property (nonatomic, strong) NSMutableArray * blogArray;

@property (nonatomic, weak) AMInputView * inputView;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    self.tableView.dataSource = self;
    self.tableView.delegate = self;
    
    self.tableView.contentInset = UIEdgeInsetsMake(0, 0, 35, 0);
    
    //iOS8 的新特性：cell的高度自适应
    self.tableView.estimatedRowHeight = 80;
    self.tableView.rowHeight = UITableViewAutomaticDimension;
    
    AMInputView * inputView = [AMInputView view];
    self.inputView = inputView;
    [self.view addSubview:inputView];
    
    NSLayoutConstraint * c1 = [NSLayoutConstraint constraintWithItem:inputView attribute:NSLayoutAttributeLeading relatedBy:NSLayoutRelationEqual toItem:self.view attribute:NSLayoutAttributeLeading multiplier:1 constant:0];
    NSLayoutConstraint * c2 = [NSLayoutConstraint constraintWithItem:inputView attribute:NSLayoutAttributeTrailing relatedBy:NSLayoutRelationEqual toItem:self.view attribute:NSLayoutAttributeTrailing multiplier:1 constant:0];
    NSLayoutConstraint * c3 = [NSLayoutConstraint constraintWithItem:inputView attribute:NSLayoutAttributeBottom relatedBy:NSLayoutRelationEqual toItem:self.view attribute:NSLayoutAttributeBottom multiplier:1 constant:0];
    
    [self.inputView setTranslatesAutoresizingMaskIntoConstraints:NO];
    [self.view addConstraints:@[c1, c2, c3]];
    
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillChangeFrame:) name:UIKeyboardWillChangeFrameNotification object:nil];
    
}

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void) keyboardWillChangeFrame:(NSNotification *) notification
{
//    NSLog(@"%@", notification.userInfo);
    NSString * tS = notification.userInfo[@"UIKeyboardAnimationDurationUserInfoKey"];
    CGFloat ti = tS.doubleValue;
    
    NSValue * v1 = notification.userInfo[@"UIKeyboardCenterBeginUserInfoKey"];
    NSValue * v2 = notification.userInfo[@"UIKeyboardCenterEndUserInfoKey"];
    CGFloat v3 = v1.CGPointValue.y - v2.CGPointValue.y;
    
    [UIView animateWithDuration:ti animations:^{
        if ( v3 > 0) {
            self.inputView.transform = CGAffineTransformMakeTranslation(0, -v3);
        }
        else {
            self.inputView.transform = CGAffineTransformIdentity;
        }
    }];

}

- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
    [self.inputView endEditing:YES];
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    [self.tableView reloadData];
}


- (NSMutableArray *)blogArray
{
    if ( _blogArray == nil ) {
        _blogArray = [NSMutableArray array];
        NSString *pPath = [[NSBundle mainBundle] pathForResource:@"blog.plist" ofType:nil];
        NSArray * pArr = [NSArray arrayWithContentsOfFile:pPath];
        for (NSDictionary * dict in pArr ) {
            AMBlogModel * model = [AMBlogModel modelWithDict:dict];
            [_blogArray addObject:model];
        }
    }
    return _blogArray;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return self.blogArray.count-1;
}
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return [AMBlogCell cellWithTableView:tableView];
}
- (void)tableView:(UITableView *)tableView willDisplayCell:(UITableViewCell *)cell forRowAtIndexPath:(NSIndexPath *)indexPath
{
    ((AMBlogCell*)cell).blogModel = self.blogArray[indexPath.row+1];
}

- (UIView *)tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section
{
    return [AMBlogHeaderFooterView headerFooterViewWithTableView:tableView];
}
- (void)tableView:(UITableView *)tableView willDisplayHeaderView:(UIView *)view forSection:(NSInteger)section
{
    ((AMBlogHeaderFooterView*)view).blogModel = self.blogArray[0];
}
- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section
{
    return [AMBlogHeaderFooterView headerheight];
}







@end
