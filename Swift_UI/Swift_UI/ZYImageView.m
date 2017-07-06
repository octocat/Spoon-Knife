//
//  ZYImageView.m
//  Swift_UI
//
//  Created by 张垚 on 2017/5/24.
//  Copyright © 2017年 PX. All rights reserved.
//

#import "ZYImageView.h"

@implementation ZYImageView

- (void)addTarget:(id)target WithSelector:(SEL)sel {
    _target = target;
    _sel = sel;
    self.userInteractionEnabled = YES;
}

- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
    if (_target) {
        NSLog(@"原来如此");
        [_target performSelector:_sel withObject:self];
    }
}
/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

@end
