//
//  ZYImageView.h
//  Swift_UI
//
//  Created by 张垚 on 2017/5/24.
//  Copyright © 2017年 PX. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface ZYImageView : UIImageView

{
    id _target;
    SEL _sel;
}

- (void)addTarget:(id)target WithSelector:(SEL)sel; 

@end
