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
#import <React/RCTScrollView.h>

#import "UIKitScrollViewInsetsDelegate.h"

@interface UIKitScrollViewInsets : NSObject <UIKitScrollViewInsetsDelegate>

- (instancetype)initWithScrollView:(RCTScrollView *)rctScrollView;
- (BOOL)didMoveToWindow;
- (void)onInsetsShouldBeRecalculated;
- (void)reset;

@property (nonatomic, assign) BOOL automaticallyAdjustContentInsets;
@property (nonatomic, assign) BOOL automaticallyAdjustKeyboardInsets;
@property (nonatomic, assign) UIEdgeInsets contentInset;
@property (nonatomic, copy) NSString *keyboardInsetAdjustmentBehavior;

@end
