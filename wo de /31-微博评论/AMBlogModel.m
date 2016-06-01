//
//  AMBlogModel.m
//  31-微博评论
//
//  Created by teacher on 16/1/29.
//  Copyright © 2016年 teacher. All rights reserved.
//

#import "AMBlogModel.h"

@implementation AMBlogModel

+ (AMBlogModel *)modelWithDict:(NSDictionary *)dict
{
    return [[self alloc] initWithDict:dict];
}

- (instancetype)initWithDict:(NSDictionary*) dict
{
    if ( self = [super init] ) {
        [self setValuesForKeysWithDictionary:dict];
    }
    return self;
    
}

-(void)mytest{
    NSLog(@"dsdsds");
}

@end
