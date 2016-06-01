//
//  AMBlogModel.h
//  31-微博评论
//
//  Created by teacher on 16/1/29.
//  Copyright © 2016年 teacher. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface AMBlogModel : NSObject

@property (nonatomic, copy) NSString * icon;

@property (nonatomic, copy) NSString * name;

@property (nonatomic, copy) NSString * context;

@property (nonatomic, strong) NSNumber * praise;

@property (nonatomic, copy) NSString * time;

@property (nonatomic,copy) NSString * man;
@property (nonatomic,strong) NSString * humen;

+ (AMBlogModel *) modelWithDict:(NSDictionary*) dict;

@end
