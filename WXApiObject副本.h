//
//  MMApiObject.h
//  Api对象，包含所有接口和对象数据定义
//
//  Created by Wechat on 12-2-28.
//  Copyright (c) 2012年 Tencent. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

/*! @brief 错误码
 *
 */
enum  WXErrCode {
    WXSuccess           = 0,    /**< 成功    */
    WXErrCodeCommon     = -1,   /**< 普通错误类型    */
    WXErrCodeUserCancel = -2,   /**< 用户点击取消并返回    */
    WXErrCodeSentFail   = -3,   /**< 发送失败    */
    WXErrCodeAuthDeny   = -4,   /**< 授权失败    */
    WXErrCodeUnsupport  = -5,   /**< 微信不支持    */
};



/*! @brief 请求发送场景
 *
 */
enum WXScene {
    WXSceneSession  = 0,        /**< 聊天界面    */
    WXSceneTimeline = 1,        /**< 朋友圈      */
    WXSceneFavorite = 2,        /**< 收藏       */
};



enum WXAPISupport {
    WXAPISupportSession = 0,
};



/*! @brief 跳转profile类型
 *
 */
enum WXBizProfileType{
    WXBizProfileType_Normal = 0,    //**< 普通公众号  */
    WXBizProfileType_Device = 1,    //**< 硬件公众号  */
};



/*! @brief 跳转mp网页类型
 *
 */
enum WXMPWebviewType {
    WXMPWebviewType_Ad = 0,        /**< 广告网页 **/
};

#pragma mark - BaseReq
/*! @brief 该类为微信终端SDK所有请求类的基类
 *
 */
@interface BaseReq : NSObject

/** 请求类型 */
@property (nonatomic, assign) int type;
/** 由用户微信号和AppID组成的唯一标识，发送请求时第三方程序必须填写，用于校验微信用户是否换号登录*/
@property (nonatomic, retain) NSString* openID;

@end



#pragma mark - BaseResp
/*! @brief 该类为微信终端SDK所有响应类的基类
 *
 */
@interface BaseResp : NSObject
/** 错误码 */
@property (nonatomic, assign) int errCode;
/** 错误提示字符串 */
@property (nonatomic, retain) NSString *errStr;
/** 响应类型 */
@property (nonatomic, assign) int type;

@end



#pragma mark - WXMediaMessage
@class WXMediaMessage;

/*! @brief 第三方向微信终端发起支付的消息结构体
 *
 *  第三方向微信终端发起支付的消息结构体，微信终端处理后会向第三方返回处理结果
 * @see PayResp
 */
@interface PayReq : BaseReq

/** 商家向财付通申请的商家id */
@property (nonatomic, retain) NSString *partnerId;
/** 预支付订单 */
@property (nonatomic, retain) NSString *prepayId;
/** 随机串，防重发 */
@property (nonatomic, retain) NSString *nonceStr;
/** 时间戳，防重发 */
@property (nonatomic, assign) UInt32 timeStamp;
/** 商家根据财付通文档填写的数据和签名 */
@property (nonatomic, retain) NSString *package;
/** 商家根据微信开放平台文档对数据做的签名 */
@property (nonatomic, retain) NSString *sign;

@end



#pragma mark - PayResp
/*! @brief 微信终端返回给第三方的关于支付结果的结构体
 *
 *  微信终端返回给第三方的关于支付结果的结构体
 */
@interface PayResp : BaseResp

/** 财付通返回给商家的信息 */
@property (nonatomic, retain) NSString *returnKey;

@end


#pragma mark - SendAuthReq
/*! @brief 第三方程序向微信终端请求认证的消息结构
 *
 * 第三方程序要向微信申请认证，并请求某些权限，需要调用WXApi的sendReq成员函数，
 * 向微信终端发送一个SendAuthReq消息结构。微信终端处理完后会向第三方程序发送一个处理结果。
 * @see SendAuthResp
 */
@interface SendAuthReq : BaseReq
/** 第三方程序要向微信申请认证，并请求某些权限，需要调用WXApi的sendReq成员函数，向微信终端发送一个SendAuthReq消息结构。微信终端处理完后会向第三方程序发送一个处理结果。
 * @see SendAuthResp
 * @note scope字符串长度不能超过1K
 */
@property (nonatomic, retain) NSString* scope;
/** 第三方程序本身用来标识其请求的唯一性，最后跳转回第三方程序时，由微信终端回传。
 * @note state字符串长度不能超过1K
 */
@property (nonatomic, retain) NSString* state;
@end



#pragma mark - SendAuthResp
/*! @brief 微信处理完第三方程序的认证和权限申请后向第三方程序回送的处理结果。
 *
 * 第三方程序要向微信申请认证，并请求某些权限，需要调用WXApi的sendReq成员函数，向微信终端发送一个SendAuthReq消息结构。
 * 微信终端处理完后会向第三方程序发送一个SendAuthResp。
 * @see onResp
 */
@interface SendAuthResp : BaseResp
@property (nonatomic, retain) NSString* code;
/** 第三方程序发送时用来标识其请求的唯一性的标志，由第三方程序调用sendReq时传入，由微信终端回传
 * @note state字符串长度不能超过1K
 */
@property (nonatomic, retain) NSString* state;
@property (nonatomic, retain) NSString* lang;
@property (nonatomic, retain) NSString* country;
@end



#pragma mark - SendMessageToWXReq
/*! @brief 第三方程序发送消息至微信终端程序的消息结构体
 *
 * 第三方程序向微信发送信息需要传入SendMessageToWXReq结构体，信息类型包括文本消息和多媒体消息，
 * 分别对应于text和message成员。调用该方法后，微信处理完信息会向第三方程序发送一个处理结果。
 * @see SendMessageToWXResp
 */
@interface SendMessageToWXReq : BaseReq
/** 发送消息的文本内容
 * @note 文本长度必须大于0且小于10K
 */
@property (nonatomic, retain) NSString* text;
/** 发送消息的多媒体内容
 * @see WXMediaMessage
 */
@property (nonatomic, retain) WXMediaMessage* message;
/** 发送消息的类型，包括文本消息和多媒体消息两种，两者只能选择其一，不能同时发送文本和多媒体消息 */
@property (nonatomic, assign) BOOL bText;
/** 发送的目标场景，可以选择发送到会话(WXSceneSession)或者朋友圈(WXSceneTimeline)。 默认发送到会话。
 * @see WXScene
 */
@property (nonatomic, assign) int scene;

@end



#pragma mark - SendMessageToWXResp
/*! @brief 微信终端向第三方程序返回的SendMessageToWXReq处理结果。
 *
 * 第三方程序向微信终端发送SendMessageToWXReq后，微信发送回来的处理结果，该结果用SendMessageToWXResp表示。
 */
@interface SendMessageToWXResp : BaseResp
@property(nonatomic, retain) NSString* lang;
@property(nonatomic, retain) NSString* country;
@end


#pragma mark - GetMessageFromWXReq
/*! @brief 微信终端向第三方程序请求提供内容的消息结构体。
 *
 * 微信终端向第三方程序请求提供内容，微信终端会向第三方程序发送GetMessageFromWXReq消息结构体，
 * 需要第三方程序调用sendResp返回一个GetMessageFromWXResp消息结构体。
 */
@interface GetMessageFromWXReq : BaseReq
@property (nonatomic, retain) NSString* lang;
@property (nonatomic, retain) NSString* country;
@end



#pragma mark - GetMessageFromWXResp
/*! @brief 微信终端向第三方程序请求提供内容，第三方程序向微信终端返回的消息结构体。
 *
 * 微信终端向第三方程序请求提供内容，第三方程序调用sendResp向微信终端返回一个GetMessageFromWXResp消息结构体。
 */
@interface GetMessageFromWXResp : BaseResp
/** 向微信终端提供的文本内容
 @note 文本长度必须大于0且小于10K
 */
@property (nonatomic, retain) NSString* text;
/** 向微信终端提供的多媒体内容。
 * @see WXMediaMessage
 */
@property (nonatomic, retain) WXMediaMessage* message;
/** 向微信终端提供内容的消息类型，包括文本消息和多媒体消息两种，两者只能选择其一，不能同时发送文本和多媒体消息 */
@property (nonatomic, assign) BOOL bText;
@end



#pragma mark - ShowMessageFromWXReq
/*! @brief 微信通知第三方程序，要求第三方程序显示的消息结构体。
 *
 * 微信需要通知第三方程序显示或处理某些内容时，会向第三方程序发送ShowMessageFromWXReq消息结构体。
 * 第三方程序处理完内容后调用sendResp向微信终端发送ShowMessageFromWXResp。
 */
@interface ShowMessageFromWXReq : BaseReq
/** 微信终端向第三方程序发送的要求第三方程序处理的多媒体内容
 * @see WXMediaMessage
 */
@property (nonatomic, retain) WXMediaMessage* message;
@property (nonatomic, retain) NSString* lang;
@property (nonatomic, retain) NSString* country;
@end



#pragma mark - ShowMessageFromWXResp
/*! @brief 微信通知第三方程序，要求第三方程序显示或处理某些消息，第三方程序处理完后向微信终端发送的处理结果。
 *
 * 微信需要通知第三方程序显示或处理某些内容时，会向第三方程序发送ShowMessageFromWXReq消息结构体。
 * 第三方程序处理完内容后调用sendResp向微信终端发送ShowMessageFromWXResp。
 */
@interface ShowMessageFromWXResp : BaseResp
@end



#pragma mark - LaunchFromWXReq
/*! @brief 微信终端打开第三方程序携带的消息结构体
 *
 *  微信向第三方发送的结构体，第三方不需要返回
 */
@interface LaunchFromWXReq : BaseReq
@property (nonatomic, retain) WXMediaMessage* message;
@property (nonatomic, retain) NSString* lang;
@property (nonatomic, retain) NSString* country;
@end

#pragma mark - OpenTempSessionReq
/* ! @brief 第三方通知微信，打开临时会话
 *
 * 第三方通知微信，打开临时会话
 */
@interface OpenTempSessionReq : BaseReq
/** 需要打开的用户名
 * @attention 长度不能超过512字节
 */
@property (nonatomic, retain) NSString* username;
/** 开发者自定义参数，拉起临时会话后会发给开发者后台，可以用于识别场景
 * @attention 长度不能超过32位
 */
@property (nonatomic, retain) NSString*  sessionFrom;
@end

#pragma mark - OpenTempSessionResp
/*! @brief 微信终端向第三方程序返回的OpenTempSessionReq处理结果。
 *
 * 第三方程序向微信终端发送OpenTempSessionReq后，微信发送回来的处理结果，该结果用OpenTempSessionResp表示。
 */
@interface OpenTempSessionResp : BaseResp

@end

#pragma mark - OpenWebviewReq
/* ! @brief 第三方通知微信启动内部浏览器，打开指定网页
 *
 *  第三方通知微信启动内部浏览器，打开指定Url对应的网页
 */
@interface OpenWebviewReq : BaseReq
/** 需要打开的网页对应的Url
 * @attention 长度不能超过1024
 */
@property(nonatomic,retain)NSString* url;

@end

#pragma mark - OpenWebviewResp
/*! @brief 微信终端向第三方程序返回的OpenWebviewReq处理结果
 *
 * 第三方程序向微信终端发送OpenWebviewReq后，微信发送回来的处理结果，该结果用OpenWebviewResp表示
 */
@interface OpenWebviewResp : BaseResp

@end

#pragma mark - OpenRankListReq
/* ! @brief 第三方通知微信，打开硬件排行榜
 *
 * 第三方通知微信，打开硬件排行榜
 */
@interface OpenRankListReq : BaseReq

@end

#pragma mark - OpenRanklistResp
/*! @brief 微信终端向第三方程序返回的OpenRankListReq处理结果。
 *
 * 第三方程序向微信终端发送OpenRankListReq后，微信发送回来的处理结果，该结果用OpenRankListResp表示。
 */
@interface OpenRankListResp : BaseResp

@end

#pragma mark - JumpToBizProfileReq
/* ! @brief 第三方通知微信，打开指定微信号profile页面
 *
 * 第三方通知微信，打开指定微信号profile页面
 */
@interface JumpToBizProfileReq : BaseReq
/** 跳转到该公众号的profile
 * @attention 长度不能超过512字节
 */
@property (nonatomic, retain) NSString* username;
/** 如果用户加了该公众号为好友，extMsg会上传到服务器
 * @attention 长度不能超过1024字节
 */
@property (nonatomic, retain) NSString* extMsg;
/**
 * 跳转的公众号类型
 * @see WXBizProfileType
 */
@property (nonatomic, assign) int profileType;
@end



#pragma mark - JumpToBizWebviewReq
/* ! @brief 第三方通知微信，打开指定usrname的profile网页版
 *
 */
@interface JumpToBizWebviewReq : BaseReq
/** 跳转的网页类型，目前只支持广告页
 * @see WXMPWebviewType
 */
@property(nonatomic, assign) int webType;
/** 跳转到该公众号的profile网页版
 * @attention 长度不能超过512字节
 */
@property(nonatomic, retain) NSString* tousrname;
/** 如果用户加了该公众号为好友，extMsg会上传到服务器
 * @attention 长度不能超过1024字节
 */
@property(nonatomic, retain) NSString* extMsg;

@end

#pragma mark - WXCardItem

@interface WXCardItem : NSObject
/** 卡id
 * @attention 长度不能超过1024字节
 */
@property (nonatomic,retain) NSString* cardId;
/** ext信息
 * @attention 长度不能超过2024字节
 * 具体见http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html#.E9.99.84.E5.BD.954-.E5.8D.A1.E5.88.B8.E6.89.A9.E5.B1.95.E5.AD.97.E6.AE.B5.E5.8F.8A.E7.AD.BE.E5.90.8D.E7.94.9F.E6.88.90.E7.AE.97.E6.B3.95 卡券扩展字段cardExt说明
 */
@property (nonatomic,retain) NSString* extMsg;
/**
 * @attention 卡的状态,req不需要填。resp:0为未添加，1为已添加。
 */
@property (nonatomic,assign) UInt32 cardState;
@end;

#pragma mark - AddCardToWXCardPackageReq
/* ! @brief 请求添加卡券至微信卡包
 *
 */

@interface AddCardToWXCardPackageReq : BaseReq
/** 卡列表
 * @attention 个数不能超过40个 类型WXCardItem
 */
@property (nonatomic,retain) NSArray* cardAry;

@end


#pragma mark - AddCardToWXCardPackageResp
/** ! @brief 微信返回第三方添加卡券结果
 *
 */

@interface AddCardToWXCardPackageResp : BaseResp
/** 卡列表
 * @attention 个数不能超过40个 类型WXCardItem
 */
@property (nonatomic,retain) NSArray* cardAry;
@end

#pragma mark - WXMediaMessage

/*! @brief 多媒体消息结构体
 *
 * 用于微信终端和第三方程序之间传递消息的多媒体消息内容
 */
@interface WXMediaMessage : NSObject

+(WXMediaMessage *) message;

/** 标题
 * @note 长度不能超过512字节
 */
@property (nonatomic, retain) NSString *title;
/** 描述内容
 * @note 长度不能超过1K
 */
@property (nonatomic, retain) NSString *description;
/** 缩略图数据
 * @note 大小不能超过32K
 */
@property (nonatomic, retain) NSData   *thumbData;
/**
 * @note 长度不能超过64字节
 */
@property (nonatomic, retain) NSString *mediaTagName;
/**
 *
 */
@property (nonatomic, retain) NSString *messageExt;
@property (nonatomic, retain) NSString *messageAction;
/**
 * 多媒体数据对象，可以为WXImageObject，WXMusicObject，WXVideoObject，WXWebpageObject等。
 */
@property (nonatomic, retain) id        mediaObject;

/*! @brief 设置消息缩略图的方法
 *
 * @param image 缩略图
 * @note 大小不能超过32K
 */
- (void) setThumbImage:(UIImage *)image;

@end



#pragma mark - WXImageObject
/*! @brief 多媒体消息中包含的图片数据对象
 *
 * 微信终端和第三方程序之间传递消息中包含的图片数据对象。
 * @note imageData和imageUrl成员不能同时为空
 * @see WXMediaMessage
 */
@interface WXImageObject : NSObject
/*! @brief 返回一个WXImageObject对象
 *
 * @note 返回的WXImageObject对象是自动释放的
 */
+(WXImageObject *) object;

/** 图片真实数据内容
 * @note 大小不能超过10M
 */
@property (nonatomic, retain) NSData    *imageData;
/** 图片url
 * @note 长度不能超过10K
 */
@property (nonatomic, retain) NSString  *imageUrl;

@end


#pragma mark - WXMusicObject
/*! @brief 多媒体消息中包含的音乐数据对象
 *
 * 微信终端和第三方程序之间传递消息中包含的音乐数据对象。
 * @note musicUrl和musicLowBandUrl成员不能同时为空。
 * @see WXMediaMessage
 */
@interface WXMusicObject : NSObject
/*! @brief 返回一个WXMusicObject对象
 *
 * @note 返回的WXMusicObject对象是自动释放的
 */
+(WXMusicObject *) object;

/** 音乐网页的url地址
 * @note 长度不能超过10K
 */
@property (nonatomic, retain) NSString *musicUrl;
/** 音乐lowband网页的url地址
 * @note 长度不能超过10K
 */
@property (nonatomic, retain) NSString *musicLowBandUrl;
/** 音乐数据url地址
 * @note 长度不能超过10K
 */
@property (nonatomic, retain) NSString *musicDataUrl;

/**音乐lowband数据url地址
 * @note 长度不能超过10K
 */
@property (nonatomic, retain) NSString *musicLowBandDataUrl;

@end



#pragma mark - WXVideoObject
/*! @brief 多媒体消息中包含的视频数据对象
 *
 * 微信终端和第三方程序之间传递消息中包含的视频数据对象。
 * @note videoUrl和videoLowBandUrl不能同时为空。
 * @see WXMediaMessage
 */
@interface WXVideoObject : NSObject
/*! @brief 返回一个WXVideoObject对象
 *
 * @note 返回的WXVideoObject对象是自动释放的
 */
+(WXVideoObject *) object;

/** 视频网页的url地址
 * @note 长度不能超过10K
 */
@property (nonatomic, retain) NSString *videoUrl;
/** 视频lowband网页的url地址
 * @note 长度不能超过10K
 */
@property (nonatomic, retain) NSString *videoLowBandUrl;

@end



#pragma mark - WXWebpageObject
/*! @brief 多媒体消息中包含的网页数据对象
 *
 * 微信终端和第三方程序之间传递消息中包含的网页数据对象。
 * @see WXMediaMessage
 */
@interface WXWebpageObject : NSObject
/*! @brief 返回一个WXWebpageObject对象
 *
 * @note 返回的WXWebpageObject对象是自动释放的
 */
+(WXWebpageObject *) object;

/** 网页的url地址
 * @note 不能为空且长度不能超过10K
 */
@property (nonatomic, retain) NSString *webpageUrl;

@end



#pragma mark - WXAppExtendObject
/*! @brief 多媒体消息中包含的App扩展数据对象
 *
 * 第三方程序向微信终端发送包含WXAppExtendObject的多媒体消息，
 * 微信需要处理该消息时，会调用该第三方程序来处理多媒体消息内容。
 * @note url，extInfo和fileData不能同时为空
 * @see WXMediaMessage
 */
@interface WXAppExtendObject : NSObject
/*! @brief 返回一个WXAppExtendObject对象
 *
 * @note 返回的WXAppExtendObject对象是自动释放的
 */
+(WXAppExtendObject *) object;

/** 若第三方程序不存在，微信终端会打开该url所指的App下载地址
 * @note 长度不能超过10K
 */
@property (nonatomic, retain) NSString *url;
/** 第三方程序自定义简单数据，微信终端会回传给第三方程序处理
 * @note 长度不能超过2K
 */
@property (nonatomic, retain) NSString *extInfo;
/** App文件数据，该数据发送给微信好友，微信好友需要点击后下载数据，微信终端会回传给第三方程序处理
 * @note 大小不能超过10M
 */
@property (nonatomic, retain) NSData   *fileData;

@end



#pragma mark - WXEmoticonObject
/*! @brief 多媒体消息中包含的表情数据对象
 *
 * 微信终端和第三方程序之间传递消息中包含的表情数据对象。
 * @see WXMediaMessage
 */
@interface WXEmoticonObject : NSObject

/*! @brief 返回一个WXEmoticonObject对象
 *
 * @note 返回的WXEmoticonObject对象是自动释放的
 */
+(WXEmoticonObject *) object;

/** 表情真实数据内容
 * @note 大小不能超过10M
 */
@property (nonatomic, retain) NSData    *emoticonData;

@end



#pragma mark - WXFileObject
/*! @brief 多媒体消息中包含的文件数据对象
 *
 * @see WXMediaMessage
 */
@interface WXFileObject : NSObject

/*! @brief 返回一个WXFileObject对象
 *
 * @note 返回的WXFileObject对象是自动释放的
 */
+(WXFileObject *) object;

/** 文件后缀名
 * @note 长度不超过64字节
 */
@property (nonatomic, retain) NSString  *fileExtension;

/** 文件真实数据内容
 * @note 大小不能超过10M
 */
@property (nonatomic, retain) NSData    *fileData;

@end
