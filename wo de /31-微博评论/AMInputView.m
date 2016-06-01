//
//  AMInputView.m
//  31-微博评论
//
//  Created by teacher on 16/1/29.
//  Copyright © 2016年 teacher. All rights reserved.
//

#import "AMInputView.h"

@implementation AMInputView

+ (AMInputView *)view
{
    return [[[NSBundle mainBundle] loadNibNamed:@"AMInputView" owner:nil options:nil] lastObject];
}

@end
