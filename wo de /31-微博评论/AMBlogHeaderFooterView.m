//
//  AMBlogHeaderFooterView.m
//  31-微博评论
//
//  Created by teacher on 16/1/29.
//  Copyright © 2016年 teacher. All rights reserved.
//

#import "AMBlogHeaderFooterView.h"

@interface AMBlogHeaderFooterView ()

@property (nonatomic, weak) UIImageView * iconImageView;

@property (nonatomic, weak) UILabel * nameLabel;

@property (nonatomic, weak) UILabel * contextLabel;

@end

@implementation AMBlogHeaderFooterView

+ (AMBlogHeaderFooterView *)headerFooterViewWithTableView:(UITableView *)tableView
{
    AMBlogHeaderFooterView * v = [tableView dequeueReusableHeaderFooterViewWithIdentifier:@"blogHeader"];
    if ( v == nil ) {
        v = [[AMBlogHeaderFooterView alloc] initWithReuseIdentifier:@"blogHeader"];
    }
    return v;
}

- (instancetype)initWithReuseIdentifier:(NSString *)reuseIdentifier
{
    if ( self = [super initWithReuseIdentifier:reuseIdentifier] ) {
        UIImageView * iconImageView = [[UIImageView alloc] init];
        self.iconImageView = iconImageView;
        [self.contentView addSubview:iconImageView];
        
        UILabel * nameLabel = [[UILabel alloc] init];
        self.nameLabel = nameLabel;
        [self.contentView addSubview:nameLabel];
        
        UILabel * contextLabel = [[UILabel alloc] init];
        self.contextLabel = contextLabel;
        [self.contentView addSubview:contextLabel];
        self.contextLabel.numberOfLines = 0;
        
    }
    return self;
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    
    self.iconImageView.frame = CGRectMake(10, 10, 80, 80);
    
    self.nameLabel.frame = CGRectMake(100, 10, self.contentView.frame.size.width-110, 25);
    self.contextLabel.frame = CGRectMake(100, 40, self.contentView.frame.size.width-110, 50);
}

+ (CGFloat)headerheight
{
    return 100;
}

- (void)setBlogModel:(AMBlogModel *)blogModel
{
    _blogModel = blogModel;
    self.iconImageView.image = [UIImage imageNamed:_blogModel.icon];
    self.nameLabel.text = _blogModel.name;
    
    self.contextLabel.text = _blogModel.context;

}


@end





