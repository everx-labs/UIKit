//
//  UIKitScrollViewInsets.h
//  Pods
//
//  Created by Aleksei Savelev on 14.02.2022.
//

#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTConvert.h>

#import "UIKitScrollViewInsetsDelegate.h"

@interface UIKitScrollViewInsets : UIView <UIKitScrollViewInsetsDelegate>

- (instancetype)initWithBridge:(RCTBridge *)bridge;

@property (nonatomic, assign) BOOL automaticallyAdjustContentInsets;
@property (nonatomic, assign) BOOL automaticallyAdjustKeyboardInsets;
@property (nonatomic, assign) UIEdgeInsets contentInset;

@end
