//
//  AMBlogCell.m
//  31-微博评论
//
//  Created by teacher on 16/1/29.
//  Copyright © 2016年 teacher. All rights reserved.
//

#import "AMBlogCell.h"

@interface AMBlogCell ()
@property (weak, nonatomic) IBOutlet UIImageView *iconImageView;
@property (weak, nonatomic) IBOutlet UILabel *nameLabel;
@property (weak, nonatomic) IBOutlet UILabel *timeLabel;
@property (weak, nonatomic) IBOutlet UILabel *contextLabel;

@end

@implementation AMBlogCell

+ (AMBlogCell *)cellWithTableView:(UITableView *)tableView
{
    return [tableView dequeueReusableCellWithIdentifier:@"blogCell"];
}

- (void)setBlogModel:(AMBlogModel *)blogModel
{
    _blogModel = blogModel;
    self.iconImageView.image = [UIImage imageNamed:_blogModel.icon];
    self.nameLabel.text = _blogModel.name;
    self.timeLabel.text  =_blogModel.time;
    
    self.contextLabel.text = _blogModel.context;
}


@end
